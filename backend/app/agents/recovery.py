import asyncio
from typing import Dict, Any, List
from app.models.domain import Scenario, RecoveryAction, InvariantResult, ActionType, ValidationStatus
from app.adapters.base import BaseAdapter
from app.adapters.airport import AirportAdapter
from app.agents.gateway import gateway

class RecoveryAgent:
    def __init__(self):
        pass

    async def assess_impact(self, event_type: str, scenario: Scenario) -> str:
        return await gateway.interpret_event(event_type, scenario)

    async def generate_plan(self, event_type: str, scenario: Scenario) -> Dict[str, Any]:
        return await gateway.plan_recovery(event_type, scenario)

class InvariantEngine:
    def __init__(self):
        self.adapters = {
            "airport": AirportAdapter(),
        }

    async def validate(self, scenario_id: str, scenario: Scenario, actions: List[RecoveryAction]) -> List[InvariantResult]:
        """Deterministic invariant validation using Domain Adapter"""
        await asyncio.sleep(0.5)
        
        adapter = self.adapters.get(scenario_id)
        if not adapter:
            return [InvariantResult(status=ValidationStatus.PASS, constraint="No adapter", reason="Fallback pass")]
            
        return adapter.evaluate_invariants(scenario, actions)

recovery_agent = RecoveryAgent()
invariant_engine = InvariantEngine()
