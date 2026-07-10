from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from app.models.domain import Scenario, AdapterMetric

class AdapterMetadata(BaseModel):
    runtime_id: str
    adapter: str
    version: str

class RuntimeContext(BaseModel):
    phase: str
    current_event: Optional[str] = None
    active_plan: Optional[Dict[str, Any]] = None

class RuntimeSnapshot(BaseModel):
    metadata: AdapterMetadata
    runtime: RuntimeContext
    world: Scenario
    metrics: Optional[List[AdapterMetric]] = None

class InjectEventRequest(BaseModel):
    event: str

class InjectEventResponse(BaseModel):
    accepted: bool
    event_id: str

class ScenarioListResponse(BaseModel):
    id: str
    name: str
    description: str
    status: str
    href: str
