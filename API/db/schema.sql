-- Wine-LLM database schema (Supabase Postgres + pgvector).
-- Apply once to a fresh project, run `python scripts/ingest.py`, then run
-- the "after ingest" section at the bottom to build the vector index.
--
-- Embeddings are OpenAI text-embedding-3-small truncated to 256 dims
-- (see rag/embeddings.py). 256 keeps the whole database well inside the
-- Supabase free-plan 500 MB limit; 768 dims pushed it past 2 GB.

create extension if not exists vector with schema extensions;

create table if not exists public.wines (
  id          bigint generated always as identity primary key,
  title       text not null,
  variety     text,
  country     text,
  province    text,
  region_1    text,
  region_2    text,
  winery      text,
  designation text,
  points      integer,
  price       double precision,
  description text not null,
  taster_name text,
  embedding   extensions.vector(256)
);

-- Plain b-tree indexes for the Explorer's filters and sorts.
create index if not exists wines_variety_idx on public.wines (variety);
create index if not exists wines_country_idx on public.wines (country);
create index if not exists wines_points_idx  on public.wines (points desc);
create index if not exists wines_price_idx   on public.wines (price);

-- Index-only counts/offsets for the games (Blind Guess, Grape Match, Higher or
-- Lower). Without these the counts read the whole table and exceed the public
-- role's ~3s statement timeout. Run `vacuum (analyze) public.wines;` after ingest
-- so the planner can use index-only scans.
create index if not exists wines_variety_points_price_id_idx on public.wines (variety, points, price, id);
create index if not exists wines_priced_scored_id_idx on public.wines (id) where price is not null and points is not null;

-- Public site reads only. Writes happen with the service-role key (ingest),
-- which bypasses RLS, so there are deliberately no insert/update policies.
alter table public.wines enable row level security;

drop policy if exists "Wines are publicly readable" on public.wines;
create policy "Wines are publicly readable"
  on public.wines for select
  to anon, authenticated
  using (true);

-- Used by scripts/ingest.py to start from an empty table.
create or replace function public.truncate_wines()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  truncate table public.wines restart identity;
end;
$$;

revoke execute on function public.truncate_wines() from public, anon, authenticated;
grant execute on function public.truncate_wines() to service_role;

-- Hybrid search: vector similarity + optional structured filters in one query.
--
-- Written in plpgsql with EXECUTE format(...) on purpose: a plain SQL function
-- with a parameterised LIMIT is not reliably inlined, so the planner never uses
-- the ANN index inside it and falls back to a full scan (33 s vs ~100 ms).
create or replace function public.match_wines(
  query_embedding extensions.vector(256),
  match_count     integer default 6,
  filter_variety  text default null,
  filter_country  text default null,
  filter_price_lt double precision default null
)
returns table (
  id bigint,
  title text,
  variety text,
  country text,
  province text,
  region_1 text,
  region_2 text,
  winery text,
  designation text,
  points integer,
  price double precision,
  description text,
  taster_name text,
  distance double precision
)
language plpgsql
stable
set search_path = public, extensions
as $$
begin
  -- More IVFFlat lists searched = better recall, especially with filters.
  perform set_config('ivfflat.probes', '10', true);

  return query execute format(
    $q$
      select w.id, w.title, w.variety, w.country, w.province, w.region_1, w.region_2,
             w.winery, w.designation, w.points, w.price, w.description, w.taster_name,
             (w.embedding <-> $1)::double precision as distance
      from public.wines w
      where w.embedding is not null
        and ($2::text is null or w.variety = $2)
        and ($3::text is null or w.country = $3)
        and ($4::double precision is null or w.price < $4)
      order by w.embedding <-> $1
      limit %s
    $q$,
    greatest(1, least(coalesce(match_count, 6), 50))
  )
  using query_embedding, filter_variety, filter_country, filter_price_lt;
end;
$$;

grant execute on function public.match_wines(extensions.vector, integer, text, text, double precision)
  to anon, authenticated, service_role;

-- Wine communities (clubs, classes, tastings, festivals). Anonymous
-- submissions arrive as 'pending'; approve them in the Supabase dashboard by
-- setting status = 'approved'.
create table if not exists public.communities (
  id              bigint generated always as identity primary key,
  name            text not null,
  kind            text not null check (kind in ('club','class','tasting','festival','winery_event','supper_club')),
  city            text not null,
  lat             double precision not null,
  lng             double precision not null,
  url             text not null,
  schedule        text,
  recurring       boolean not null default false,
  next_date       date,
  price_tier      text check (price_tier in ('free','$','$$','$$$')),
  vibes           text[] not null default '{}',
  description     text,
  submitter_email text,
  status          text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at      timestamptz not null default now()
);

create index if not exists communities_status_geo_idx on public.communities (status, lat, lng);

alter table public.communities enable row level security;

drop policy if exists "Approved communities are public" on public.communities;
create policy "Approved communities are public"
  on public.communities for select
  to anon, authenticated
  using (status = 'approved');

-- Hide submitter emails from the public API even on approved rows.
revoke select on public.communities from anon, authenticated;
grant select (id, name, kind, city, lat, lng, url, schedule, recurring, next_date, price_tier, vibes, description, status, created_at)
  on public.communities to anon, authenticated;

-- 24h cache of OpenStreetMap (Overpass) results per ~1 km tile.
create table if not exists public.places_cache (
  tile       text primary key,
  payload    jsonb not null,
  fetched_at timestamptz not null default now()
);

alter table public.places_cache enable row level security;
-- No policies and no grants: only the service-role key (the Flask API) can read or write it.
revoke all on public.places_cache from anon, authenticated;

-- ---------------------------------------------------------------------------
-- After ingest: build the ANN index (IVFFlat builds in well under a minute on
-- the free tier; HNSW tends to hit the statement timeout at this size).
--
--   set maintenance_work_mem = '128MB';
--   create index if not exists wines_embedding_ivfflat
--     on public.wines using ivfflat (embedding extensions.vector_l2_ops) with (lists = 100);
--   vacuum (analyze) public.wines;
-- ---------------------------------------------------------------------------
