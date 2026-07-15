"""Offline ingestion: clean wine_metadata.csv, embed each row, and load it into
Supabase. Run manually (`python scripts/ingest.py`) whenever the source CSV
changes; never runs as part of a request handler.
"""
import json
import os
import sys

import pandas as pd
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv()

from db.supabase_client import get_supabase_client  # noqa: E402
from rag.embeddings import build_embedding_text, embed_texts  # noqa: E402

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "wine_metadata.csv")
VOCAB_PATH = os.path.join(os.path.dirname(__file__), "..", "rag", "vocab.json")
EMBED_BATCH_SIZE = 200
INSERT_BATCH_SIZE = 200


def load_and_clean(csv_path: str) -> pd.DataFrame:
    df = pd.read_csv(csv_path)
    df = df.drop(columns=[c for c in df.columns if c.startswith("Unnamed")], errors="ignore")
    df = df.dropna(subset=["title", "description", "price"])
    df = df.where(pd.notnull(df), None)
    return df.reset_index(drop=True)


def write_vocab(df: pd.DataFrame) -> None:
    varieties = sorted(v for v in df["variety"].dropna().unique())
    countries = sorted(v for v in df["country"].dropna().unique())
    with open(VOCAB_PATH, "w") as f:
        json.dump({"varieties": varieties, "countries": countries}, f, indent=2)
    print(f"Wrote {len(varieties)} varieties and {len(countries)} countries to {VOCAB_PATH}")


def batched(seq, size):
    for i in range(0, len(seq), size):
        yield seq[i : i + size]


def to_row(record: dict, embedding: list[float]) -> dict:
    return {
        "title": record["title"],
        "variety": record.get("variety"),
        "country": record.get("country"),
        "province": record.get("province"),
        "region_1": record.get("region_1"),
        "region_2": record.get("region_2"),
        "winery": record.get("winery"),
        "designation": record.get("designation"),
        "points": int(record["points"]) if record.get("points") is not None else None,
        "price": float(record["price"]) if record.get("price") is not None else None,
        "description": record["description"],
        "taster_name": record.get("taster_name"),
        "embedding": embedding,
    }


def main():
    df = load_and_clean(CSV_PATH)
    print(f"Loaded {len(df)} cleaned wine rows from {CSV_PATH}")

    write_vocab(df)

    records = df.to_dict(orient="records")
    supabase = get_supabase_client()

    print("Clearing existing wines table for a fresh ingest...")
    supabase.rpc("truncate_wines").execute()

    total = 0
    for batch in batched(records, EMBED_BATCH_SIZE):
        texts = [build_embedding_text(r) for r in batch]
        embeddings = embed_texts(texts)
        rows = [to_row(r, e) for r, e in zip(batch, embeddings)]

        for chunk in batched(rows, INSERT_BATCH_SIZE):
            supabase.table("wines").insert(chunk).execute()

        total += len(rows)
        print(f"Ingested {total}/{len(records)}", flush=True)

    print("Done.")


if __name__ == "__main__":
    main()
