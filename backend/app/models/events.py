from enum import Enum
from typing import List, Optional, Any, Dict, Literal, Union
from pydantic import BaseModel
from .domain import (
    Scenario, Mission, Resource, Divergence, 
    EventSeverity, SystemMetrics, Recovery
)

class WSEnvelope(BaseModel):
    event: str
    timestamp: str

class NewDivergenceEvent(WSEnvelope):
    event: Literal["new_divergence"] = "new_divergence"
    eventId: str
    type: str
    message: str
    severity: EventSeverity
    divergence: Optional[Divergence] = None

class RuntimePhase(str, Enum):
    OBSERVING = "OBSERVING"
    ASSESSING = "ASSESSING"
    PLANNING = "PLANNING"
    POLICY = "POLICY"
    OPTIMIZING = "OPTIMIZING"
    VALIDATING = "VALIDATING"
    EXECUTING = "EXECUTING"

class RuntimePhaseEvent(WSEnvelope):
    event: Literal["runtime.phase.started", "runtime.phase.completed", "runtime.phase.failed"]
    phase: RuntimePhase
    message: str
    duration: Optional[int] = None

class AgentActionEvent(WSEnvelope):
    event: Literal["agent_action"] = "agent_action"
    type: str
    message: str

class RecoveryPlanEvent(WSEnvelope):
    event: Literal["recovery_plan"] = "recovery_plan"
    data: Recovery

class RecoveryStepUpdateEvent(WSEnvelope):
    event: Literal["recovery_step_update"] = "recovery_step_update"
    stepId: str
    status: str

class WorldStateUpdateEvent(WSEnvelope):
    event: Literal["world_state_update"] = "world_state_update"
    missions: List[Mission]
    resources: List[Resource]
    edges: List[Dict[str, Any]]
    divergences: List[Divergence]

class MetricsUpdateEvent(WSEnvelope):
    event: Literal["metrics_update"] = "metrics_update"
    data: SystemMetrics

class DivergenceResolvedEvent(WSEnvelope):
    event: Literal["divergence_resolved"] = "divergence_resolved"
    divergenceId: str

WSEventModel = Union[
    NewDivergenceEvent, 
    RuntimePhaseEvent,
    AgentActionEvent, 
    RecoveryPlanEvent, 
    RecoveryStepUpdateEvent, 
    WorldStateUpdateEvent, 
    MetricsUpdateEvent, 
    DivergenceResolvedEvent
]

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
