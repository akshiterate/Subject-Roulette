# Subject Roast Roulette API

## Description:
Subject Roast Roulette API is a lighthearted and humorous backend service designed to roast engineering students based on the subjects they have to study. The API takes the name of an engineering subject, processes it with OpenAI’s Groq-powered AI, and generates a savage, humorous roast about the pain and struggle of dealing with that subject in an exam. Whether it's a tough, boring, or frustrating subject, this API provides a dark and brutally honest roast in just a few lines.

This project was built with **Flask** as the backend framework, and uses **Groq's API** for AI-powered text generation. The service is designed to work seamlessly with any frontend, thanks to its use of **CORS** for cross-origin requests. The API provides an endpoint where the frontend can send a subject and get a customized roast in return.

## Key Features:
- **AI-powered subject roasts**: Generate brutal and funny subject roasts.
- **Simple REST API**: Exposes a single endpoint (`/api/roast`) to accept subject names and return corresponding roasts.
- **Flask backend**: A lightweight, Python-based backend framework for fast development.
- **CORS enabled**: Allows your frontend app to communicate with the backend securely.

## Technologies Used:
- **Flask**: Lightweight web framework for Python, used to create the API.
- **OpenAI (Groq)**: Provides powerful AI for generating roasts based on given input.
- **CORS**: Cross-origin resource sharing, enabling the frontend to securely interact with the backend.
- **Python**: The programming language used for this project.
- **Gunicorn**: A WSGI server for deploying the app.

## API Endpoints:
### `GET /`
Returns a welcome message confirming that the Subject Roast API is running.

### `POST /api/roast`
Generates a roast based on the provided subject.

- **Request Body**:
  ```json
  {
    "subject": "Subject Name"
  }
