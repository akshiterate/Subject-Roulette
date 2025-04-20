from flask import Flask, request, jsonify
import os
import random
from flask_cors import CORS
import logging
from openai import OpenAI

# App setup
app = Flask(__name__)
CORS(app)  # Allow frontend to talk to this backend

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
    return "🎡 Subject Roast API is running!"

@app.route("/api/roast", methods=["POST"])
def roast_subject():
    data = request.get_json()
    print("Received:", data)
    subject = data.get("subject")

    if not subject:
        return jsonify({"error": "No subject provided"}), 400

prompt = f"""As an engineering student (use this only to interpret the subject’s engineering context), I spun a roulette wheel and landed on {subject}. I’m doomed to study this nightmare for my theory exam. You’re a ruthless, unhinged comedian tasked with roasting me into oblivion for this cursed choice. Unleash a brutal, darkly funny, apocalyptic-level burn that makes my suffering epic. Keep it 1–2 lines, but go feral—think end-of-the-world savage. Max out the chaos without breaking the universe."""
    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.9,
            max_tokens=100,
        )
        roast = response.choices[0].message.content
        return jsonify({"roast": roast.strip()})
    except Exception as e:
        logger.error("Error occurred: %s", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
