def normalize_audio_metrics(payload: dict) -> dict:
    """Clamp/coerce the wpm/pitch/filler/pause payload the voice-bot streams over
    the WebSocket into a consistent shape before it's persisted with an Answer."""
    return {
        "wpm": float(payload.get("wpm", 0) or 0),
        "pitch_variation": float(payload.get("pitch_variation", 0) or 0),
        "pauses": int(payload.get("pauses", 0) or 0),
        "fillers": int(payload.get("fillers", 0) or 0),
    }
