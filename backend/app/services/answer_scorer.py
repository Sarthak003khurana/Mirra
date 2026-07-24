STAR_KEYWORDS = {
    "situation": ["situation", "context", "background", "at the time"],
    "task": ["task", "goal", "objective", "needed to", "responsible for"],
    "action": ["i did", "i built", "i led", "i implemented", "i designed", "i created", "i decided"],
    "result": ["result", "outcome", "impact", "improved", "reduced", "increased", "%"],
}

FILLER_WORDS = ["um", "uh", "like,", " like ", "you know", "sort of", "kind of"]


def score_answer(transcript: str) -> dict:
    lower = f" {transcript.lower()} "
    word_count = len(transcript.split())
    filler_count = sum(lower.count(word) for word in FILLER_WORDS)

    star_hits = {
        stage: any(keyword in lower for keyword in keywords) for stage, keywords in STAR_KEYWORDS.items()
    }
    structure_score = round(100 * sum(star_hits.values()) / len(STAR_KEYWORDS), 1)

    relevance_score = min(100, word_count * 2)
    filler_penalty = min(30, filler_count * 5)
    communication_score = max(0.0, round(relevance_score - filler_penalty, 1))

    technical_terms = sum(1 for term in ["api", "database", "algorithm", "system", "architecture", "code", "test"] if term in lower)
    technical_score = min(100.0, technical_terms * 20.0)

    return {
        "word_count": word_count,
        "filler_count": filler_count,
        "star_structure": star_hits,
        "structure_score": structure_score,
        "communication_score": communication_score,
        "technical_score": technical_score,
    }
