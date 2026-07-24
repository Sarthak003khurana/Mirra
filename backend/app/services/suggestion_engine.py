def generate_suggestions(
    weak_verbs: list[str],
    gaps: list[str],
    skills_detected: list[str],
    word_count: int,
) -> list[str]:
    suggestions: list[str] = []

    for verb in weak_verbs:
        suggestions.append(
            f'Replace weak phrasing like "{verb}" with an action verb tied to a measurable '
            'outcome (e.g. "Led", "Built", "Reduced X by Y%").'
        )

    for gap in gaps:
        suggestions.append(f'Add a clear "{gap.title()}" section — it was not detected.')

    if word_count and word_count < 150:
        suggestions.append("Your resume looks short — add more detail on impact and metrics.")

    if not skills_detected:
        suggestions.append("List specific technical skills/tools so keyword matching picks them up.")

    if not suggestions:
        suggestions.append("Looks solid — no major issues detected.")

    return suggestions
