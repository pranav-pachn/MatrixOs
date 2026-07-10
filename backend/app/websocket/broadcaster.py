from collections import deque
from typing import Dict, List
import json

from app.models.events import RuntimeEvent

class RuntimeBroadcaster:
    def __init__(self):
        # Maps scenario_id to a deque of the last 50 events
        self._replay_buffer: Dict[str, deque] = {}

    async def publish(self, scenario_id: str, event: RuntimeEvent) -> None:
        if scenario_id not in self._replay_buffer:
            self._replay_buffer[scenario_id] = deque(maxlen=50)
        
        self._replay_buffer[scenario_id].append(event)
        
        # Broadcast via the WS manager
        from app.websocket.manager import manager
        await manager.broadcast(scenario_id, event)

    def get_replay(self, scenario_id: str) -> List[RuntimeEvent]:
        if scenario_id in self._replay_buffer:
            return list(self._replay_buffer[scenario_id])
        return []

runtime_broadcaster = RuntimeBroadcaster()
