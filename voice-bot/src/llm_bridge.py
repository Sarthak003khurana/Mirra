import logging
import os
import random

import requests

logger = logging.getLogger(__name__)

OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama3")

FALLBACK_QUESTIONS = [
    "What is polymorphism?",
    "Explain REST API?",
    "Tell me about a project?",
    "What is OOP?",
    "How do you debug code?",
    "Describe a challenging situation?",
    "What is database indexing?",
]

FALLBACK_FOLLOWUPS = [
    "Can you explain that further?",
    "What happens internally?",
    "Can you give an example?",
    "Why is this important?",
    "How does it work?",
]


class LLMBridge:
    """Wraps a local Ollama server for question generation, answer analysis,
    and follow-ups. No third-party AI APIs - everything hits localhost."""

    def __init__(self, url: str = OLLAMA_URL, model: str = OLLAMA_MODEL):
        self.url = url
        self.model = model

    def _generate(self, prompt: str, num_predict: int = 200, temperature: float = 0.7) -> str:
        try:
            response = requests.post(
                self.url,
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {"num_predict": num_predict, "temperature": temperature},
                },
                timeout=30,
            )
            response.raise_for_status()
            return response.json().get("response", "").strip()
        except requests.RequestException as exc:
            logger.error("Ollama request failed: %s", exc)
            return ""

    def generate_question(self, resume_context: dict, style: str | None = None) -> str:
        style = style or random.choice(
            ["technical concept", "problem solving", "behavioral", "situational", "mixed"]
        )
        prompt = f"""You are a professional interviewer.

Candidate background:
Skills: {resume_context.get("skills", [])}
Projects: {resume_context.get("projects", [])}
Achievements: {resume_context.get("achievements", [])}

Interview style: {style}

Task:
Generate EXACTLY ONE short interview question.

Rules:
- Maximum 10 words
- Must end with a question mark
- No explanation
- No extra text
- Do NOT repeat the same question

Now generate the question."""
        question = self._generate(prompt, num_predict=20)
        if not question or len(question) < 5 or "?" not in question:
            return random.choice(FALLBACK_QUESTIONS)
        return question

    def analyze_answer(self, question: str, answer: str) -> str:
        prompt = f"""You are a strict technical interviewer.

Evaluate the candidate's answer.

Question:
{question}

Answer:
{answer}

Instructions:
- Be very concise
- Mention only mistakes or missing points
- Do NOT explain the full answer
- Max 2 short sentences
- If answer is correct, say: "Good answer, but can be more detailed."

Output only the feedback."""
        feedback = self._generate(prompt, num_predict=40, temperature=0.5)
        return feedback or "Could not evaluate answer."

    def generate_followup(self, question: str, answer: str) -> str:
        prompt = f"""You are a professional interviewer.

Original Question:
{question}

Candidate Answer:
{answer}

Task:
Ask ONE follow-up question.

Rules:
- Maximum 10 words
- Must be related to the same topic
- Must go deeper into the concept
- Do NOT repeat the original question
- No explanation
- Only return the question
- Must end with a question mark

Now generate the follow-up question."""
        followup = self._generate(prompt, num_predict=20)
        if not followup or len(followup) < 5 or "?" not in followup:
            return random.choice(FALLBACK_FOLLOWUPS)
        return followup

    def final_verdict(self, transcript: str, avg_eye_score: float) -> str:
        prompt = f"""You are an interviewer.

Based on this interview:

{transcript}

Average eye contact: {avg_eye_score}

Give:
1. Short summary
2. Final decision: PASS or FAIL

Return:
Summary:
Decision:"""
        result = self._generate(prompt, num_predict=150)
        return result or "Summary: Average performance.\nDecision: PASS"
