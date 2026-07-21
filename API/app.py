from dotenv import load_dotenv

load_dotenv()

from flask import Flask, jsonify, request  # noqa: E402
from flask_cors import CORS  # noqa: E402

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


@app.route("/api/chat", methods=["POST"])
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
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500


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
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500


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


if __name__ == "__main__":
    app.run(debug=True, port=5001)
