"""City/address search through OpenStreetMap Nominatim.

Nominatim's usage policy: max 1 request/second, identify the app, cache
results. We throttle globally and memoise queries in memory.
"""
from __future__ import annotations

import os
import threading
import time

import requests

USER_AGENT = os.getenv("OSM_USER_AGENT") or "PourDecisions/1.0 (wine education site)"
URL = os.getenv("NOMINATIM_URL") or "https://nominatim.openstreetmap.org/search"

_lock = threading.Lock()
_last_call = 0.0
_cache: dict[str, list[dict]] = {}


def geocode(query: str) -> list[dict]:
    global _last_call
    q = " ".join(query.split())[:120]
    if not q:
        return []
    key = q.lower()
    if key in _cache:
        return _cache[key]

    with _lock:
        wait = 1.0 - (time.time() - _last_call)
        if wait > 0:
            time.sleep(wait)
        resp = requests.get(
            URL,
            params={"q": q, "format": "jsonv2", "limit": 5, "addressdetails": 0},
            headers={"User-Agent": USER_AGENT, "Accept-Language": "en"},
            timeout=15,
        )
        _last_call = time.time()
    resp.raise_for_status()
    results = [
        {"name": r.get("display_name"), "lat": float(r["lat"]), "lng": float(r["lon"])}
        for r in resp.json()
    ]
    if len(_cache) > 2000:
        _cache.clear()
    _cache[key] = results
    return results
