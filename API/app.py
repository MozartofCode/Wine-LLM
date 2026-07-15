from dotenv import load_dotenv

load_dotenv()

from flask import Flask, jsonify, request  # noqa: E402
from flask_cors import CORS  # noqa: E402

from db.auth import get_user_id_from_token  # noqa: E402
from rag.generator import generate_recommendation  # noqa: E402
from rag.retriever import get_filter_options, get_similar_wines, get_wine, list_wines, search_wines  # noqa: E402
from rag.taste_profile import get_taste_profile_summary  # noqa: E402

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

        user_id = get_user_id_from_token(data.get("access_token", ""))
        taste_profile = get_taste_profile_summary(user_id) if user_id else None

        wines = search_wines(latest_message)
        text = generate_recommendation(latest_message, previous_messages, wines, taste_profile)
        return jsonify({"text": text, "wines": wines})

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/wines", methods=["GET"])
def wines():
    try:
        page = max(int(request.args.get("page", 1)), 1)
        page_size = min(max(int(request.args.get("page_size", 24)), 1), 100)
        price_min = request.args.get("price_min", type=float)
        price_max = request.args.get("price_max", type=float)

        result = list_wines(
            variety=request.args.get("variety") or None,
            country=request.args.get("country") or None,
            price_min=price_min,
            price_max=price_max,
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


if __name__ == "__main__":
    app.run(debug=True, port=5001)
