import json
import uuid
from datetime import datetime
from typing import Dict, Set
from fastapi import WebSocket
from app.models.events import RuntimeEvent
from app.websocket.broadcaster import runtime_broadcaster
from app.runtime.state_manager import state_manager

class ConnectionManager:
    def __init__(self):
        # Maps scenario_id to a set of active websocket connections
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, scenario_id: str):
        await websocket.accept()
        if scenario_id not in self.active_connections:
            self.active_connections[scenario_id] = set()
        self.active_connections[scenario_id].add(websocket)

        try:
            # 1. Send Snapshot
            scenario = await state_manager.get_scenario(scenario_id)
            if scenario:
                snapshot_event = RuntimeEvent(
                    id=str(uuid.uuid4()),
                    type="runtime.snapshot",
                    timestamp=datetime.utcnow().isoformat(),
                    payload=scenario.model_dump()
                )
                await websocket.send_text(snapshot_event.model_dump_json())

            # 2. Send Replay Buffer
            replay_events = runtime_broadcaster.get_replay(scenario_id)
            if replay_events:
                replay_event = RuntimeEvent(
                    id=str(uuid.uuid4()),
                    type="runtime.replay",
                    timestamp=datetime.utcnow().isoformat(),
                    payload={"events": [evt.model_dump() for evt in replay_events]}
                )
                await websocket.send_text(replay_event.model_dump_json())
            
            # 3. Send Ready
            ready_event = RuntimeEvent(
                id=str(uuid.uuid4()),
                type="runtime.ready",
                timestamp=datetime.utcnow().isoformat(),
                payload={}
            )
            await websocket.send_text(ready_event.model_dump_json())
        except Exception:
            # Client disconnected before we finished sending init messages — clean up
            self.disconnect(websocket, scenario_id)
            raise


    def disconnect(self, websocket: WebSocket, scenario_id: str):
        if scenario_id in self.active_connections:
            self.active_connections[scenario_id].discard(websocket)
            if not self.active_connections[scenario_id]:
                del self.active_connections[scenario_id]

    async def broadcast(self, scenario_id: str, event: RuntimeEvent):
        if scenario_id in self.active_connections:
            payload = event.model_dump_json()
            dead_connections = set()
            for connection in self.active_connections[scenario_id]:
                try:
                    await connection.send_text(payload)
                except Exception:
                    dead_connections.add(connection)
            for dead in dead_connections:
                self.disconnect(dead, scenario_id)

manager = ConnectionManager()
