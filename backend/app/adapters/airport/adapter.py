import os
import json
from typing import List, Dict, Any
from app.models.domain import Scenario, RecoveryAction, ValidationResult, AdapterMetric, ConstraintRule, AdapterEvent, ActionType, InvariantResult, ValidationStatus
from app.adapters.base import BaseAdapter
from app.adapters.airport.events import get_events
from app.adapters.airport.constraints import get_constraints, validate_state

class AirportAdapter(BaseAdapter):
    
    def load(self) -> Scenario:
        # Resolve path to backend/data/airport.json
        data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "data")
        file_path = os.path.join(data_dir, "airport.json")
        
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return Scenario.model_validate(data)

    def validate(self, world_state: Scenario, actions: List[RecoveryAction]) -> ValidationResult:
        # In a real system, we'd apply the actions to a cloned state and validate it.
        # For now, we just validate the proposed actions independently and then the state.
        
        errors = []
        for action in actions:
            if action.action_type == ActionType.reassign_resource:
                target_res = next((r for r in world_state.resources if r.id == action.target_resource_id), None)
                if target_res and target_res.status == 'failed':
                    errors.append(f"Cannot reassign to failed resource: {target_res.name}")
                    
        # Also validate state
        state_validation = validate_state(world_state)
        if not state_validation.valid:
            errors.extend(state_validation.errors)
            
        return ValidationResult(valid=len(errors) == 0, errors=errors)

    def execute(self, plan: Dict[str, Any], current_state: Scenario) -> Scenario:
        # Clone current state
        new_state = current_state.model_copy(deep=True)
        
        # In Phase 0/1, we just apply the recovery plan's actions
        actions_data = plan.get("actions", [])
        for action in actions_data:
            action_type = action.get("action_type")
            if action_type == "reassign_resource":
                # Find task
                target_task_id = action.get("target_task_id")
                new_resource_id = action.get("target_resource_id")
                
                for mission in new_state.missions:
                    for task in mission.tasks:
                        if task.id == target_task_id:
                            task.assignedResourceId = new_resource_id
                            
        return new_state

    def metrics(self) -> List[AdapterMetric]:
        return [
            AdapterMetric(key="avgDelay", value=15.5, unit="mins", label="Average Delay"),
            AdapterMetric(key="gateUtilization", value=85.0, unit="%", label="Gate Utilization"),
            AdapterMetric(key="turnaroundTime", value=42.0, unit="mins", label="Avg Turnaround Time"),
            AdapterMetric(key="flightsDelayed", value=3, unit="count", label="Flights Delayed")
        ]

    def constraints(self) -> List[ConstraintRule]:
        return get_constraints()

    def events(self) -> List[AdapterEvent]:
        return get_events()
        
    def evaluate_invariants(self, scenario: Scenario, actions: List[RecoveryAction]) -> List[InvariantResult]:
        validation = self.validate(scenario, actions)
        if validation.valid:
            return [InvariantResult(status=ValidationStatus.PASS, constraint="Airport Operations Rules", reason="All constraints passed.")]
        else:
            return [InvariantResult(status=ValidationStatus.REJECTED, constraint="Airport Rules", reason=err) for err in validation.errors]
