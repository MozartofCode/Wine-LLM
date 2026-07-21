from __future__ import annotations

import hashlib
import json
import os
import re
from datetime import date

from db.supabase_client import get_supabase_client
from rag.embeddings import embed_query

TOP_K = 6
PUBLIC_COLUMNS = (
    "id,title,variety,country,province,region_1,region_2,winery,"
    "designation,points,price,description,taster_name"
)

_VOCAB_PATH = os.path.join(os.path.dirname(__file__), "vocab.json")
with open(_VOCAB_PATH) as f:
    _VOCAB = json.load(f)
    # Longest-first so multi-word varieties/countries match before shorter substrings
    # (e.g. "Cabernet Sauvignon" before "Cabernet Franc").
    _VARIETIES = sorted(_VOCAB["varieties"], key=len, reverse=True)
    _COUNTRIES = sorted(_VOCAB["countries"], key=len, reverse=True)

_PRICE_UNDER_RE = re.compile(r"(?:under|below|less than)\s*\$?(\d+)", re.IGNORECASE)


def get_filter_options() -> dict:
    return {"varieties": _VARIETIES, "countries": _COUNTRIES}


def extract_filters(query: str) -> dict:
    filters = {}

    price_match = _PRICE_UNDER_RE.search(query)
    if price_match:
        filters["price_lt"] = float(price_match.group(1))

    query_lower = query.lower()

    for variety in _VARIETIES:
        if variety.lower() in query_lower:
            filters["variety"] = variety
            break

    for country in _COUNTRIES:
        if country.lower() in query_lower:
            filters["country"] = country
            break

    return filters


def search_wines(query: str, top_k: int = TOP_K) -> list[dict]:
    query_embedding = embed_query(query)
    filters = extract_filters(query)

    client = get_supabase_client()
    response = client.rpc(
        "match_wines",
        {
            "query_embedding": query_embedding,
            "match_count": top_k,
            "filter_variety": filters.get("variety"),
            "filter_country": filters.get("country"),
            "filter_price_lt": filters.get("price_lt"),
        },
    ).execute()
    return response.data


_SORTS = {
    "points_desc": ("points", True),
    "price_asc": ("price", False),
    "price_desc": ("price", True),
}


def list_wines(
    variety: list[str] | None = None,
    country: list[str] | None = None,
    price_min: float | None = None,
    price_max: float | None = None,
    sort: str = "points_desc",
    page: int = 1,
    page_size: int = 24,
) -> dict:
    client = get_supabase_client()
    query = client.table("wines").select(PUBLIC_COLUMNS, count="exact")

    if variety:
        query = query.in_("variety", variety)
    if country:
        query = query.in_("country", country)
    if price_min is not None:
        query = query.gte("price", price_min)
    if price_max is not None:
        query = query.lte("price", price_max)

    column, desc = _SORTS.get(sort, _SORTS["points_desc"])

    start = (page - 1) * page_size
    end = start + page_size - 1
    response = query.order(column, desc=desc).range(start, end).execute()

    return {
        "wines": response.data,
        "total": response.count,
        "page": page,
        "page_size": page_size,
    }


def get_wines_by_ids(ids: list[int]) -> list[dict]:
    if not ids:
        return []
    client = get_supabase_client()
    response = client.table("wines").select(PUBLIC_COLUMNS).in_("id", ids).execute()
    by_id = {w["id"]: w for w in response.data}
    return [by_id[i] for i in ids if i in by_id]


def get_wine_of_the_day() -> dict | None:
    client = get_supabase_client()
    total = client.table("wines").select("id", count="exact").limit(1).execute().count or 0
    if total == 0:
        return None
    seed = date.today().isoformat()
    offset = int(hashlib.sha256(seed.encode()).hexdigest(), 16) % total
    resp = client.table("wines").select(PUBLIC_COLUMNS).order("id").range(offset, offset).execute()
    return resp.data[0] if resp.data else None


def get_wine(wine_id: int) -> dict | None:
    client = get_supabase_client()
    response = client.table("wines").select(PUBLIC_COLUMNS).eq("id", wine_id).limit(1).execute()
    return response.data[0] if response.data else None


def get_similar_wines(wine_id: int, top_k: int = 4) -> list[dict]:
    client = get_supabase_client()
    source = client.table("wines").select("embedding").eq("id", wine_id).limit(1).execute()
    if not source.data or source.data[0].get("embedding") is None:
        return []

    response = client.rpc(
        "match_wines",
        {
            "query_embedding": source.data[0]["embedding"],
            "match_count": top_k + 1,
            "filter_variety": None,
            "filter_country": None,
            "filter_price_lt": None,
        },
    ).execute()
    return [w for w in response.data if w["id"] != wine_id][:top_k]
