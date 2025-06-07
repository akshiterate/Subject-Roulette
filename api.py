from flask import Flask, request, jsonify
import os
import random
from flask_cors import CORS
import logging
from openai import OpenAI

app = Flask(__name__)
CORS(app) 

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Groq client setup
client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

@app.route("/", methods=["GET"])
def home():
    return "Subject Roast API is running!"

@app.route("/api/roast", methods=["POST"])
def roast_subject():
    data = request.get_json()
    print("Received:", data)
    subject = data.get("subject")

    if not subject:
        return jsonify({"error": "No subject provided"}), 400

prompt = f"""I spun a roulette wheel and landed on {subject}, a topic so cursed it’s my personal doomsday for this exam. You’re a deranged, apocalyptic comedian who thrives on obliterating souls with dark humor. Roast me into cosmic ashes with a 1–2 line burn so unhinged, savage, and hilariously brutal it feels like the universe is cackling at my torment. Go full chaos—make my pain a legend, but don’t break reality."""
    try:
        response = client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=1.1,
            top_p=0.95,
            max_tokens=50,
        )
        roast = response.choices[0].message.content
        return jsonify({"roast": roast.strip()})
    except Exception as e:
        logger.error("Error occurred: %s", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
