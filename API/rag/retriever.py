from __future__ import annotations

import json
import os
import re

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


def list_wines(
    variety: str | None = None,
    country: str | None = None,
    price_min: float | None = None,
    price_max: float | None = None,
    page: int = 1,
    page_size: int = 24,
) -> dict:
    client = get_supabase_client()
    query = client.table("wines").select(PUBLIC_COLUMNS, count="exact")

    if variety:
        query = query.eq("variety", variety)
    if country:
        query = query.eq("country", country)
    if price_min is not None:
        query = query.gte("price", price_min)
    if price_max is not None:
        query = query.lte("price", price_max)

    start = (page - 1) * page_size
    end = start + page_size - 1
    response = query.order("points", desc=True).range(start, end).execute()

    return {
        "wines": response.data,
        "total": response.count,
        "page": page,
        "page_size": page_size,
    }


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
