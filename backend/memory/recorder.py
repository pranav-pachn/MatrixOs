import uuid
import datetime
from typing import Optional, Dict, Any
from .schemas import RecoveryRecord
from .repository import repository

class MemoryRecorder:
    def record(
        self,
        disruption_type: str,
        mission_type: str,
        strategy_id: str,
        strategy_name: str,
        success: bool,
        delay_minutes: int,
        latency_ms: int,
        failure_reason: Optional[str] = None,
        context_snapshot: Optional[Dict[str, Any]] = None
    ) -> RecoveryRecord:
        record_id = f"case_{uuid.uuid4().hex[:8]}"
        timestamp = datetime.datetime.utcnow().isoformat()
        
        record = RecoveryRecord(
            id=record_id,
            disruption_type=disruption_type,
            mission_type=mission_type,
            strategy_id=strategy_id,
            strategy_name=strategy_name,
            success=success,
            delay_minutes=delay_minutes,
            latency_ms=latency_ms,
            failure_reason=failure_reason,
            context_snapshot=context_snapshot,
            timestamp=timestamp
        )
        
        repository.insert(record)
        return record

recorder = MemoryRecorder()
