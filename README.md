# Wine-LLM – AI-Powered Wine Recommendation System

**A real Retrieval-Augmented Generation (RAG) wine sommelier: vector search over 111,567 wine reviews, grounded recommendations from Groq (Llama), a browsable wine explorer, saved favorites with a taste profile, and shareable recommendation cards.**

## Overview

**Wine-LLM** helps users find the right wine for any occasion. A user's question is embedded and matched against a Postgres/pgvector index of the Kaggle wine-reviews dataset; the retrieved wines are passed to a Groq-hosted Llama model, which recommends 2-4 of them and explains why — grounded in real data, not invented. Beyond chat, the app has a filterable wine explorer, sign-in with saved favorites that personalize future recommendations, and shareable wine pages with auto-generated social preview cards.

## Key Features

- **Grounded Wine Recommendations**: Ask things like "I'm having seafood tonight; what French wine pairs well?" — the model recommends only from wines actually retrieved via vector search, and says so if nothing fits well.
- **Wine Finder** (`/explore`): browse and filter all 111K+ wines by variety, country, and price.
- **Saved Favorites & Taste Profile** (`/saved`): sign in with a magic link to save wines; saved wines are summarized (favorite varieties, countries, typical price range) and folded into future chat recommendations.
- **Shareable Wine Pages** (`/wine/[id]`): every wine has a detail page with similar-wine suggestions, a Share button (native share sheet with clipboard fallback), and a server-generated Open Graph image for rich social previews.

## How the RAG Pipeline & Vector Library Work

This is a genuine retrieval-augmented generation pipeline, not a keyword search dressed up as one. Two separate stages:

**1. Offline ingestion (`API/scripts/ingest.py`)** — run once (or whenever the source data changes):
- Loads `API/wine_metadata.csv` (the Kaggle `zynicide/wine-reviews` dataset), drops a stray index column, and null-guards missing fields.
- For each wine, builds an embedding input string that folds in structured context, not just the raw tasting note: `"{variety} from {country}, {province}. {title}. {description}"`. This measurably improves recall for queries like "a bold Spanish red" versus embedding the description alone.
- Batches these through **OpenAI's `text-embedding-3-small`**, truncated to **768 dimensions** via the API's native `dimensions` parameter (Matryoshka representation learning — this keeps the vector index compact and fast without materially hurting retrieval quality). Groq has no embeddings endpoint, so OpenAI is used solely for this step.
- Bulk-upserts all 111,567 rows into a Postgres table (`wines`) hosted on **Supabase**, with the embedding stored in a native `vector(768)` column via the **pgvector** extension.
- Also writes `API/rag/vocab.json` — the distinct list of varieties/countries in the dataset, used for cheap keyword-based filter extraction at query time (see below) without an extra LLM call.

**2. Query-time retrieval + generation (`API/rag/retriever.py`, `API/rag/generator.py`)** — on every chat message:
- The user's message is embedded the same way (same model, same 768 dims) via `rag/embeddings.py`.
- A lightweight regex/keyword pass (`extract_filters`) checks the message against the vocab list and a price-pattern regex (e.g. "under $20") to pull out optional structured filters — no LLM round-trip needed for this.
- A single Postgres function, **`match_wines`**, runs a **hybrid query**: pgvector's `<->` (L2 distance) operator ranks all wines by embedding similarity, while any extracted `variety`/`country`/`price` filters are applied as ordinary `WHERE` clauses in the same query — semantic search and structured filtering in one round trip, not two separate systems bolted together.
- The top matches are formatted into a numbered context block and passed to **Groq** (`llama-3.3-70b-versatile`) along with a system prompt that explicitly instructs the model to recommend **only** from the retrieved wines and to say so honestly if nothing fits — this is what makes it grounded rather than a model free-associating wine names it may have hallucinated.
- If the user is signed in, a taste-profile summary of their saved wines (`rag/taste_profile.py`) is appended to the system prompt too, so recommendations improve with use.

**The vector index itself** is an **IVFFlat** index (`vector_l2_ops`, `lists = 100`) rather than HNSW. This was a deliberate choice made while debugging on Supabase's free tier: HNSW graph construction on 111K × 768-dim vectors routinely exceeded the platform's statement timeout during index builds, while IVFFlat (essentially k-means clustering into buckets) builds in well under a minute with a small `maintenance_work_mem` bump. At this dataset size, IVFFlat's recall is effectively equivalent to HNSW for this use case.

One non-obvious bug worth documenting for anyone extending this: the first version of `match_wines` was a plain `language sql` function with `RETURNS TABLE(...)` and a parameterized `LIMIT`. Postgres's planner doesn't reliably inline SQL functions of that shape, which meant the ANN index optimization for `ORDER BY ... LIMIT` never kicked in *inside* the function — every call silently fell back to a brute-force distance scan over all 111K rows (**33 seconds** per query). The fix was rewriting it as a `plpgsql` function that builds the query with `EXECUTE format(...)`, baking the `LIMIT` in as a literal at execution time so the planner can use the index correctly. That dropped query time to **~70-150ms**.

## Tech Stack

- **Frontend**: Next.js 15 (React 19), TypeScript, Tailwind, shadcn/ui
- **Backend**: Flask (Python)
- **LLM**: Groq (`llama-3.3-70b-versatile`) for chat/generation — free tier
- **Embeddings**: OpenAI `text-embedding-3-small`, truncated to 768 dims (Groq has no embeddings API)
- **Vector store**: Supabase Postgres + `pgvector` (IVFFlat index, hybrid vector + structured-filter queries via a single RPC function)
- **Auth**: Supabase Auth (magic link)

## 🛠️ Installation & Setup

### Prerequisites

- Python 3.9+
- Node.js and npm
- **Groq API key** — free, from [console.groq.com/keys](https://console.groq.com/keys)
- **OpenAI API key** — used solely for embeddings, from [platform.openai.com](https://platform.openai.com/account/api-keys)
- A Supabase project with the `wines`, `profiles`, and `saved_wines` tables, the `pgvector` extension enabled, and the `match_wines` / `truncate_wines` RPC functions (see `API/scripts/ingest.py` for the ingestion side and the schema migration for the table/function definitions)

### Backend Setup

```bash
cd API
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env  # fill in GROQ_API_KEY, OPENAI_API_KEY, SUPABASE_KEY (service role)
```

**Run the ingestion script once** to embed `wine_metadata.csv` and load it into Supabase (also generates `rag/vocab.json`, used for lightweight filter extraction):

```bash
python scripts/ingest.py
```

Then start the API:

```bash
python app.py
```

The backend runs on `http://localhost:5001`.

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local  # NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

The app runs on `http://localhost:3000`.

## 🎯 Usage

- **Chat** (`/`): describe an occasion or dish and get grounded wine recommendations.
- **Explore** (`/explore`): filter the full wine catalog by variety, country, and price.
- **Saved** (`/saved`): sign in to see wines you've saved; saved wines personalize future chat recommendations.
- Every wine has a detail page (`/wine/[id]`) with similar-wine suggestions, a buy-it-elsewhere search link, and a Share button.

## Future Enhancements

- Live pricing/availability data and real affiliate partnerships
- Photo- or recipe-based food-pairing input
- Cellar inventory tracking

## Contact

**Author**: Bertan Berker
📧 Email: bb6363@rit.edu
💻 GitHub: [MozartofCode](https://github.com/MozartofCode)

**Author**: Jacob Sakelarios
📧 Email:
💻 GitHub:
