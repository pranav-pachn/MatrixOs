import uuid
import datetime
from fastapi import HTTPException, BackgroundTasks
from typing import List

from gateway.schemas import (
    RuntimeSnapshot, AdapterMetadata, RuntimeContext,
    InjectEventResponse, ScenarioListResponse
)
from app.runtime.state_manager import state_manager
from app.adapters.registry import get as get_adapter
from app.models.domain import Divergence
from app.models.events import RuntimeEvent
from app.websocket.broadcaster import runtime_broadcaster
from app.runtime.recovery_loop import run_recovery_loop

class RuntimeService:
    async def list_scenarios(self) -> List[ScenarioListResponse]:
        # Using the hardcoded list for now as per main.py, but could pull from registry
        return [
            ScenarioListResponse(
                id="airport",
                name="Airport Hub",
                description="Aircraft turnaround and ground operations",
                status="live",
                href="/playground/airport"
            ),
            ScenarioListResponse(
                id="hospital-er",
                name="Emergency Room",
                description="Patient triage and resource allocation",
                status="live",
                href="/playground/hospital-er"
            ),
            ScenarioListResponse(
                id="warehouse-hub",
                name="Fulfillment Hub",
                description="Inventory routing and robotic fleets",
                status="live",
                href="/playground/warehouse-hub"
            )
        ]

    async def get_snapshot(self, runtime_id: str) -> RuntimeSnapshot:
        world_state = await state_manager.get_scenario(runtime_id)
        if not world_state:
            raise HTTPException(status_code=404, detail="Runtime not found")
            
        adapter = get_adapter(runtime_id)
        adapter_name = adapter.__class__.__name__ if adapter else "UnknownAdapter"
        
        from app.runtime.metrics_service import compute_metrics
        metrics = compute_metrics(world_state).model_dump()
        
        return RuntimeSnapshot(
            metadata=AdapterMetadata(
                runtime_id=runtime_id,
                adapter=adapter_name,
                version="1.0"
            ),
            runtime=RuntimeContext(
                phase="EXECUTING", 
                current_event=None,
                active_plan=world_state.currentPlan.model_dump() if world_state.currentPlan else None
            ),
            world=world_state,
            metrics=metrics
        )
        
    async def get_metrics(self, runtime_id: str):
        world_state = await state_manager.get_scenario(runtime_id)
        if not world_state:
            raise HTTPException(status_code=404, detail="Runtime not found")
        from app.runtime.metrics_service import compute_metrics
        return compute_metrics(world_state).model_dump()

    async def inject_event(self, runtime_id: str, event_type: str, background_tasks: BackgroundTasks) -> InjectEventResponse:
        adapter = get_adapter(runtime_id)
        if not adapter:
            raise HTTPException(status_code=404, detail="Runtime not found")
            
        event_id = f"evt_{uuid.uuid4().hex[:8]}"
        divergence_id = f"div_{uuid.uuid4().hex[:8]}"
        
        divergence = Divergence(
            id=divergence_id,
            eventId=event_id,
            expectedState="Normal operations",
            actualState=f"Divergence detected: {event_type}",
            severity="critical",
            detectedAt=datetime.datetime.utcnow().isoformat()
        )
        
        await state_manager.add_divergence(runtime_id, divergence)
        
        event = RuntimeEvent(
            id=event_id,
            type="runtime.divergence.detected",
            timestamp=datetime.datetime.utcnow().isoformat(),
            payload={"event": event_type}
        )
        await runtime_broadcaster.publish(runtime_id, event)
        
        background_tasks.add_task(run_recovery_loop, runtime_id, event_type, divergence_id)

        return InjectEventResponse(
            accepted=True,
            event_id=event_id
        )

runtime_service = RuntimeService()
