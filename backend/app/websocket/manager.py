import json
from typing import Dict, Set
from fastapi import WebSocket
from app.models.events import WSEventModel
from app.events.bus import event_bus

class ConnectionManager:
    def __init__(self):
        # Maps scenario_id to a set of active websocket connections
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # Subscribe to all events on the bus
        event_bus.subscribe("*", self._handle_bus_event)

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

    async def _handle_bus_event(self, data: WSEventModel):
        # In a real app we might route by scenario ID. For now we broadcast to all if we can't tell,
        # but normally the data doesn't have a scenario ID inside it directly in our schema.
        # We will just broadcast to all active connections across all scenarios.
        payload = data.model_dump_json()
        for scenario_id, connections in self.active_connections.items():
            dead_connections = set()
            for connection in connections:
                try:
                    await connection.send_text(payload)
                except Exception:
                    dead_connections.add(connection)
            for dead in dead_connections:
                self.disconnect(dead, scenario_id)

    async def broadcast_model(self, scenario_id: str, model: WSEventModel):
        # Direct broadcast for a specific scenario (can be used alongside EventBus)
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
