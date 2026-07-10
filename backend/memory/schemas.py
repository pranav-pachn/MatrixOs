from pydantic import BaseModel
from typing import Optional, Dict, Any

class RecoveryRecord(BaseModel):
    id: str
    disruption_type: str
    mission_type: str
    strategy_id: str
    strategy_name: str
    success: bool
    delay_minutes: int
    latency_ms: int
    failure_reason: Optional[str] = None
    context_snapshot: Optional[Dict[str, Any]] = None
    timestamp: str

class MemoryStats(BaseModel):
    disruption_type: str
    total_occurrences: int
    success_rate: float
    avg_delay_minutes: float
    best_strategy: str
    avg_latency_ms: float
    strategy_effectiveness: Dict[str, float] = {}
