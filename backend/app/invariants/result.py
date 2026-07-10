from dataclasses import dataclass
from typing import List

@dataclass
class RuleResult:
    valid: bool
    rule: str       # Machine-readable rule name, e.g., "FuelBeforePushback"
    message: str    # Human-readable failure reason
    category: str   # "task_ordering", "resource_allocation", "capacity", "temporal", "safety", "domain"

@dataclass
class ValidationReport:
    approved: bool
    results: List[RuleResult]
    violations: List[RuleResult]
