from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv
from custom_rag import VectorDB, get_embeddings
import os

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app) 

# Configure OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Configure Groq (if using their Python client)
os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")


# This function handles the user's chat with the LLM
# :param: messages - messages from the user
# :param: model - the user's choice of model
# :return: response to the user's message
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        messages = data.get('messages', [])
        model_type = data.get('model', 'llama')
        
        # Extract the latest message and previous conversation
        latest_message = messages[-1]['content'] if messages else ""
        previous_messages = messages[:-1] if len(messages) > 1 else []
        
        # Get system prompt
        system_prompt = get_wine_prompt()
        
        if model_type == "openai":
            # Handle OpenAI request
            response = handle_openai_request(messages, system_prompt)
        elif model_type == "llama":
            # Handle Groq request
            response = handle_llama_request(messages, system_prompt)
        elif model_type == "rag":
            # Handle custom RAG model request
            response = handle_rag_request(latest_message, previous_messages)
        else:
            return jsonify({"error": f"Unsupported model: {model_type}"}), 400
        
        return jsonify({"text": response})
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500


# This function handles the openAI API response
# :param: messages - user's query
# :param: system_prompt - the system_prompt (background)
# :return: The wine recommendation
def handle_openai_request(messages, system_prompt):

    try:        
        response = client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {"role": "system", "content": system_prompt},
                *[{"role": m["role"], "content": m["content"]} for m in messages]
            ]
        )

        return response.choices[0].message.content
    except Exception as e:
        print(f"OpenAI API error: {str(e)}")
        return f"Error getting response from OpenAI: {str(e)}"


# This function handles the Llama (thru Groq API) response
# :param: messages - user's query
# :param: system_prompt - the system_prompt (background)
# :return: The wine recommendation
def handle_llama_request(messages, system_prompt):
    
    try:
        # If using the Groq Python client
        import groq
        client = groq.Client()
        
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": system_prompt},
                *[{"role": m["role"], "content": m["content"]} for m in messages]
            ],
            temperature=0.7,
            max_tokens=800
        )
        return response.choices[0].message.content
    except ImportError:
        # Fallback to using requests directly if groq client isn't installed
        import requests
        
        headers = {
            "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "llama3-70b-8192",
            "messages": [
                {"role": "system", "content": system_prompt},
                *[{"role": m["role"], "content": m["content"]} for m in messages]
            ],
            "temperature": 0.7,
            "max_tokens": 800
        }
        
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers=headers,
            json=payload
        )
        
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        else:
            return f"Error from Groq API: {response.text}"


# This function handles requests to our custom RAG model
# :param: query - The user's query
# :param: previous_message - user's previous messages
# :return: The rag response for possible wines
def handle_rag_request(query, previous_messages):

    vector_db = VectorDB('wine_embeddings.npy', 'wine_metadata.csv')
    
    try:
        # 1. Get real embeddings for the query
        query_embedding = get_embeddings(query)

        # 2. Search for relevant wines
        relevant_wines = vector_db.search(query_embedding, top_k=3)

        # 3. Build a natural language response
        response = "Here are some wines you might enjoy:\n\n"
        for _, wine in relevant_wines.iterrows():
            response += f"- {wine['title']} ({wine['country']}): {wine['description']} | Points: {wine['points']}, Price: ${wine['price']}\n\n"
        
        return response.strip()
    
    except Exception as e:
        print(f"Error in RAG response generation: {str(e)}")
        return "Sorry, I encountered an error while fetching wine recommendations."


# This function returns the system prompt for wine recommendations
# :param: None
# :return: System prompt
def get_wine_prompt():

    return """You are a knowledgeable wine sommelier assistant. Your expertise includes:
        - Wine varieties, regions, and vintages
        - Food and wine pairings
        - Wine tasting notes and characteristics
        - Wine recommendations based on preferences, occasions, and budget
        - Wine storage and serving suggestions

        Provide detailed, helpful recommendations with specific wine names when possible.
        Keep responses concise but informative, focusing on 2-4 wine suggestions when making recommendations.
        If asked about non-wine topics, politely redirect the conversation back to wine.
     """

if __name__ == '__main__':
    app.run(debug=True, port=5001)
