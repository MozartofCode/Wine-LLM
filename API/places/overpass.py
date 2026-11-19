"""Find wine places near a point using OpenStreetMap's Overpass API.

Overpass is a shared, volunteer-run service: results are cached per ~1 km tile
for 24h (Supabase `places_cache` when available, memory otherwise), and we try
a few public mirrors in turn.
"""
from __future__ import annotations

import json
import logging
import math
import os
import time

import requests

log = logging.getLogger(__name__)

_DEFAULT_ENDPOINTS = (
    "https://overpass-api.de/api/interpreter,"
    "https://overpass.private.coffee/api/interpreter,"
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
)
ENDPOINTS = [e.strip() for e in (os.getenv("OVERPASS_URLS") or _DEFAULT_ENDPOINTS).split(",") if e.strip()]
USER_AGENT = os.getenv("OSM_USER_AGENT") or "PourDecisions/1.0 (wine education site)"
CACHE_TTL_SECONDS = 24 * 3600
MAX_RADIUS_M = 15_000

# type -> list of Overpass tag filters (each is OR'ed)
TYPE_FILTERS: dict[str, list[str]] = {
    "winery": ['["craft"="winery"]', '["tourism"="wine_cellar"]', '["amenity"="winery"]'],
    "shop": ['["shop"="wine"]'],
    "bar": ['["amenity"="bar"]["bar"="wine"]', '["amenity"~"^(bar|pub|cafe)$"]["cuisine"~"wine"]', '["amenity"~"^(bar|pub)$"]["drink:wine"="yes"]'],
    "restaurant": ['["amenity"="restaurant"]["drink:wine"~"yes|served"]', '["amenity"="restaurant"]["cuisine"~"wine"]'],
}
ALL_TYPES = list(TYPE_FILTERS.keys())

_memory_cache: dict[str, tuple[float, list[dict]]] = {}


def _tile_key(lat: float, lng: float, radius: int) -> str:
    # ~1.1 km grid; radius bucketed so nearby searches share a cache entry.
    bucket = 3000 if radius <= 3000 else 8000 if radius <= 8000 else MAX_RADIUS_M
    return f"{round(lat, 2)}:{round(lng, 2)}:{bucket}"


def _classify(tags: dict) -> str:
    if tags.get("craft") == "winery" or tags.get("tourism") == "wine_cellar" or tags.get("amenity") == "winery":
        return "winery"
    if tags.get("shop") == "wine":
        return "shop"
    if tags.get("amenity") == "restaurant":
        return "restaurant"
    return "bar"


def _build_query(lat: float, lng: float, radius: int) -> str:
    parts = []
    for filters in TYPE_FILTERS.values():
        for f in filters:
            parts.append(f"nwr{f}(around:{radius},{lat},{lng});")
    return f"[out:json][timeout:25];({''.join(parts)});out center tags 300;"


def _distance_m(lat1, lng1, lat2, lng2) -> float:
    r = 6_371_000
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def _normalize(element: dict) -> dict | None:
    tags = element.get("tags") or {}
    name = tags.get("name")
    lat = element.get("lat") or (element.get("center") or {}).get("lat")
    lng = element.get("lon") or (element.get("center") or {}).get("lon")
    if not name or lat is None or lng is None:
        return None
    address = " ".join(
        p for p in [tags.get("addr:housenumber"), tags.get("addr:street")] if p
    ) or None
    return {
        "id": f"{element['type'][0]}{element['id']}",
        "name": name,
        "type": _classify(tags),
        "lat": lat,
        "lng": lng,
        "address": address,
        "city": tags.get("addr:city"),
        "website": tags.get("website") or tags.get("contact:website"),
        "phone": tags.get("phone") or tags.get("contact:phone"),
        "opening_hours": tags.get("opening_hours"),
    }


def _fetch(lat: float, lng: float, radius: int) -> list[dict]:
    query = _build_query(lat, lng, radius)
    last_error: Exception | None = None
    for url in ENDPOINTS:
        try:
            resp = requests.post(url, data={"data": query}, headers={"User-Agent": USER_AGENT}, timeout=30)
            resp.raise_for_status()
            elements = resp.json().get("elements", [])
            seen, places = set(), []
            for el in elements:
                place = _normalize(el)
                if place and place["id"] not in seen:
                    seen.add(place["id"])
                    places.append(place)
            return places
        except Exception as e:  # try the next mirror
            last_error = e
            log.warning("overpass mirror failed (%s): %s", url, e)
    raise RuntimeError(f"All Overpass mirrors failed: {last_error}")


def _cache_get(key: str) -> list[dict] | None:
    hit = _memory_cache.get(key)
    if hit and time.time() - hit[0] < CACHE_TTL_SECONDS:
        return hit[1]
    try:
        from db.supabase_client import get_supabase_client

        resp = (
            get_supabase_client()
            .table("places_cache")
            .select("payload,fetched_at")
            .eq("tile", key)
            .gte("fetched_at", time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() - CACHE_TTL_SECONDS)))
            .limit(1)
            .execute()
        )
        if resp.data:
            payload = resp.data[0]["payload"]
            places = payload if isinstance(payload, list) else json.loads(payload)
            _memory_cache[key] = (time.time(), places)
            return places
    except Exception as e:
        log.info("places_cache read skipped: %s", e)
    return None


def _cache_set(key: str, places: list[dict]) -> None:
    _memory_cache[key] = (time.time(), places)
    try:
        from db.supabase_client import get_supabase_client

        get_supabase_client().table("places_cache").upsert(
            {"tile": key, "payload": places, "fetched_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
        ).execute()
    except Exception as e:
        log.info("places_cache write skipped: %s", e)


def find_places(lat: float, lng: float, radius: int = 3000, types: list[str] | None = None) -> dict:
    radius = max(500, min(int(radius), MAX_RADIUS_M))
    key = _tile_key(lat, lng, radius)
    cached = _cache_get(key)
    places = cached if cached is not None else _fetch(round(lat, 2), round(lng, 2), _tile_key_radius(radius))
    if cached is None:
        _cache_set(key, places)

    wanted = set(types or ALL_TYPES)
    out = []
    for p in places:
        if p["type"] not in wanted:
            continue
        d = _distance_m(lat, lng, p["lat"], p["lng"])
        if d <= radius:
            out.append({**p, "distance_m": round(d)})
    out.sort(key=lambda p: p["distance_m"])
    return {"places": out[:150], "cached": cached is not None}


def _tile_key_radius(radius: int) -> int:
    # Fetch the full bucket radius (+ tile slack) so cached tiles serve any
    # smaller radius around nearby points.
    bucket = 3000 if radius <= 3000 else 8000 if radius <= 8000 else MAX_RADIUS_M
    return bucket + 800
