from flask import Flask, request, jsonify
import openai
import os
import logging

app = Flask(__name__)
openai.api_key = os.environ.get("GROQ_API_KEY")

logging.basicConfig(level=logging.INFO)

@app.route('/api/roast', methods=['POST'])
def roast_subject():
    try:
        data = request.get_json()
        logging.info(f"Received: {data}")

        subject = data.get('subject', 'your subject')
        if not subject:
            return jsonify({'error': 'No subject provided'}), 400

        # Call Groq API here
        response = openai.ChatCompletion.create(
            model="mixtral-8x7b-32768",
            messages=[
                {"role": "system", "content": "Roast the subject with some humor."},
                {"role": "user", "content": subject}
            ]
        )

        roast = response['choices'][0]['message']['content']
        return jsonify({'roast': roast})

    except Exception as e:
        logging.exception("Error occurred during roast generation")
        return jsonify({'error': str(e)}), 500
