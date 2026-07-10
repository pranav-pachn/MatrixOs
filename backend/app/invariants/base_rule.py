from abc import ABC, abstractmethod
from typing import List
from app.models.domain import Scenario, RecoveryAction
from app.invariants.result import RuleResult

class BaseRule(ABC):
    name: str          # e.g., "FuelBeforePushback"
    description: str   # e.g., "Aircraft cannot push back before fueling completes."
    
    @abstractmethod
    def validate(self, world_model: Scenario, actions: List[RecoveryAction]) -> RuleResult:
        """Evaluate the rule against the current world model and proposed actions."""
        pass
