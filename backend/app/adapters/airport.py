from typing import List
from app.models.domain import Scenario, RecoveryAction, InvariantResult, ValidationStatus, ActionType
from adapters.base import BaseAdapter

class AirportAdapter(BaseAdapter):
    def evaluate_invariants(self, scenario: Scenario, actions: List[RecoveryAction]) -> List[InvariantResult]:
        results = []
        
        # Invariants Check
        for action in actions:
            if action.action_type == ActionType.reassign_resource:
                target_res = next((r for r in scenario.resources if r.id == action.target_resource_id), None)
                if target_res and target_res.status == 'failed':
                    results.append(InvariantResult(
                        status=ValidationStatus.REJECTED,
                        constraint="Resource Availability",
                        reason=f"Cannot assign to failed resource: {target_res.name}"
                    ))
                    continue

        if not any(r.status == ValidationStatus.REJECTED for r in results):
            results.append(InvariantResult(
                status=ValidationStatus.PASS,
                constraint="Airport Operations Rules",
                reason="All constraints passed."
            ))
            
        return results
