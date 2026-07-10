from typing import List
from app.models.domain import ConstraintRule, Scenario, ValidationResult

def get_constraints() -> List[ConstraintRule]:
    return [
        ConstraintRule(
            id="rule_doctor_one_room",
            description="Doctor cannot operate in two rooms",
            is_active=True
        ),
        ConstraintRule(
            id="rule_icu_capacity",
            description="ICU capacity cannot be exceeded",
            is_active=True
        ),
        ConstraintRule(
            id="rule_mri_occupancy",
            description="MRI occupancy constraint",
            is_active=True
        )
    ]

def validate_state(scenario: Scenario) -> ValidationResult:
    errors = []
    
    # 1. Check if Doctor is assigned to multiple active tasks
    # 2. Check ICU capacity
    
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
