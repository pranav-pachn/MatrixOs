from typing import List
from app.recovery_intelligence.schemas import RecoveryStrategy

class StrategyRanker:
    def rank(self, strategies: List[RecoveryStrategy]) -> List[RecoveryStrategy]:
        """
        Ranks strategies using a composite score.
        score = 0.6 * confidence - 0.4 * normalized_delay
        """
        if not strategies:
            return []

        # Find max delay for normalization
        max_delay = max([s.estimated_delay for s in strategies])
        if max_delay == 0:
            max_delay = 1
            
        def compute_score(strategy: RecoveryStrategy) -> float:
            normalized_delay = strategy.estimated_delay / max_delay
            return (0.6 * strategy.confidence) - (0.4 * normalized_delay)
            
        return sorted(strategies, key=compute_score, reverse=True)

ranker = StrategyRanker()
