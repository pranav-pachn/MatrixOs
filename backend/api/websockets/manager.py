from typing import Dict, Set
from fastapi import WebSocket
from schemas.runtime_dto import WSEventModel
import json

class ConnectionManager:
    def __init__(self):
        # Maps scenario_id to a set of active websocket connections
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, scenario_id: str):
        await websocket.accept()
        if scenario_id not in self.active_connections:
            self.active_connections[scenario_id] = set()
        self.active_connections[scenario_id].add(websocket)

    def disconnect(self, websocket: WebSocket, scenario_id: str):
        if scenario_id in self.active_connections:
            self.active_connections[scenario_id].discard(websocket)
            if not self.active_connections[scenario_id]:
                del self.active_connections[scenario_id]

    async def broadcast_event(self, scenario_id: str, event_data: dict):
        if scenario_id in self.active_connections:
            dead_connections = set()
            for connection in self.active_connections[scenario_id]:
                try:
                    await connection.send_text(json.dumps(event_data))
                except Exception:
                    dead_connections.add(connection)
            for dead in dead_connections:
                self.disconnect(dead, scenario_id)

    async def broadcast_model(self, scenario_id: str, model: WSEventModel):
        if scenario_id in self.active_connections:
            payload = model.model_dump_json()
            dead_connections = set()
            for connection in self.active_connections[scenario_id]:
                try:
                    await connection.send_text(payload)
                except Exception:
                    dead_connections.add(connection)
            for dead in dead_connections:
                self.disconnect(dead, scenario_id)

manager = ConnectionManager()
