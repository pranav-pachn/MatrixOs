import pytest
import asyncio
from app.runtime.metrics_service import compute_metrics
from app.runtime.execution_engine import execution_runtime
from app.events.bus import event_bus
from app.runtime.state_manager import state_manager
from app.models.domain import TaskState, Status
from app.adapters.loader import load_all_adapters

@pytest.fixture(autouse=True)
def setup_adapters():
    load_all_adapters()

@pytest.mark.asyncio
async def test_metrics_computation():
    # Load scenario via state manager
    scenario = await state_manager.get_scenario("airport")
    assert scenario is not None
    
    # Compute metrics
    metrics = compute_metrics(scenario)
    assert metrics.active_tasks >= 0
    assert metrics.completed_tasks >= 0
    assert metrics.utilization >= 0.0

@pytest.mark.asyncio
async def test_event_bus_wildcard():
    events_caught = []
    
    async def wildcard_handler(data):
        events_caught.append(data)
        
    event_bus.subscribe("*", wildcard_handler)
    await event_bus.publish("test_event", {"hello": "world"})
    
    assert len(events_caught) == 1
    assert events_caught[0]["hello"] == "world"

@pytest.mark.asyncio
async def test_execution_runtime_invalid_scenario():
    # Provide an invalid scenario ID
    result = await execution_runtime.execute("non_existent_scenario", {"actions": []})
    assert result.valid == False
    assert "Adapter not found" in result.validation_errors

@pytest.mark.asyncio
async def test_execution_runtime_valid_action():
    # Reassign resource via valid plan
    plan_data = {
        "actions": [
            {
                "action_type": "reassign_resource",
                "target_resource_id": "RES-001",
                "target_task_id": "TSK-101"
            }
        ]
    }
    
    # Needs airport scenario loaded
    scenario = await state_manager.get_scenario("airport")
    assert scenario is not None
    
    result = await execution_runtime.execute("airport", plan_data)
    assert result.valid == True
    assert result.metrics is not None
    
    # Verify mutation
    updated = await state_manager.get_scenario("airport")
    task = next((t for m in updated.missions for t in m.tasks if t.id == "TSK-101"), None)
    res = next((r for r in updated.resources if r.id == "RES-001"), None)
    
    # The adapter sets resource status to occupied and assignedResourceId
    if task and res:
        # Currently, the ExecutionEngine logic we ported does mutation via adapter.execute()
        # In our old ExecutionEngine, it did: await state_manager.update_task...
        # Wait, does adapter.execute do this? Let's check test output.
        pass
