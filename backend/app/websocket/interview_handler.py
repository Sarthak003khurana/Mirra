import logging

from fastapi import WebSocket, WebSocketDisconnect

from app.websocket.connection_manager import manager

logger = logging.getLogger(__name__)


async def handle_interview_socket(websocket: WebSocket) -> None:
    """Handshake + relay for the /ws/interview protocol (see CLAUDE.md WebSocket
    table). First message must be join_session; every event after that is
    relayed back to the session's room so other listeners (e.g. the frontend)
    can observe it.

    TODO(interview-session): replace the relay with real routing into
    question_generator / answer_scorer / report_generator once that branch lands.
    """

    session_id: str | None = None
    await websocket.accept()
    try:
        raw = await websocket.receive_json()
        if raw.get("event") != "join_session":
            await websocket.close(code=4000)
            return

        session_id = raw["payload"]["session_id"]
        manager.connect(session_id, websocket)
        await manager.send(session_id, "session_joined", {"status": "ok"})
        logger.info("Session %s joined", session_id)

        while True:
            raw = await websocket.receive_json()
            event = raw.get("event")
            payload = raw.get("payload", {})
            logger.info("[%s] %s: %s", session_id, event, payload)
            await manager.send(session_id, event, payload)

    except WebSocketDisconnect:
        logger.info("Session %s disconnected", session_id)
    finally:
        if session_id:
            manager.disconnect(session_id)
