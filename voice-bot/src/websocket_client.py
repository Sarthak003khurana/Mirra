import json
import logging

import websockets

logger = logging.getLogger(__name__)


class VoiceBotWebSocketClient:
    """Speaks the backend's /ws/interview event protocol (see CLAUDE.md WebSocket
    table): join_session -> session_joined, then question/transcript/face_metrics/
    audio_metrics/session_complete events flow over the same connection.
    """

    def __init__(self, url: str, session_id: str, token: str | None = None):
        self.url = url
        self.session_id = session_id
        self.token = token
        self._ws: websockets.WebSocketClientProtocol | None = None

    async def connect(self, timeout: float = 5.0) -> dict:
        self._ws = await websockets.connect(self.url, open_timeout=timeout)
        await self.send("join_session", {"session_id": self.session_id, "token": self.token})
        ack = await self.receive()
        logger.info("Backend session ack: %s", ack)
        return ack

    async def send(self, event: str, payload: dict) -> None:
        if self._ws is None:
            raise RuntimeError("WebSocket not connected")
        await self._ws.send(json.dumps({"event": event, "payload": payload}))

    async def receive(self) -> dict:
        if self._ws is None:
            raise RuntimeError("WebSocket not connected")
        raw = await self._ws.recv()
        return json.loads(raw)

    async def close(self) -> None:
        if self._ws is not None:
            await self._ws.close()
            self._ws = None
