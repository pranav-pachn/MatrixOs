from abc import ABC, abstractmethod
from typing import List
from app.models.domain import Scenario, RecoveryAction, InvariantResult

class BaseAdapter(ABC):
    @abstractmethod
    def evaluate_invariants(self, scenario: Scenario, actions: List[RecoveryAction]) -> List[InvariantResult]:
        pass
