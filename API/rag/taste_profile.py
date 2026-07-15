from __future__ import annotations

from collections import Counter

from db.supabase_client import get_supabase_client


def get_taste_profile_summary(user_id: str) -> str | None:
    client = get_supabase_client()
    response = (
        client.table("saved_wines")
        .select("wines(variety,country,price)")
        .eq("user_id", user_id)
        .execute()
    )
    saved = [row["wines"] for row in response.data if row.get("wines")]
    if not saved:
        return None

    varieties = [w["variety"] for w in saved if w.get("variety")]
    countries = [w["country"] for w in saved if w.get("country")]
    prices = [w["price"] for w in saved if w.get("price") is not None]

    clues = []
    if varieties:
        top_variety, count = Counter(varieties).most_common(1)[0]
        if count > 1 or len(saved) == 1:
            clues.append(f"tends to save {top_variety}")
    if countries:
        top_country, count = Counter(countries).most_common(1)[0]
        if count > 1 or len(saved) == 1:
            clues.append(f"favors wines from {top_country}")
    if prices:
        avg_price = sum(prices) / len(prices)
        clues.append(f"typically saves wines around ${avg_price:.0f}")

    if not clues:
        return None
    return "Based on this user's saved wines, they " + ", ".join(clues) + "."
