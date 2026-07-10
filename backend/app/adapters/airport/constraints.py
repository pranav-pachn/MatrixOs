from typing import List
from app.models.domain import ConstraintRule, Scenario, ValidationResult

def get_constraints() -> List[ConstraintRule]:
    return [
        ConstraintRule(
            id="rule_no_boarding_fueling",
            description="Boarding cannot overlap with Fueling",
            is_active=True
        ),
        ConstraintRule(
            id="rule_one_gate_per_aircraft",
            description="One Gate per Aircraft",
            is_active=True
        ),
        ConstraintRule(
            id="rule_pushback_after_inspection",
            description="Pushback after Inspection",
            is_active=True
        )
    ]

def validate_state(scenario: Scenario) -> ValidationResult:
    errors = []
    
    # 1. Check Boarding vs Fueling
    for mission in scenario.missions:
        fueling = next((t for t in mission.tasks if t.type == 'fuel'), None)
        boarding = next((t for t in mission.tasks if t.type == 'pax'), None)
        
        if fueling and boarding:
            if fueling.status == 'in-progress' and boarding.status == 'in-progress':
                errors.append(f"Constraint Violation: {mission.name} is boarding and fueling simultaneously.")

    # 2. Check Gate Occupancy (simplified)
    # 3. Check Resource Assignment Validity (don't assign to failed resources)
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
