from pydantic import BaseModel
from typing import List
from app.models.domain import Scenario
from app.planner.schemas import RecoveryIntent
from memory.schemas import RecoveryRecord

class RecoveryRequest(BaseModel):
    world_state: Scenario
    failed_strategy: str
    failure_reason: str
    event_type: str
    constraint_violations: List[str]
    retrieval_memory: List[RecoveryRecord] = []

class RecoveryStrategy(BaseModel):
    title: str
    description: str
    estimated_delay: int
    confidence: float
    reasoning: str
    recovery_intent: RecoveryIntent
