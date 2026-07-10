from enum import Enum
from typing import List, Optional, Any, Dict, Literal, Union
from pydantic import BaseModel, Field

# Core Enums
class Status(str, Enum):
    available = 'available'
    occupied = 'occupied'
    unavailable = 'unavailable'
    failed = 'failed'

class MissionStatus(str, Enum):
    normal = 'normal'
    in_progress = 'in-progress'
    delayed = 'delayed'
    recovered = 'recovered'
    diverged = 'diverged'

class TaskStatus(str, Enum):
    pending = 'pending'
    active = 'active'
    complete = 'complete'
    rejected = 'rejected'

class EventSeverity(str, Enum):
    info = 'info'
    warning = 'warning'
    critical = 'critical'

class ValidationStatus(str, Enum):
    PASS = 'PASS'
    REJECTED = 'REJECTED'

# Core Models
class Resource(BaseModel):
    id: str
    type: str
    status: Status
    name: str
    currentAssignment: Optional[str] = None

class Task(BaseModel):
    id: str
    name: str
    type: str
    status: TaskStatus
    duration: int
    assignedResourceId: Optional[str] = None
    dependencies: List[str] = []

class Mission(BaseModel):
    id: str
    name: str
    type: str
    status: MissionStatus
    priority: int
    deadline: str
    tasks: List[Task] = []

class RuntimeEvent(BaseModel):
    id: str
    type: str
    timestamp: str
    severity: EventSeverity
    description: str
    affectedMissions: List[str] = []

class Divergence(BaseModel):
    id: str
    eventId: str
    expectedState: str
    actualState: str
    severity: EventSeverity
    detectedAt: str

class RepairPolicy(BaseModel):
    id: str
    divergenceSignature: str
    strategy: str
    confidence: float
    successRate: float

class Adapter(BaseModel):
    id: str
    name: str
    description: str
    status: str
    href: str

class Memory(BaseModel):
    id: str
    type: str
    strategy: str
    confidence: float
    outcome: str
    date: str
    resolutionTime: Optional[float] = None  # ADDED: Time in seconds to resolve

# Recovery and Execution Engine Models
class ActionType(str, Enum):
    reassign_resource = "reassign_resource"
    cancel_task = "cancel_task"
    delay_mission = "delay_mission"
    create_resource = "create_resource"
    mutate_graph = "mutate_graph"

class RecoveryAction(BaseModel):
    """Executable instruction for the ExecutionEngine"""
    action_type: ActionType
    target_resource_id: Optional[str] = None
    target_task_id: Optional[str] = None
    target_mission_id: Optional[str] = None
    new_value: Any = None
    # For graph mutations
    source_node: Optional[str] = None
    target_node: Optional[str] = None

class RecoveryStep(BaseModel):
    id: str
    title: str
    description: str
    status: str
    metrics: Optional[List[Dict[str, Any]]] = None
    codeSnippet: Optional[str] = None
    duration: Optional[int] = None

class Recovery(BaseModel):
    eventType: str
    affectedMissions: List[str]
    confidence: float
    steps: List[RecoveryStep]
    # Added actions for actual execution
    actions: Optional[List[RecoveryAction]] = None

class Scenario(BaseModel):
    id: str
    name: str
    missions: List[Mission]
    resources: List[Resource]
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    divergences: List[Divergence]
    memories: List[Memory]
    confidenceData: List[Dict[str, Any]]
    recovery: Recovery

# Metrics and Validation Models
class SystemMetrics(BaseModel):
    systemHealth: float          # 0-100
    activeConstraints: int
    divergenceRate: float        # per hour
    recoveryLatency: float       # milliseconds
    resourceUtilization: float   # 0-100

class InvariantResult(BaseModel):
    status: ValidationStatus
    constraint: str
    reason: Optional[str] = None

# WebSocket Envelope Models
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

class AgentActionEvent(WSEnvelope):
    event: Literal["agent_action"] = "agent_action"
    type: str  # impact_assessment, planning, validation, validation_success, validation_failure
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
    AgentActionEvent, 
    RecoveryPlanEvent, 
    RecoveryStepUpdateEvent, 
    WorldStateUpdateEvent, 
    MetricsUpdateEvent, 
    DivergenceResolvedEvent
]

# API Request Models
class InjectEventRequest(BaseModel):
    scenarioId: str
    type: str  # e.g., "fuel", "weather"

class InjectEventResponse(BaseModel):
    status: str
    eventId: str
    divergenceId: str
    recoveryJobId: str
