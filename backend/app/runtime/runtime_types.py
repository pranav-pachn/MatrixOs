from typing import Any, Optional, Dict
from pydantic import BaseModel
from app.models.domain import RuntimeMetrics, Scenario, ValidationResult

class RuntimeEvent(BaseModel):
    event_type: str
    scenario_id: str
    timestamp: str
    data: Dict[str, Any]

class ExecutionResult(BaseModel):
    valid: bool
    metrics: Optional[RuntimeMetrics] = None
    validation_errors: Optional[list[str]] = None
    scenario: Optional[Scenario] = None
