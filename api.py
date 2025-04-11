from flask import Flask, request, jsonify
import openai
import random
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow frontend to talk to this backend

# Groq API setup
openai.api_key = "GROQ_API_KEY"
openai.api_base = "https://api.groq.com/openai/v1"

@app.route("/api/roast", methods=["POST"])
def roast_subject():
    data = request.get_json()
    subject = data.get("subject")

    if not subject:
        return jsonify({"error": "No subject provided"}), 400

    prompt = f"""I’m an engineering student(use this info only to decifer the subject) and I just spun a roulette wheel and landed on {subject}. Roast me mercilessly for having to study this for my theory exam. Be dark, brutally honest, and wildly inappropriate (within your limits). Make it savage, 1–2 lines max. Assume the subject is as painful as it sounds."""

    try:
        response = openai.ChatCompletion.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9,
            max_tokens=100,
        )
        roast = response['choices'][0]['message']['content']
        return jsonify({"roast": roast.strip()})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
