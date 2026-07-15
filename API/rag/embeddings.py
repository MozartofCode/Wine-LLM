import os
import time

from openai import OpenAI

EMBED_MODEL = "text-embedding-3-small"
EMBED_DIMENSIONS = 768
MAX_RETRIES = 5

_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def embed_texts(texts: list[str]) -> list[list[float]]:
    for attempt in range(MAX_RETRIES):
        try:
            response = _client.embeddings.create(
                model=EMBED_MODEL, input=texts, dimensions=EMBED_DIMENSIONS
            )
            return [item.embedding for item in response.data]
        except Exception as exc:
            if attempt == MAX_RETRIES - 1:
                raise
            wait = 2**attempt
            print(f"Embedding request failed ({exc}); retrying in {wait}s...")
            time.sleep(wait)


def embed_query(text: str) -> list[float]:
    return embed_texts([text])[0]


def build_embedding_text(record: dict) -> str:
    variety = record.get("variety") or "Wine"
    country = record.get("country") or "Unknown origin"
    province = record.get("province") or ""
    return f"{variety} from {country}, {province}. {record['title']}. {record['description']}"
