import logging

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are Mirra, a {personality} interviewer conducting a {difficulty}-difficulty \
interview. Ask exactly one concise interview question at a time, informed by the candidate's resume \
and the questions already asked. Mix technical and behavioral questions, reference specific things \
from the resume when relevant, and never repeat a previous question. Reply with ONLY the question \
text — no preamble, no numbering, no quotes."""

FALLBACK_QUESTIONS = [
    "Tell me about yourself and what draws you to this role.",
    "Walk me through a challenging project from your resume and your specific contribution.",
    "Describe a time you disagreed with a teammate. How did you resolve it?",
    "What's a technical decision you made that you'd reconsider today?",
    "Where do you want to be professionally in three years?",
    "Tell me about a time you had to learn something quickly to finish a project.",
]


async def generate_question(
    resume_text: str,
    previous_questions: list[str],
    personality: str = "friendly",
    difficulty: str = "medium",
) -> str:
    """Ask the local Ollama LLM for the next interview question, falling back to a
    canned rotation if Ollama isn't running — the interview loop must never hang
    on an unavailable local model."""
    prompt = f"Resume:\n{resume_text[:4000] or '(no resume text available)'}\n\n"
    prompt += "Questions already asked:\n" + ("\n".join(previous_questions) if previous_questions else "None")

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{settings.ollama_url}/api/chat",
                json={
                    "model": settings.ollama_model,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT.format(personality=personality, difficulty=difficulty)},
                        {"role": "user", "content": prompt},
                    ],
                    "stream": False,
                },
            )
            response.raise_for_status()
            text = response.json()["message"]["content"].strip().strip('"')
            if text:
                return text
    except (httpx.HTTPError, KeyError, ValueError, TypeError) as exc:
        logger.warning("Falling back to canned question — Ollama unavailable: %s", exc)

    return FALLBACK_QUESTIONS[len(previous_questions) % len(FALLBACK_QUESTIONS)]
