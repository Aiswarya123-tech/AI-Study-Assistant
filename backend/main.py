# main.py

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq_service import get_response
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_PATH = os.path.join(BASE_DIR, "..", "frontend")

app.mount("/frontend", StaticFiles(directory=FRONTEND_PATH, html=True), name="frontend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserPrompt(BaseModel):
    message: str

@app.get("/api")
def home():
    return {"message": "AI Study Assistant Running"}

@app.post("/chat")
def chat(data: UserPrompt):

    prompt = f"""
You are a conversational AI assistant.

Rules:
- Reply like ChatGPT
- Do NOT format as notes
- Do NOT use headings or bullet-heavy study format
- Keep answers simple, natural, and conversational

User: {data.message}
"""

    answer = get_response(prompt)
    return {"response": answer}
     

@app.post("/notes")
def notes(data: UserPrompt):

    prompt = f"""
    Create detailed study notes on:
    {data.message}
    """

    answer = get_response(prompt)

    return {"response": answer}

@app.post("/quiz")
def quiz(data: UserPrompt):

    prompt = f"""
Create a quiz on {data.message}.

STRICT FORMAT:

Question 1: What is Python?
a) Language
b) Snake
c) Car
d) Game
Answer: a

Question 2: ...

Rules:
- Always include question text clearly
- Always include 4 options
- Always include Answer: a/b/c/d only
"""

    answer = get_response(prompt)
    return {"response": answer}

@app.post("/summary")
def summary(data: UserPrompt):

    prompt = f"""
    Summarize the following topic:
    {data.message}
    """

    answer = get_response(prompt)

    return {"response": answer}

