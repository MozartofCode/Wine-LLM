from __future__ import annotations

from db.supabase_client import get_supabase_client


def get_user_id_from_token(access_token: str) -> str | None:
    if not access_token:
        return None
    try:
        client = get_supabase_client()
        response = client.auth.get_user(access_token)
        return response.user.id if response and response.user else None
    except Exception:
        return None
