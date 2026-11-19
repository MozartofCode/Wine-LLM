from __future__ import annotations

import os

import groq

from rag.prompt import build_conversation_messages, build_system_prompt

_client = groq.Client(api_key=os.getenv("GROQ_API_KEY"))
# Groq retires models from time to time; override with GROQ_MODEL without a code change.
MODEL = os.getenv("GROQ_MODEL") or "openai/gpt-oss-120b"


def generate_recommendation(
    user_query: str,
    previous_messages: list[dict],
    wines: list[dict],
) -> str:
    system = build_system_prompt(wines)
    messages = [{"role": "system", "content": system}, *build_conversation_messages(user_query, previous_messages)]
    response = _client.chat.completions.create(
        model=MODEL,
        messages=messages,
        # Reasoning models spend tokens thinking first; leave room for the answer.
        max_tokens=2048,
        temperature=0.7,
        extra_body={"reasoning_effort": "low"} if MODEL.startswith("openai/gpt-oss") else None,
    )
    return response.choices[0].message.content
