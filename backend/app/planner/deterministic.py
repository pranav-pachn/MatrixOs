import uuid
from app.planner.llm import PlannerLLM
from app.planner.schemas import PlannerRequest, PlannerResponse, CandidatePlan, RecoveryIntent

class DeterministicPlanner(PlannerLLM):
    """
    Rule-based deterministic planner used as the final fallback if all LLMs fail.
    Generates a guaranteed valid plan using the adapter's state and constraints.
    """
    async def generate(self, request: PlannerRequest) -> PlannerResponse:
        # Find the first mission that is in-progress, normal, or diverged to target
        target_mission = next(
            (m for m in request.world_state.missions if m.status in ['in-progress', 'normal', 'diverged', 'delayed']), 
            None
        )
        
        mission_id = target_mission.id if target_mission else (
            request.world_state.missions[0].id if request.world_state.missions else "UNKNOWN"
        )
        
        # Determine resource type needed based on the first available resource, or a generic type
        resource_type_needed = "Generic"
        available_resources = [r for r in request.world_state.resources if r.status == 'available']
        if available_resources:
            resource_type_needed = available_resources[0].type
        elif request.world_state.resources:
            resource_type_needed = request.world_state.resources[0].type

        plan = CandidatePlan(
            id=f"plan-det-{uuid.uuid4().hex[:6]}",
            title="Deterministic Rule-Based Recovery",
            description=f"Fallback plan triggered for {request.current_event}.",
            strategy="Reassign available resources to mitigate disruption.",
            affected_resources=[],
            estimated_delay=15,
            confidence=1.0,
            reasoning="Selected as a fail-safe due to AI layer unavailability. Applies standard operating procedures.",
            recovery_intent=RecoveryIntent(
                strategy_type="resource_reallocation",
                resource_type_needed=resource_type_needed,
                target_mission_id=mission_id,
                max_delay_minutes=60,
                priority="high"
            )
        )
        
        return PlannerResponse(
            plans=[plan],
            planning_context="Deterministic fallback triggered."
        )
