from typing import List
from app.models.domain import ConstraintRule, Scenario, ValidationResult

def get_constraints() -> List[ConstraintRule]:
    return [
        ConstraintRule(
            id="rule_forklift_capacity",
            description="Forklift capacity cannot be exceeded",
            is_active=True
        ),
        ConstraintRule(
            id="rule_dock_occupancy",
            description="One truck per dock at a time",
            is_active=True
        ),
        ConstraintRule(
            id="rule_truck_load_order",
            description="Trucks must be loaded in dispatch order",
            is_active=True
        )
    ]

def validate_state(scenario: Scenario) -> ValidationResult:
    errors = []
    
    # 1. Check Dock Occupancy
    # 2. Check Forklift Capacity
    
    for mission in scenario.missions:
        for task in mission.tasks:
            if task.assignedResourceId:
                target_res = next((r for r in scenario.resources if r.id == task.assignedResourceId), None)
                if target_res and target_res.status == 'failed':
                    errors.append(f"Constraint Violation: Task '{task.name}' assigned to failed resource '{target_res.name}'.")

    return ValidationResult(
        valid=len(errors) == 0,
        errors=errors
    )
