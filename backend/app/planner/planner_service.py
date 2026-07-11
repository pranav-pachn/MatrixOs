from typing import Optional
from app.planner.schemas import PlannerRequest, PlannerResponse
from app.planner.llm import GroqPlanner, DeepSeekPlanner, OpenRouterPlanner
from app.planner.deterministic import DeterministicPlanner
from app.runtime.state_manager import state_manager
from app.adapters.registry import get as get_adapter

class PlannerService:
    def __init__(self):
        # We can implement a routing strategy here. For now, use Groq as primary.
        self.primary_planner = GroqPlanner()
        self.fallback_planner = DeepSeekPlanner()
        self.secondary_fallback = OpenRouterPlanner()
        self.deterministic_fallback = DeterministicPlanner()

    async def plan(self, scenario_id: str, event_type: str) -> PlannerResponse:
        state = await state_manager.get_scenario(scenario_id)
        if not state:
            raise Exception(f"Scenario {scenario_id} not found")
            
        adapter = get_adapter(scenario_id)
        if not adapter:
            raise Exception(f"Adapter for {scenario_id} not found")
            
        constraints = adapter.constraints()
        objectives = getattr(adapter, "objectives", lambda: [])()
        
        # Operational memory via new service
        from memory.memory_service import operational_memory
        stats = operational_memory.statistics(event_type)
        recent_records = operational_memory.retrieve(event_type, limit=5)
        
        request = PlannerRequest(
            world_state=state,
            current_event=event_type,
            constraints=constraints,
            objectives=objectives,
            operational_memory=recent_records,
            memory_stats=stats
        )
        
        try:
            return await self.primary_planner.generate(request)
        except Exception as e:
            print(f"Primary planner failed: {e}. Trying fallback.")
            try:
                return await self.fallback_planner.generate(request)
            except Exception as e2:
                print(f"Fallback planner failed: {e2}. Trying secondary fallback.")
                try:
                    return await self.secondary_fallback.generate(request)
                except Exception as e3:
                    print(f"All LLM planners failed: {e3}. Triggering deterministic rule-based fallback.")
                    return await self.deterministic_fallback.generate(request)

planner_service = PlannerService()
