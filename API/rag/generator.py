from __future__ import annotations

import os

import groq

from rag.prompt import build_conversation_messages, build_system_prompt

_client = groq.Client(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"


def generate_recommendation(
    user_query: str,
    previous_messages: list[dict],
    wines: list[dict],
) -> str:
    system = build_system_prompt(wines)
    messages = [{"role": "system", "content": system}, *build_conversation_messages(user_query, previous_messages)]
    response = _client.chat.completions.create(
        model=MODEL, messages=messages, max_tokens=1024, temperature=0.7
    )
    return response.choices[0].message.content
