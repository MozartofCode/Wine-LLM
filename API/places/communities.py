"""Wine communities: clubs, classes, tastings, festivals. Curated + submitted.

Submissions land as `pending`; the site owner approves them in the Supabase
dashboard. Public reads only ever see `approved` rows.
"""
from __future__ import annotations

import math
import os
import re

import requests

from db.supabase_client import get_supabase_client

KINDS = ["club", "class", "tasting", "festival", "winery_event", "supper_club"]
VIBES = ["beginner-friendly", "nerdy", "social", "date night", "family-friendly", "outdoors"]
PRICE_TIERS = ["free", "$", "$$", "$$$"]
COLUMNS = "id,name,kind,city,lat,lng,url,schedule,recurring,next_date,price_tier,vibes,description"
_URL_RE = re.compile(r"^https?://[^\s]{3,}$", re.IGNORECASE)


def _distance_km(lat1, lng1, lat2, lng2) -> float:
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lng2 - lng1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * 6371 * math.asin(math.sqrt(a))


def list_communities(lat: float | None, lng: float | None, radius_km: float = 40) -> list[dict]:
    query = get_supabase_client().table("communities").select(COLUMNS).eq("status", "approved")
    if lat is not None and lng is not None:
        # Cheap bounding box in SQL, exact distance in Python.
        dlat = radius_km / 111
        dlng = radius_km / (111 * max(math.cos(math.radians(lat)), 0.01))
        query = (
            query.gte("lat", lat - dlat).lte("lat", lat + dlat).gte("lng", lng - dlng).lte("lng", lng + dlng)
        )
    rows = query.limit(300).execute().data or []
    if lat is not None and lng is not None:
        for r in rows:
            r["distance_km"] = round(_distance_km(lat, lng, r["lat"], r["lng"]), 1)
        rows = [r for r in rows if r["distance_km"] <= radius_km]
        rows.sort(key=lambda r: r["distance_km"])
    return rows


def verify_turnstile(token: str | None, ip: str | None) -> bool:
    secret = os.getenv("TURNSTILE_SECRET")
    if not secret:
        return True  # not configured (local dev)
    if not token:
        return False
    resp = requests.post(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        data={"secret": secret, "response": token, "remoteip": ip or ""},
        timeout=10,
    )
    return bool(resp.json().get("success"))


class ValidationError(ValueError):
    pass


def clean_submission(data: dict) -> dict:
    def text(key, max_len, required=False):
        value = " ".join(str(data.get(key) or "").split())[:max_len]
        if required and not value:
            raise ValidationError(f"{key} is required")
        return value or None

    kind = data.get("kind")
    if kind not in KINDS:
        raise ValidationError("kind is invalid")
    url = text("url", 300, required=True)
    if not _URL_RE.match(url):
        raise ValidationError("url must start with http:// or https://")
    try:
        lat, lng = float(data.get("lat")), float(data.get("lng"))
    except (TypeError, ValueError):
        raise ValidationError("location is required")
    if not (-90 <= lat <= 90 and -180 <= lng <= 180):
        raise ValidationError("location is invalid")
    price = data.get("price_tier")
    vibes = [v for v in (data.get("vibes") or []) if v in VIBES][:4]
    next_date = data.get("next_date") or None
    if next_date and not re.match(r"^\d{4}-\d{2}-\d{2}$", str(next_date)):
        raise ValidationError("next_date must be YYYY-MM-DD")

    return {
        "name": text("name", 120, required=True),
        "kind": kind,
        "city": text("city", 120, required=True),
        "lat": lat,
        "lng": lng,
        "url": url,
        "schedule": text("schedule", 160),
        "recurring": bool(data.get("recurring")),
        "next_date": next_date,
        "price_tier": price if price in PRICE_TIERS else None,
        "vibes": vibes,
        "description": text("description", 400),
        "submitter_email": text("submitter_email", 200),
        "status": "pending",
    }


def submit_community(row: dict) -> None:
    get_supabase_client().table("communities").insert(row).execute()
