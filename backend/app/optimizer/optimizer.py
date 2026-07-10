from typing import List
from app.models.domain import Scenario, ConstraintRule
from app.planner.schemas import CandidatePlan
from app.optimizer.models import OptimizationRequest, OptimizedPlan
from app.optimizer.cp_sat_solver import CpSatSolver

class OptimizationEngine:
    def optimize(self, 
                 world_state: Scenario, 
                 selected_plan: CandidatePlan, 
                 objectives: List[str], 
                 constraints: List[ConstraintRule],
                 timeout_seconds: int = 5) -> OptimizedPlan:
        
        request = OptimizationRequest(
            world_state=world_state,
            recovery_intent=selected_plan.recovery_intent,
            objectives=objectives,
            constraints=constraints,
            timeout_seconds=timeout_seconds
        )
        
        solver = CpSatSolver()
        return solver.solve(request)

optimization_engine = OptimizationEngine()
