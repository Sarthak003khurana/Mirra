import re

from app.services.suggestion_engine import generate_suggestions

WEAK_VERBS = [
    "helped",
    "assisted",
    "worked on",
    "responsible for",
    "involved in",
    "participated in",
]

SKILL_KEYWORDS = [
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust", "sql",
    "react", "vue", "angular", "node.js", "django", "flask", "fastapi", "spring",
    "docker", "kubernetes", "aws", "gcp", "azure", "terraform", "ci/cd", "git",
    "postgresql", "mongodb", "redis", "graphql", "rest", "microservices",
    "machine learning", "pytorch", "tensorflow", "nlp", "data analysis", "pandas",
    "leadership", "communication", "project management", "agile", "scrum",
]

SECTION_HINTS = ["experience", "education", "skills", "projects", "summary"]


def analyze_resume(text: str) -> dict:
    if not text or not text.strip():
        return {
            "ats_score": 0,
            "skills_detected": [],
            "weak_verbs": [],
            "gaps": SECTION_HINTS,
            "suggestions": ["No text could be extracted from this file — try re-uploading it."],
            "word_count": 0,
        }

    lower = text.lower()
    word_count = len(re.findall(r"[a-zA-Z][a-zA-Z+.#]{1,}", text))

    skills_detected = sorted({kw for kw in SKILL_KEYWORDS if kw in lower})
    found_weak = sorted({verb for verb in WEAK_VERBS if verb in lower})
    gaps = [section for section in SECTION_HINTS if section not in lower]

    ats_score = _calculate_ats_score(word_count, skills_detected, gaps, found_weak)
    suggestions = generate_suggestions(found_weak, gaps, skills_detected, word_count)

    return {
        "ats_score": ats_score,
        "skills_detected": skills_detected,
        "weak_verbs": found_weak,
        "gaps": gaps,
        "suggestions": suggestions,
        "word_count": word_count,
    }


def _calculate_ats_score(word_count: int, skills: list[str], gaps: list[str], weak_verbs: list[str]) -> int:
    score = 50
    score += min(25, len(skills) * 3)
    score += 10 if 150 <= word_count <= 900 else 0
    score -= len(gaps) * 8
    score -= len(weak_verbs) * 4
    return max(0, min(100, score))
