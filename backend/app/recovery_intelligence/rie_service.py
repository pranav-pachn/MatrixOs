import uuid
from typing import Optional
from app.recovery_intelligence.schemas import RecoveryRequest
from app.recovery_intelligence.memory.retriever import retriever
from app.recovery_intelligence.rie_llm import rie_llm
from app.recovery_intelligence.strategy_ranker import ranker
from app.planner.schemas import CandidatePlan

class RecoveryIntelligenceService:
    async def generate(self, request: RecoveryRequest) -> Optional[CandidatePlan]:
        # 1. Retrieve Operational Memory
        memory_data = retriever.retrieve(request.event_type)
        request.retrieval_memory = memory_data.get("episodic", [])
        
        # 2. Call LLM to generate alternatives
        try:
            strategies = await rie_llm.generate(request, memory_data)
        except Exception as e:
            print(f"RIE LLM failed to generate alternatives: {e}")
            return None
            
        # 3. Rank strategies
        ranked_strategies = ranker.rank(strategies)
        if not ranked_strategies:
            return None
            
        best_strategy = ranked_strategies[0]
        
        # 4. Convert to CandidatePlan to re-enter the Policy Engine
        candidate_plan = CandidatePlan(
            id=f"rie_{uuid.uuid4().hex[:6]}",
            title=f"[RIE] {best_strategy.title}",
            description=best_strategy.description,
            strategy="RIE Alternative",
            affected_resources=[], # Filled dynamically by policy/optimizer
            estimated_delay=best_strategy.estimated_delay,
            confidence=best_strategy.confidence,
            reasoning=best_strategy.reasoning,
            recovery_intent=best_strategy.recovery_intent
        )
        
        return candidate_plan

rie_service = RecoveryIntelligenceService()
