"""Daily Blind Guess + side-game helpers.

Picks real wines from the catalog and redacts every word that would give the
grape away, so players have to guess from the tasting note alone.
"""
from __future__ import annotations

import hashlib
import random
import re
from datetime import date, datetime, timezone

from db.supabase_client import get_supabase_client
from rag.retriever import PUBLIC_COLUMNS

# Single-grape wines that are common in the dataset and recognisable to players.
# Blends are excluded because "Red Blend" is not a fair answer.
GUESSABLE_VARIETIES = [
    "Pinot Noir",
    "Chardonnay",
    "Cabernet Sauvignon",
    "Riesling",
    "Sauvignon Blanc",
    "Syrah",
    "Merlot",
    "Zinfandel",
    "Malbec",
    "Sangiovese",
    "Nebbiolo",
    "Tempranillo",
    "Pinot Gris",
    "Cabernet Franc",
    "Grüner Veltliner",
    "Viognier",
    "Gewürztraminer",
    "Gamay",
    "Grenache",
]

# Dataset labels that should count as the same answer.
ALIASES = {
    "Shiraz": "Syrah",
    "Pinot Grigio": "Pinot Gris",
}

# Extra words that would make each grape too easy (synonyms, signature regions).
GIVEAWAYS = {
    "Pinot Noir": ["pinot", "noir", "burgundy", "bourgogne", "spätburgunder"],
    "Chardonnay": ["chardonnay", "chablis", "burgundy", "bourgogne", "meursault"],
    "Cabernet Sauvignon": ["cabernet", "cab", "sauvignon", "napa"],
    "Riesling": ["riesling", "kabinett", "spätlese", "auslese", "mosel"],
    "Sauvignon Blanc": ["sauvignon", "blanc", "sancerre", "marlborough", "fumé"],
    "Syrah": ["syrah", "shiraz", "hermitage", "côte-rôtie", "barossa"],
    "Merlot": ["merlot", "pomerol"],
    "Zinfandel": ["zinfandel", "zin", "primitivo"],
    "Malbec": ["malbec", "mendoza", "cahors"],
    "Sangiovese": ["sangiovese", "chianti", "brunello", "montalcino", "montepulciano"],
    "Nebbiolo": ["nebbiolo", "barolo", "barbaresco", "langhe"],
    "Tempranillo": ["tempranillo", "rioja", "ribera", "tinto"],
    "Pinot Gris": ["pinot", "gris", "grigio"],
    "Cabernet Franc": ["cabernet", "franc", "chinon"],
    "Grüner Veltliner": ["grüner", "gruner", "veltliner", "grüner veltliner"],
    "Viognier": ["viognier", "condrieu"],
    "Gewürztraminer": ["gewürztraminer", "gewurztraminer", "gewürz", "traminer"],
    "Gamay": ["gamay", "beaujolais", "morgon", "fleurie"],
    "Grenache": ["grenache", "garnacha", "châteauneuf"],
}

COUNTRY_ADJECTIVES = [
    "french", "italian", "spanish", "american", "californian", "german",
    "austrian", "australian", "argentine", "argentinian", "chilean",
    "portuguese", "oregon", "washington", "new zealand", "kiwi", "aussie",
]

MASK = "▇▇▇"
LAUNCH_DATE = date(2026, 11, 16)
_DATASET_LABELS = GUESSABLE_VARIETIES + list(ALIASES.keys())


def canonical_variety(variety: str | None) -> str | None:
    if variety is None:
        return None
    return ALIASES.get(variety, variety)


def _redact(text: str, wine: dict) -> str:
    variety = canonical_variety(wine.get("variety")) or ""
    terms: set[str] = {variety, wine.get("variety") or ""}
    terms.update(GIVEAWAYS.get(variety, []))
    for field in ("country", "province", "region_1", "region_2", "winery", "designation"):
        value = wine.get(field)
        if value:
            terms.add(value)
            # Also mask the distinctive words of multi-word names ("Willamette Valley").
            terms.update(w for w in re.split(r"[\s\-']+", value) if len(w) > 4)
    terms.update(COUNTRY_ADJECTIVES)
    terms = {t for t in terms if t and len(t) > 2}

    for term in sorted(terms, key=len, reverse=True):
        text = re.sub(rf"(?<!\w){re.escape(term)}(?:e?s|'s)?(?!\w)", MASK, text, flags=re.IGNORECASE)
    # Collapse runs like "▇▇▇ ▇▇▇" into a single mask.
    return re.sub(rf"{MASK}(?:[\s\-']+{MASK})+", MASK, text)


def _public_puzzle(wine: dict, number: int | None = None) -> dict:
    variety = canonical_variety(wine["variety"])
    return {
        "number": number,
        "wine_id": wine["id"],
        "note": _redact(wine["description"], wine),
        "clues": {
            "price": wine.get("price"),
            "points": wine.get("points"),
            "country": wine.get("country"),
            "province": wine.get("province"),
        },
        "answer": variety,
        "options": GUESSABLE_VARIETIES,
    }


def _guessable_query(client, columns: str, count: str | None = None):
    query = client.table("wines").select(columns, count=count) if count else client.table("wines").select(columns)
    return query.in_("variety", _DATASET_LABELS).gte("points", 88).not_.is_("price", "null")


_daily_cache: dict[str, dict] = {}


def get_daily_blind(today: date | None = None) -> dict | None:
    # UTC so the puzzle flips at the same moment as the frontend's daily cards.
    today = today or datetime.now(timezone.utc).date()
    key = today.isoformat()
    if key in _daily_cache:
        return _daily_cache[key]

    client = get_supabase_client()
    total = _guessable_query(client, "id", count="exact").limit(1).execute().count or 0
    if total == 0:
        return None

    offset = int(hashlib.sha256(f"blind:{key}".encode()).hexdigest(), 16) % total
    # Walk forward a few rows if the note is too short to be a fair puzzle.
    resp = _guessable_query(client, PUBLIC_COLUMNS).order("id").range(offset, offset + 9).execute()
    rows = resp.data or []
    if not rows:
        return None
    wine = next((w for w in rows if len(w.get("description") or "") >= 150), rows[0])

    number = (today - LAUNCH_DATE).days + 1
    puzzle = _public_puzzle(wine, number=max(number, 1))
    _daily_cache.clear()
    _daily_cache[key] = puzzle
    return puzzle


def _random_rows(client, count: int, query_factory) -> list[dict]:
    total = query_factory("id", "exact").limit(1).execute().count or 0
    if total == 0:
        return []
    offsets = random.sample(range(total), min(count, total))
    rows = []
    for offset in offsets:
        resp = query_factory(PUBLIC_COLUMNS, None).order("id").range(offset, offset).execute()
        rows.extend(resp.data or [])
    return rows


def get_random_wines(count: int = 10) -> list[dict]:
    """Random wines that have both price and points (for Higher or Lower)."""
    client = get_supabase_client()

    def factory(columns, cnt):
        q = client.table("wines").select(columns, count=cnt) if cnt else client.table("wines").select(columns)
        return q.not_.is_("price", "null").not_.is_("points", "null")

    return _random_rows(client, count, factory)


def get_grape_match_round(size: int = 4) -> list[dict]:
    """`size` wines, each a different guessable grape, with redacted notes."""
    client = get_supabase_client()
    picks = random.sample(GUESSABLE_VARIETIES, size)
    rounds = []
    for variety in picks:
        labels = [variety] + [k for k, v in ALIASES.items() if v == variety]

        def factory(columns, cnt, labels=labels):
            q = client.table("wines").select(columns, count=cnt) if cnt else client.table("wines").select(columns)
            return q.in_("variety", labels).gte("points", 87)

        rows = _random_rows(client, 1, factory)
        if rows:
            rounds.append(_public_puzzle(rows[0]))
    return rounds
