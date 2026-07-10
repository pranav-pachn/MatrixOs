import asyncio
import json
from app.planner.planner_service import planner_service
from app.policy.engine import policy_engine
from app.adapters.registry import get as get_adapter
from app.runtime.state_manager import state_manager

async def main():
    print("=== Testing Phase 4: Planner & Policy Engine ===")
    
    scenario_id = "airport"
    event_type = "fuel_truck_failure"
    
    print(f"\n1. Fetching current world state for '{scenario_id}'...")
    state = await state_manager.get_scenario(scenario_id)
    if not state:
        print("Failed to get state. Make sure adapter is loaded.")
        return
        
    print(f"\n2. Calling Planner Service for event: {event_type}")
    print("This will call the LLM and generate 3 plans...")
    
    try:
        response = await planner_service.plan(scenario_id, event_type)
        print("\n✅ Planner returned successfully!")
        print(f"Context: {response.planning_context}")
        
        print(f"\nGenerated {len(response.plans)} Plans:")
        for plan in response.plans:
            print(f"\n--- Plan {plan.id}: {plan.title} ---")
            print(f"Strategy: {plan.strategy}")
            print(f"Delay: {plan.estimated_delay}m | Confidence: {plan.confidence}")
            print(f"Reasoning: {plan.reasoning}")
            print(f"Recovery Intent: {plan.recovery_intent.model_dump()}")
            
        print("\n3. Testing Policy Engine selection...")
        adapter = get_adapter(scenario_id)
        objectives = adapter.objectives()
        print(f"Objectives: {objectives}")
        
        best_plan = policy_engine.choose(response.plans, objectives)
        print(f"\n🏆 Policy Engine selected: Plan {best_plan.id} ({best_plan.title})")
        print("Because it scored highest based on confidence, delay, and resource cost metrics.")
        
    except Exception as e:
        print(f"\n❌ Error during planning: {e}")

if __name__ == "__main__":
    from app.adapters.loader import load_all_adapters
    load_all_adapters()
    asyncio.run(main())
