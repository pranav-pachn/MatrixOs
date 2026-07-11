from typing import List, Optional
from pydantic import BaseModel
from app.models.domain import Scenario, ConstraintRule
from memory.schemas import RecoveryRecord, MemoryStats

class PlannerRequest(BaseModel):
    world_state: Scenario
    current_event: str
    constraints: List[ConstraintRule]
    objectives: List[str]
    operational_memory: List[RecoveryRecord]
    memory_stats: MemoryStats

class RecoveryIntent(BaseModel):
    strategy_type: str
    resource_type_needed: Optional[str] = None
    target_mission_id: Optional[str] = None
    max_delay_minutes: Optional[int] = None
    priority: Optional[str] = None

class CandidatePlan(BaseModel):
    id: str
    title: str
    description: str
    strategy: str
    affected_resources: List[str]
    estimated_delay: int
    confidence: float
    reasoning: str
    recovery_intent: RecoveryIntent

class PlannerResponse(BaseModel):
    plans: List[CandidatePlan]
    planning_context: str
