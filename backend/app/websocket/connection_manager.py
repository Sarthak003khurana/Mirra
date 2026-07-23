from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[str, WebSocket] = {}

    def connect(self, session_id: str, websocket: WebSocket) -> None:
        self.active_connections[session_id] = websocket

    def disconnect(self, session_id: str) -> None:
        self.active_connections.pop(session_id, None)

    async def send(self, session_id: str, event: str, payload: dict) -> None:
        websocket = self.active_connections.get(session_id)
        if websocket is not None:
            await websocket.send_json({"event": event, "payload": payload})


manager = ConnectionManager()
