from typing import List
from app.models.domain import Scenario, RecoveryAction
from app.invariants.base_rule import BaseRule
from app.invariants.result import ValidationReport

class InvariantEngine:
    def __init__(self, rules: List[BaseRule]):
        self.rules = rules

    def validate(self, world_model: Scenario, actions: List[RecoveryAction]) -> ValidationReport:
        results = [rule.validate(world_model, actions) for rule in self.rules]
        violations = [r for r in results if not r.valid]
        
        return ValidationReport(
            approved=len(violations) == 0,
            results=results,
            violations=violations
        )
