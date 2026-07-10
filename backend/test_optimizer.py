import asyncio
from app.runtime.state_manager import state_manager
from app.adapters.loader import load_all_adapters
from app.optimizer.optimizer import optimization_engine
from app.planner.schemas import CandidatePlan, RecoveryIntent
from app.adapters.registry import get as get_adapter

async def main():
    print("=== Testing Phase 5: Optimization Engine ===")
    scenario_id = "airport"
    
    print(f"1. Fetching current world state for '{scenario_id}'...")
    state = await state_manager.get_scenario(scenario_id)
    if not state:
        print("Failed to get state.")
        return
        
    adapter = get_adapter(scenario_id)
    objectives = adapter.objectives()
    constraints = adapter.constraints()
    timeout = adapter.config.solver_timeout_seconds
    
    print(f"\nAdapter Timeout: {timeout}s")
    
    # Create a mock CandidatePlan with a recovery intent
    mock_plan = CandidatePlan(
        id="test-plan-1",
        title="Assign Backup Fuel Truck",
        description="Assign a backup fuel truck to Flight A101.",
        strategy="Reassign",
        affected_resources=["fuel_truck"],
        estimated_delay=5,
        confidence=0.9,
        reasoning="Test",
        recovery_intent=RecoveryIntent(
            strategy_type="reassign",
            resource_type_needed="Fuel Truck",
            target_mission_id="MSN-101",
            max_delay_minutes=30,
            priority="HIGH"
        )
    )
    
    print("\n2. Calling Optimization Engine...")
    print(f"Intent: {mock_plan.recovery_intent.model_dump()}")
    
    result = optimization_engine.optimize(
        world_state=state,
        selected_plan=mock_plan,
        objectives=objectives,
        constraints=constraints,
        timeout_seconds=timeout
    )
    
    print(f"\n3. Optimization Result: {result.solver_status}")
    if result.solver_status in ["OPTIMAL", "FEASIBLE"]:
        print(f"Estimated Delay: {result.estimated_delay}m")
        print(f"Cost: {result.cost}")
        print("\nAssignments:")
        for a in result.assignments:
            print(f"  - Mission {a['target_mission_id']} Task {a['target_task_id']} -> Resource {a['target_resource_id']}")
        print("\nSchedule:")
        for s in result.schedule:
            print(f"  - Task {s.task_id} on {s.resource_id} | Start: {s.start}m | End: {s.end}m")
    else:
        print("No feasible schedule found.")

if __name__ == "__main__":
    load_all_adapters()
    asyncio.run(main())
