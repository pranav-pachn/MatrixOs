import pytest
from app.models.domain import Scenario, RecoveryAction, ActionType, TaskState
from app.adapters.loader import load_all_adapters
from app.runtime.state_manager import state_manager
from app.invariants.engine import InvariantEngine
from app.invariants.airport import get_airport_rules
from app.invariants.hospital import get_hospital_rules
from app.adapters.registry import get as get_adapter

@pytest.fixture(autouse=True)
def setup():
    load_all_adapters()

@pytest.mark.asyncio
async def test_valid_airport_plan_passes():
    state = await state_manager.get_scenario("airport")
    engine = InvariantEngine(get_airport_rules())
    
    # Empty plan (no actions) should pass all checks on the default initial state
    report = engine.validate(state, [])
    assert report.approved == True
    assert len(report.violations) == 0

@pytest.mark.asyncio
async def test_pushback_before_fuel_rejected():
    state = await state_manager.get_scenario("airport")
    
    # Ensure there is a pushback task
    m = state.missions[0]
    from app.models.domain import Task
    m.tasks.append(Task(id="mock-pb", name="Pushback", type="pushback", status=TaskState.RUNNING, duration=10))
    
    # Mutate state so that fueling is running and pushback is running
    fuel = next((t for t in m.tasks if t.type == 'fuel'), None)
    pb = next((t for t in m.tasks if t.type == 'pushback'), None)
    if fuel and pb:
        fuel.status = TaskState.RUNNING
        pb.status = TaskState.RUNNING
            
    engine = InvariantEngine(get_airport_rules())
    report = engine.validate(state, [])
    
    assert report.approved == False
    assert any(v.rule == "FuelBeforePushback" for v in report.violations)

@pytest.mark.asyncio
async def test_gate_overlap_rejected():
    state = await state_manager.get_scenario("airport")
    for m in state.missions:
        fuel = next((t for t in m.tasks if t.type == 'fuel'), None)
        pax = next((t for t in m.tasks if t.type == 'pax'), None)
        if fuel and pax:
            fuel.status = TaskState.RUNNING
            pax.status = TaskState.RUNNING
            
    engine = InvariantEngine(get_airport_rules())
    report = engine.validate(state, [])
    
    assert report.approved == False
    assert any(v.rule == "BoardingFuelingOverlap" for v in report.violations)

@pytest.mark.asyncio
async def test_resource_double_assignment_rejected():
    state = await state_manager.get_scenario("airport")
    engine = InvariantEngine(get_airport_rules())
    
    actions = [
        RecoveryAction(action_type=ActionType.reassign_resource, target_resource_id="RES-001", target_task_id="TSK-1"),
        RecoveryAction(action_type=ActionType.reassign_resource, target_resource_id="RES-001", target_task_id="TSK-2")
    ]
    
    report = engine.validate(state, actions)
    assert report.approved == False
    assert any(v.rule == "ResourceNotDoubleAssigned" for v in report.violations)

@pytest.mark.asyncio
async def test_hospital_adapter_loads_hospital_rules():
    adapter = get_adapter("hospital-er")
    rules = adapter.get_rules()
    
    rule_names = [r.name for r in rules]
    assert "DoctorAvailable" in rule_names
    assert "BedUnique" in rule_names
    assert "FuelBeforePushback" not in rule_names

@pytest.mark.asyncio
async def test_engine_returns_all_violations():
    state = await state_manager.get_scenario("airport")
    
    # Ensure there is a pushback task
    m = state.missions[0]
    from app.models.domain import Task
    m.tasks.append(Task(id="mock-pb", name="Pushback", type="pushback", status=TaskState.RUNNING, duration=10))
    
    # Force two violations at once
    fuel = next((t for t in m.tasks if t.type == 'fuel'), None)
    pb = next((t for t in m.tasks if t.type == 'pushback'), None)
    pax = next((t for t in m.tasks if t.type == 'pax'), None)
    
    if fuel and pb and pax:
        fuel.status = TaskState.RUNNING
        pb.status = TaskState.RUNNING  # violation 1
        pax.status = TaskState.RUNNING # violation 2
            
    engine = InvariantEngine(get_airport_rules())
    report = engine.validate(state, [])
    
    assert report.approved == False
    assert len(report.violations) >= 2
    rule_names = [v.rule for v in report.violations]
    assert "FuelBeforePushback" in rule_names
    assert "BoardingFuelingOverlap" in rule_names

@pytest.mark.asyncio
async def test_execution_runtime_only_runs_approved_plans():
    from app.runtime.execution_engine import execution_runtime
    
    # Try to execute a plan with a double assignment (which violates invariants)
    plan_data = {
        "actions": [
            {"action_type": "reassign_resource", "target_resource_id": "RES-001", "target_task_id": "TSK-1"},
            {"action_type": "reassign_resource", "target_resource_id": "RES-001", "target_task_id": "TSK-2"}
        ]
    }
    
    result = await execution_runtime.execute("airport", plan_data)
    assert result.valid == False
    assert "Resource RES-001 is assigned to multiple tasks simultaneously." in result.validation_errors
