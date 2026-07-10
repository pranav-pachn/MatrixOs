from typing import List, Optional, Dict, Any
from .schemas import RecoveryRecord, MemoryStats
from .recorder import recorder
from .retrieval import retrieval

class OperationalMemory:
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
        return recorder.record(
            disruption_type, mission_type, strategy_id, strategy_name,
            success, delay_minutes, latency_ms, failure_reason, context_snapshot
        )

    def retrieve(self, disruption_type: str, limit: int = 3) -> List[RecoveryRecord]:
        return retrieval.retrieve(disruption_type, limit)

    def recent(self, limit: int = 10) -> List[RecoveryRecord]:
        return retrieval.recent(limit)

    def statistics(self, disruption_type: str) -> MemoryStats:
        return retrieval.statistics(disruption_type)

operational_memory = OperationalMemory()
