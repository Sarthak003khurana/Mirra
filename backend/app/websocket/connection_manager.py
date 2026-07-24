import logging

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    """Tracks every socket (frontend tab, voice-bot process, avatar iframe) joined
    to a given interview session so events can fan out to the whole room."""

    def __init__(self) -> None:
        self.rooms: dict[str, set[WebSocket]] = {}

    def connect(self, session_id: str, websocket: WebSocket) -> None:
        self.rooms.setdefault(session_id, set()).add(websocket)

    def disconnect(self, session_id: str, websocket: WebSocket) -> None:
        room = self.rooms.get(session_id)
        if room is None:
            return
        room.discard(websocket)
        if not room:
            self.rooms.pop(session_id, None)

    async def broadcast(
        self,
        session_id: str,
        event: str,
        payload: dict,
        *,
        exclude: WebSocket | None = None,
    ) -> None:
        room = self.rooms.get(session_id, set())
        for websocket in list(room):
            if websocket is exclude:
                continue
            try:
                await websocket.send_json({"event": event, "payload": payload})
            except Exception:
                logger.exception("Failed to deliver %s to a socket in session %s", event, session_id)
                room.discard(websocket)

    async def send(self, session_id: str, event: str, payload: dict) -> None:
        await self.broadcast(session_id, event, payload)


manager = ConnectionManager()
