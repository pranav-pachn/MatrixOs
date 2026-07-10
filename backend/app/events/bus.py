import asyncio
from typing import Callable, Dict, List, Any

class EventBus:
    def __init__(self):
        # event_name -> list of async callbacks
        self._subscribers: Dict[str, List[Callable]] = {}

    def subscribe(self, event_name: str, callback: Callable):
        if event_name not in self._subscribers:
            self._subscribers[event_name] = []
        self._subscribers[event_name].append(callback)

    async def publish(self, event_name: str, data: Any):
        if event_name in self._subscribers:
            callbacks = self._subscribers[event_name]
            await asyncio.gather(*(callback(data) for callback in callbacks), return_exceptions=True)

    async def broadcast(self, data: Any):
        """Broadcasts data to a special 'all' channel or similar if needed"""
        await self.publish("*", data)

event_bus = EventBus()
