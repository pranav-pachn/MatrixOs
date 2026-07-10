from typing import List, Literal, Dict
from pydantic import BaseModel
from app.models.domain import Scenario, ConstraintRule
from app.planner.schemas import RecoveryIntent

class TaskWindow(BaseModel):
    task_id: str
    resource_id: str
    start: int
    end: int

class OptimizationRequest(BaseModel):
    world_state: Scenario
    recovery_intent: RecoveryIntent
    objectives: List[str]
    constraints: List[ConstraintRule]
    timeout_seconds: int = 5

class OptimizedPlan(BaseModel):
    solver_status: Literal["OPTIMAL", "FEASIBLE", "INFEASIBLE", "UNKNOWN"]
    assignments: List[Dict[str, str]]
    schedule: List[TaskWindow]
    estimated_delay: int
    resource_utilization: float
    cost: float
