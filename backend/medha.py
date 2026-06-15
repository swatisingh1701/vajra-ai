from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import requests
import os

load_dotenv()

app = FastAPI()

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")


class ChatRequest(BaseModel):
    message: str


@app.post("/api/medha")
def medha_chat(data: ChatRequest):

    system_prompt = """
You are MEDHA AI, the cybersecurity assistant of Vajra AI.

Only answer questions related to:
- Cybersecurity
- Malware
- Phishing
- Networking basics
- Password security
- Privacy
- Digital safety

You can answer in English, Hindi, or Hinglish.

If a user asks unrelated questions, politely explain that MEDHA specializes in cybersecurity and digital safety.
"""

    response = requests.post(

        "https://api.sarvam.ai/v1/chat/completions",

        headers={
            "api-subscription-key": SARVAM_API_KEY,
            "Content-Type": "application/json"
        },

        json={

            "model": "sarvam-30b",

            "messages": [

                {
                    "role": "system",
                    "content": system_prompt
                },

                {
                    "role": "user",
                    "content": data.message
                }

            ],

            "temperature": 0.5,
            "max_tokens": 1000,
            "reasoning_effort": None

        }
    )

    result = response.json()

    reply = result["choices"][0]["message"]["content"]

    return {
        "reply": reply
    }