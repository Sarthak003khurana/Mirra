import logging
from datetime import datetime, timezone

from fastapi import WebSocket, WebSocketDisconnect
from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models.answer import Answer
from app.models.resume import Resume
from app.models.score import Score
from app.models.session import InterviewSession
from app.services import answer_scorer, audio_analyzer, question_generator, report_generator
from app.websocket.connection_manager import manager

logger = logging.getLogger(__name__)

MAX_QUESTIONS = 5


class SessionState:
    """In-memory per-session scratch space shared by every socket in the room
    (frontend tab, voice-bot process, avatar iframe). This process holds the
    whole interview loop, which is fine for the single-uvicorn-worker deployment
    this project targets — a multi-worker deployment would need to move this to
    Redis instead."""

    def __init__(self, resume_text: str, config: dict) -> None:
        self.resume_text = resume_text
        self.config = config
        self.questions: list[str] = []
        self.pending_face_metrics: list[dict] = []
        self.pending_audio_metrics: dict | None = None


_session_states: dict[str, SessionState] = {}


async def handle_interview_socket(websocket: WebSocket) -> None:
    session_id: str | None = None
    await websocket.accept()
    try:
        raw = await websocket.receive_json()
        if raw.get("event") != "join_session":
            await websocket.close(code=4000)
            return

        session_id = str(raw["payload"]["session_id"])
        manager.connect(session_id, websocket)
        await websocket.send_json({"event": "session_joined", "payload": {"status": "ok"}})
        logger.info("Session %s joined", session_id)

        await _ensure_state(session_id)

        while True:
            raw = await websocket.receive_json()
            event = raw.get("event")
            payload = raw.get("payload") or {}
            state = _session_states.get(session_id)

            if event == "face_metrics" and state is not None:
                state.pending_face_metrics.append(payload)
                await manager.broadcast(session_id, event, payload, exclude=websocket)
            elif event == "audio_metrics" and state is not None:
                state.pending_audio_metrics = audio_analyzer.normalize_audio_metrics(payload)
                await manager.broadcast(session_id, event, payload, exclude=websocket)
            elif event == "transcript" and payload.get("is_final") and state is not None:
                await manager.broadcast(session_id, event, payload, exclude=websocket)
                await _handle_final_transcript(session_id, state, payload.get("text", ""))
            else:
                # tts_audio, viseme_data, and anything else are plain relays.
                await manager.broadcast(session_id, event, payload, exclude=websocket)

    except WebSocketDisconnect:
        logger.info("Session %s disconnected", session_id)
    except (KeyError, TypeError):
        logger.exception("Malformed frame on session %s", session_id)
    finally:
        if session_id:
            manager.disconnect(session_id, websocket)


async def _ensure_state(session_id: str) -> SessionState | None:
    if session_id in _session_states:
        return _session_states[session_id]

    try:
        numeric_id = int(session_id)
    except ValueError:
        return None

    async with AsyncSessionLocal() as db:
        session = await db.get(InterviewSession, numeric_id)
        if session is None:
            return None
        resume = await db.get(Resume, session.resume_id) if session.resume_id else None
        state = SessionState(resume_text=(resume.parsed_text if resume else "") or "", config=session.config or {})
        _session_states[session_id] = state
        return state


async def start_first_question(session_id: str, resume_text: str, config: dict) -> str:
    """Called by the REST /sessions/{id}/start endpoint to kick off the loop."""
    state = _session_states.get(session_id)
    if state is None:
        state = SessionState(resume_text=resume_text, config=config)
        _session_states[session_id] = state

    question_text = await question_generator.generate_question(
        state.resume_text,
        state.questions,
        state.config.get("personality", "friendly"),
        state.config.get("difficulty", "medium"),
    )
    state.questions.append(question_text)
    await manager.broadcast(session_id, "question", {"id": len(state.questions), "text": question_text})
    return question_text


async def _handle_final_transcript(session_id: str, state: SessionState, transcript: str) -> None:
    nlp_score = answer_scorer.score_answer(transcript)
    question_index = len(state.questions) - 1
    question_text = state.questions[-1] if state.questions else ""

    async with AsyncSessionLocal() as db:
        answer = Answer(
            session_id=int(session_id),
            question_index=max(question_index, 0),
            question_text=question_text,
            transcript=transcript,
            face_metrics=state.pending_face_metrics,
            audio_metrics=state.pending_audio_metrics,
            nlp_score=nlp_score,
        )
        db.add(answer)
        await db.commit()

    state.pending_face_metrics = []
    state.pending_audio_metrics = None

    if len(state.questions) >= MAX_QUESTIONS:
        await _finish_session(session_id)
        return

    next_question = await question_generator.generate_question(
        state.resume_text,
        state.questions,
        state.config.get("personality", "friendly"),
        state.config.get("difficulty", "medium"),
    )
    state.questions.append(next_question)
    await manager.broadcast(session_id, "question", {"id": len(state.questions), "text": next_question})


async def finish_session(session_id: str) -> dict:
    """Also usable directly by the REST /sessions/{id}/end endpoint."""
    return await _finish_session(session_id)


async def _finish_session(session_id: str) -> dict:
    async with AsyncSessionLocal() as db:
        result = await db.scalars(select(Answer).where(Answer.session_id == int(session_id)))
        answers = list(result)
        report = report_generator.build_report(answers)

        session = await db.get(InterviewSession, int(session_id))
        if session is not None:
            session.status = "completed"
            session.ended_at = datetime.now(timezone.utc)

        score = await db.scalar(select(Score).where(Score.session_id == int(session_id)))
        if score is None:
            score = Score(session_id=int(session_id))
            db.add(score)
        score.confidence = report["confidence"]
        score.communication = report["communication"]
        score.technical = report["technical"]
        score.structure = report["structure"]
        score.overall = report["overall"]
        score.breakdown = report["breakdown"]
        score.suggestions = report["suggestions"]
        await db.commit()

    _session_states.pop(session_id, None)
    await manager.broadcast(session_id, "session_complete", {"redirect_url": f"/interview/{session_id}/report"})
    return report
