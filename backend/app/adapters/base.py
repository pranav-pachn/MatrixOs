from abc import ABC, abstractmethod
from typing import List, Dict, Any
from pydantic import BaseModel
from app.models.domain import Scenario, RecoveryAction, InvariantResult, ValidationResult, AdapterMetric, ConstraintRule, AdapterEvent
from app.invariants.base_rule import BaseRule

class AdapterConfig(BaseModel):
    solver_timeout_seconds: int = 5

class BaseAdapter(ABC):
    def __init__(self):
        self.config = AdapterConfig()

    @abstractmethod
    def load(self) -> Scenario:
        """Initialize and return the world state scenario."""
        pass

    @abstractmethod
    def validate(self, world_state: Scenario, actions: List[RecoveryAction]) -> ValidationResult:
        """Validate if the proposed actions are valid according to domain rules."""
        pass

    @abstractmethod
    def execute(self, plan: Dict[str, Any], current_state: Scenario) -> Scenario:
        """Apply the recovery plan mutations and return the updated Scenario."""
        pass

    @abstractmethod
    def metrics(self) -> List[AdapterMetric]:
        """Return the KPIs for this domain."""
        pass

    @abstractmethod
    def constraints(self) -> List[ConstraintRule]:
        """Return the domain constraint rules."""
        pass

    @abstractmethod
    def events(self) -> List[AdapterEvent]:
        """Return the possible event types for this domain."""
        pass

    @abstractmethod
    def objectives(self) -> List[str]:
        """Return the objectives for this domain."""
        pass

    @abstractmethod
    def get_rules(self) -> List[BaseRule]:
        """Return the domain-specific invariant rules for this adapter."""
        pass

    # Kept for backward compatibility -- calls validate internally or can be overridden
    def evaluate_invariants(self, scenario: Scenario, actions: List[RecoveryAction]) -> List[InvariantResult]:
        """Legacy method for evaluating invariants."""
        # This will be replaced by the validate() flow, but we keep it so old code doesn't crash
        return []
