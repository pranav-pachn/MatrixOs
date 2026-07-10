from enum import Enum
from typing import List, Optional, Any, Dict, Literal
from pydantic import BaseModel

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

class TaskState(str, Enum):
    PENDING = 'PENDING'
    READY = 'READY'
    RUNNING = 'RUNNING'
    FAILED = 'FAILED'
    REPLANNED = 'REPLANNED'
    COMPLETED = 'COMPLETED'

class EventSeverity(str, Enum):
    info = 'info'
    warning = 'warning'
    critical = 'critical'

class ValidationStatus(str, Enum):
    PASS = 'PASS'
    REJECTED = 'REJECTED'

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
    status: TaskState
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

class Divergence(BaseModel):
    id: str
    eventId: str
    expectedState: str
    actualState: str
    severity: EventSeverity
    detectedAt: str

class Memory(BaseModel):
    id: str
    type: str
    strategy: str
    confidence: float
    outcome: str
    date: str
    resolutionTime: Optional[float] = None

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

class SystemMetrics(BaseModel):
    systemHealth: float
    activeConstraints: int
    divergenceRate: float
    recoveryLatency: float
    resourceUtilization: float

class InvariantResult(BaseModel):
    status: ValidationStatus
    constraint: str
    reason: Optional[str] = None

class ActionType(str, Enum):
    reassign_resource = "reassign_resource"
    cancel_task = "cancel_task"
    delay_mission = "delay_mission"
    create_resource = "create_resource"
    mutate_graph = "mutate_graph"

class RecoveryAction(BaseModel):
    action_type: ActionType
    target_resource_id: Optional[str] = None
    target_task_id: Optional[str] = None
    target_mission_id: Optional[str] = None
    new_value: Any = None
    source_node: Optional[str] = None
    target_node: Optional[str] = None

class AdapterMetric(BaseModel):
    key: str
    value: float
    unit: str
    label: str

class AdapterEvent(BaseModel):
    id: str
    type: str
    severity: EventSeverity
    description: str

class ConstraintRule(BaseModel):
    id: str
    description: str
    is_active: bool

class ValidationResult(BaseModel):
    valid: bool
    errors: List[str]

class RuntimeMetrics(BaseModel):
    active_tasks: int
    completed_tasks: int
    failed_tasks: int
    utilization: float
    delay: int
    throughput: int
