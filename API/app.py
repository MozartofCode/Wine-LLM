from dotenv import load_dotenv

load_dotenv()

import logging  # noqa: E402
import os  # noqa: E402

from flask import Flask, jsonify, request  # noqa: E402
from flask_cors import CORS  # noqa: E402
from flask_limiter import Limiter  # noqa: E402
from flask_limiter.util import get_remote_address  # noqa: E402
from werkzeug.middleware.proxy_fix import ProxyFix  # noqa: E402

from games.blind import get_daily_blind, get_grape_match_round, get_random_wines  # noqa: E402
from places.communities import (  # noqa: E402
    KINDS,
    PRICE_TIERS,
    VIBES,
    ValidationError,
    clean_submission,
    list_communities,
    submit_community,
    verify_turnstile,
)
from places.nominatim import geocode  # noqa: E402
from places.overpass import ALL_TYPES, find_places  # noqa: E402

from rag.generator import generate_recommendation  # noqa: E402
from rag.retriever import (  # noqa: E402
    get_filter_options,
    get_similar_wines,
    get_wine,
    get_wine_of_the_day,
    get_wines_by_ids,
    list_wines,
    search_wines,
)

app = Flask(__name__)
CORS(app)
log = logging.getLogger(__name__)

# Behind a hosting proxy (Render/Fly/Vercel rewrites) the client IP arrives in
# X-Forwarded-For; only trust it when told to, otherwise anyone could spoof it.
if os.getenv("TRUST_PROXY") == "1":
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["120 per minute"],
    storage_uri=os.getenv("RATELIMIT_STORAGE_URI", "memory://"),
)

GENERIC_ERROR = "Something went wrong on our side. Please try again in a moment."


@app.errorhandler(429)
def rate_limited(_e):
    return jsonify({"error": "You're going a bit fast. Take a sip and try again in a minute."}), 429


@app.route("/api/chat", methods=["POST"])
@limiter.limit("10 per minute;100 per day")
def chat():
    try:
        data = request.json or {}
        messages = data.get("messages", [])

        if not messages or not isinstance(messages, list):
            return jsonify({"error": "messages is required and must be a non-empty list"}), 400

        latest_message = messages[-1].get("content", "")
        previous_messages = messages[:-1]

        wines = search_wines(latest_message)
        text = generate_recommendation(latest_message, previous_messages, wines)
        return jsonify({"text": text, "wines": wines})

    except Exception as e:
        log.exception("request failed: %s", e)
        return jsonify({"error": GENERIC_ERROR}), 500


def _csv_param(name):
    raw = request.args.get(name)
    return [v for v in raw.split(",") if v] if raw else None


@app.route("/api/wines", methods=["GET"])
def wines():
    try:
        page = max(int(request.args.get("page", 1)), 1)
        page_size = min(max(int(request.args.get("page_size", 24)), 1), 100)
        price_min = request.args.get("price_min", type=float)
        price_max = request.args.get("price_max", type=float)

        result = list_wines(
            variety=_csv_param("variety"),
            country=_csv_param("country"),
            price_min=price_min,
            price_max=price_max,
            sort=request.args.get("sort", "points_desc"),
            page=page,
            page_size=page_size,
        )
        return jsonify(result)
    except Exception as e:
        log.exception("request failed: %s", e)
        return jsonify({"error": GENERIC_ERROR}), 500


@app.route("/api/wines/filters", methods=["GET"])
def wine_filters():
    return jsonify(get_filter_options())


@app.route("/api/wines/<int:wine_id>", methods=["GET"])
def wine_detail(wine_id):
    wine = get_wine(wine_id)
    if wine is None:
        return jsonify({"error": "Wine not found"}), 404
    return jsonify({"wine": wine, "similar": get_similar_wines(wine_id)})


@app.route("/api/wines/batch", methods=["GET"])
def wines_batch():
    raw = request.args.get("ids", "")
    try:
        ids = [int(x) for x in raw.split(",") if x.strip()]
    except ValueError:
        return jsonify({"error": "ids must be a comma-separated list of integers"}), 400
    ids = ids[:5]
    return jsonify({"wines": get_wines_by_ids(ids)})


@app.route("/api/wines/of-the-day", methods=["GET"])
def wine_of_the_day():
    wine = get_wine_of_the_day()
    if wine is None:
        return jsonify({"error": "No wines available"}), 404
    return jsonify({"wine": wine})


@app.route("/api/daily/blind", methods=["GET"])
def daily_blind():
    try:
        puzzle = get_daily_blind()
    except Exception as e:
        log.exception("daily blind failed: %s", e)
        return jsonify({"error": GENERIC_ERROR}), 500
    if puzzle is None:
        return jsonify({"error": "No puzzle available"}), 404
    return jsonify(puzzle)


@app.route("/api/play/random-wines", methods=["GET"])
@limiter.limit("30 per minute")
def play_random_wines():
    count = min(max(request.args.get("count", 10, type=int), 2), 20)
    try:
        return jsonify({"wines": get_random_wines(count)})
    except Exception as e:
        log.exception("random wines failed: %s", e)
        return jsonify({"error": GENERIC_ERROR}), 500


@app.route("/api/play/grape-match", methods=["GET"])
@limiter.limit("30 per minute")
def play_grape_match():
    try:
        return jsonify({"rounds": get_grape_match_round(4)})
    except Exception as e:
        log.exception("grape match failed: %s", e)
        return jsonify({"error": GENERIC_ERROR}), 500


@app.route("/api/simulate", methods=["POST"])
@limiter.limit("20 per minute")
def simulate():
    """Winemaking simulator: find the real wine closest to a described style."""
    description = str((request.json or {}).get("description", ""))[:600]
    if len(description) < 20:
        return jsonify({"error": "description is too short"}), 400
    try:
        return jsonify({"wines": search_wines(description, top_k=3)})
    except Exception as e:
        log.exception("simulate failed: %s", e)
        return jsonify({"error": GENERIC_ERROR}), 500


@app.route("/api/places", methods=["GET"])
@limiter.limit("30 per minute")
def places():
    lat = request.args.get("lat", type=float)
    lng = request.args.get("lng", type=float)
    if lat is None or lng is None or not (-90 <= lat <= 90 and -180 <= lng <= 180):
        return jsonify({"error": "lat and lng are required"}), 400
    radius = request.args.get("radius", 3000, type=int)
    types = [t for t in (_csv_param("types") or ALL_TYPES) if t in ALL_TYPES]
    try:
        return jsonify(find_places(lat, lng, radius, types))
    except Exception as e:
        log.exception("places failed: %s", e)
        return jsonify({"error": "The map data service is busy right now. Please try again in a minute."}), 503


@app.route("/api/geocode", methods=["GET"])
@limiter.limit("20 per minute")
def geocode_route():
    q = request.args.get("q", "")
    if len(q.strip()) < 2:
        return jsonify({"results": []})
    try:
        return jsonify({"results": geocode(q)})
    except Exception as e:
        log.exception("geocode failed: %s", e)
        return jsonify({"error": "Location search is busy right now. Please try again."}), 503


@app.route("/api/communities", methods=["GET"])
def communities():
    lat = request.args.get("lat", type=float)
    lng = request.args.get("lng", type=float)
    radius = min(max(request.args.get("radius_km", 40, type=float), 1), 200)
    try:
        return jsonify({"communities": list_communities(lat, lng, radius)})
    except Exception as e:
        log.exception("communities failed: %s", e)
        return jsonify({"error": GENERIC_ERROR}), 500


@app.route("/api/communities/options", methods=["GET"])
def community_options():
    return jsonify({"kinds": KINDS, "vibes": VIBES, "price_tiers": PRICE_TIERS})


@app.route("/api/communities", methods=["POST"])
@limiter.limit("5 per hour")
def submit_community_route():
    data = request.json or {}
    # Honeypot: real people never see or fill this field.
    if data.get("website_confirm"):
        return jsonify({"ok": True}), 201
    if not verify_turnstile(data.get("turnstile_token"), request.remote_addr):
        return jsonify({"error": "Please complete the human check and try again."}), 400
    try:
        row = clean_submission(data)
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    try:
        submit_community(row)
    except Exception as e:
        log.exception("community submit failed: %s", e)
        return jsonify({"error": GENERIC_ERROR}), 500
    return jsonify({"ok": True}), 201


if __name__ == "__main__":
    app.run(debug=True, port=5001)
