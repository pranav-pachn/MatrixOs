from typing import List, Dict, Any
from .repository import repository
from .schemas import RecoveryRecord, MemoryStats

class MemoryRetrieval:
    def retrieve(self, disruption_type: str, limit: int = 3) -> List[RecoveryRecord]:
        return repository.query_by_disruption(disruption_type, limit)

    def recent(self, limit: int = 10) -> List[RecoveryRecord]:
        return repository.query_recent(limit)

    def statistics(self, disruption_type: str) -> MemoryStats:
        records = repository.query_all_by_disruption(disruption_type)
        if not records:
            return MemoryStats(
                disruption_type=disruption_type,
                total_occurrences=0,
                success_rate=0.0,
                avg_delay_minutes=0.0,
                best_strategy="None",
                avg_latency_ms=0.0,
                strategy_effectiveness={}
            )
            
        total = len(records)
        successes = [r for r in records if r.success]
        success_rate = len(successes) / total
        
        avg_delay = sum(r.delay_minutes for r in successes) / len(successes) if successes else 0.0
        avg_latency = sum(r.latency_ms for r in records) / total
        
        # Strategy effectiveness
        strategy_stats = {}
        for r in records:
            if r.strategy_name not in strategy_stats:
                strategy_stats[r.strategy_name] = {"total": 0, "success": 0}
            strategy_stats[r.strategy_name]["total"] += 1
            if r.success:
                strategy_stats[r.strategy_name]["success"] += 1
                
        effectiveness = {}
        best_strategy = "None"
        best_rate = -1.0
        
        for strat, stats in strategy_stats.items():
            rate = stats["success"] / stats["total"]
            effectiveness[strat] = rate
            if rate > best_rate and stats["total"] > 0:
                best_rate = rate
                best_strategy = strat
                
        return MemoryStats(
            disruption_type=disruption_type,
            total_occurrences=total,
            success_rate=success_rate,
            avg_delay_minutes=avg_delay,
            best_strategy=best_strategy,
            avg_latency_ms=avg_latency,
            strategy_effectiveness=effectiveness
        )

retrieval = MemoryRetrieval()
