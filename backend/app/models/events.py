from enum import Enum
from typing import List, Optional, Any, Dict
from pydantic import BaseModel
from .domain import EventSeverity

class RuntimePhase(str, Enum):
    OBSERVING = "OBSERVING"
    ASSESSING = "ASSESSING"
    PLANNING = "PLANNING"
    POLICY = "POLICY"
    OPTIMIZING = "OPTIMIZING"
    VALIDATING = "VALIDATING"
    EXECUTING = "EXECUTING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    RECOVERY_ACTIVATED = "RECOVERY_ACTIVATED"
    MEMORY_RETRIEVED = "MEMORY_RETRIEVED"
    RECOVERY_REPLANNING = "RECOVERY_REPLANNING"

class RuntimeEvent(BaseModel):
    id: str
    type: str
    phase: Optional[RuntimePhase] = None
    timestamp: str
    payload: Dict[str, Any] = {}

class InjectEventRequest(BaseModel):
    scenarioId: str
    type: str

class InjectEventResponse(BaseModel):
    status: str
    eventId: str
    divergenceId: str
    recoveryJobId: str

class AdapterModel(BaseModel):
    id: str
    name: str
    description: str
    status: str
    href: str
