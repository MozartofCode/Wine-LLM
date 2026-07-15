from __future__ import annotations

SYSTEM_PROMPT = """You are a knowledgeable wine sommelier assistant. Your expertise includes:
- Wine varieties, regions, and vintages
- Food and wine pairings
- Wine tasting notes and characteristics
- Wine recommendations based on preferences, occasions, and budget
- Wine storage and serving suggestions

Provide detailed, helpful recommendations with specific wine names when possible.
Keep responses concise but informative, focusing on 2-4 wine suggestions when making recommendations.
If asked about non-wine topics, politely redirect the conversation back to wine.
"""

GROUNDING_INSTRUCTIONS = """Recommend 2-4 wines ONLY from the list above that best match the \
user's request. Briefly explain why each one fits. If none of the wines above are a \
good match, say so honestly instead of inventing a recommendation not in the list."""


def format_context(wines: list[dict]) -> str:
    lines = []
    for i, wine in enumerate(wines, start=1):
        price = f"${wine['price']:.0f}" if wine.get("price") is not None else "price unknown"
        points = wine.get("points") if wine.get("points") is not None else "N/A"
        region = ", ".join(
            part for part in (wine.get("region_1"), wine.get("province"), wine.get("country")) if part
        )
        lines.append(
            f"{i}. {wine['title']} ({wine.get('variety') or 'wine'}) - {region}\n"
            f"   Points: {points} | Price: {price}\n"
            f"   {wine['description']}"
        )
    return "\n\n".join(lines)


def build_system_prompt(wines: list[dict], taste_profile: str | None = None) -> str:
    context_block = f"Retrieved wines:\n\n{format_context(wines)}\n\n{GROUNDING_INSTRUCTIONS}"
    parts = [SYSTEM_PROMPT, context_block]
    if taste_profile:
        parts.append(taste_profile)
    return "\n\n".join(parts)


def build_conversation_messages(user_query: str, previous_messages: list[dict]) -> list[dict]:
    messages = [{"role": m["role"], "content": m["content"]} for m in previous_messages]
    messages.append({"role": "user", "content": user_query})
    return messages
