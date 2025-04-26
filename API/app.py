from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv
import time
from custom_rag import get_rag_response

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Configure Groq (if using their Python client)
os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        messages = data.get('messages', [])
        model_type = data.get('model', 'groq')
        
        # Extract the latest message and previous conversation
        latest_message = messages[-1]['content'] if messages else ""
        previous_messages = messages[:-1] if len(messages) > 1 else []
        
        # Get system prompt
        system_prompt = get_wine_prompt()
        
        if model_type == "openai":
            # Handle OpenAI request
            response = handle_openai_request(messages, system_prompt)
        elif model_type == "groq":
            # Handle Groq request
            response = handle_groq_request(messages, system_prompt)
        elif model_type == "rag":
            # Handle custom RAG model request
            response = handle_rag_request(latest_message, previous_messages)
        else:
            return jsonify({"error": f"Unsupported model: {model_type}"}), 400
        
        return jsonify({"text": response})
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

def handle_openai_request(messages, system_prompt):
    """Handle request to OpenAI API"""

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


def handle_groq_request(messages, system_prompt):
    """Handle request to Groq API"""
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

def handle_rag_request(query, previous_messages):
    """Handle request to custom RAG model"""
    # This calls your custom RAG implementation from the imported module
    return get_rag_response(query, previous_messages)

def get_wine_prompt():
    """Return the system prompt for wine recommendations"""
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
