from app.models.answer import Answer


def build_report(answers: list[Answer]) -> dict:
    if not answers:
        return {
            "confidence": 0.0,
            "communication": 0.0,
            "technical": 0.0,
            "structure": 0.0,
            "overall": 0.0,
            "breakdown": {"per_question": []},
            "suggestions": ["Complete an interview to see your report."],
        }

    per_question = []
    structure_scores, communication_scores, technical_scores, confidence_scores = [], [], [], []

    for answer in answers:
        nlp = answer.nlp_score or {}
        face_samples = answer.face_metrics or []
        confidence = (
            sum(sample.get("confidence", 0) for sample in face_samples) / len(face_samples)
            if face_samples
            else 0.0
        )

        structure_scores.append(nlp.get("structure_score", 0.0))
        communication_scores.append(nlp.get("communication_score", 0.0))
        technical_scores.append(nlp.get("technical_score", 0.0))
        confidence_scores.append(confidence)

        per_question.append(
            {
                "question": answer.question_text,
                "structure_score": nlp.get("structure_score", 0.0),
                "communication_score": nlp.get("communication_score", 0.0),
                "confidence": round(confidence, 1),
            }
        )

    def avg(values: list[float]) -> float:
        return round(sum(values) / len(values), 1) if values else 0.0

    structure = avg(structure_scores)
    communication = avg(communication_scores)
    technical = avg(technical_scores)
    confidence = avg(confidence_scores)
    overall = round((structure + communication + technical + confidence) / 4, 1)

    suggestions = []
    if structure < 60:
        suggestions.append("Structure your answers with the STAR method: Situation, Task, Action, Result.")
    if communication < 60:
        suggestions.append("Cut filler words and speak in more complete, detailed sentences.")
    if technical < 60:
        suggestions.append("Use more specific technical vocabulary tied to the systems you built.")
    if confidence < 60:
        suggestions.append("Maintain eye contact with the camera — confidence scoring is derived from it.")
    if not suggestions:
        suggestions.append("Strong session overall — keep practicing to stay sharp.")

    return {
        "confidence": confidence,
        "communication": communication,
        "technical": technical,
        "structure": structure,
        "overall": overall,
        "breakdown": {"per_question": per_question},
        "suggestions": suggestions,
    }
