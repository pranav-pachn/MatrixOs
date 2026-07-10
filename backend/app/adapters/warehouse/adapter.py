import os
import json
from typing import List, Dict, Any
from app.models.domain import Scenario, RecoveryAction, ValidationResult, AdapterMetric, ConstraintRule, AdapterEvent, ActionType, InvariantResult, ValidationStatus
from app.adapters.base import BaseAdapter
from app.adapters.warehouse.events import get_events
from app.adapters.warehouse.constraints import get_constraints, validate_state

class WarehouseAdapter(BaseAdapter):
    def __init__(self):
        super().__init__()
        self.config.solver_timeout_seconds = 10
        
    def load(self) -> Scenario:
        data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "data")
        file_path = os.path.join(data_dir, "warehouse-hub.json")
        
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return Scenario.model_validate(data)

    def validate(self, world_state: Scenario, actions: List[RecoveryAction]) -> ValidationResult:
        errors = []
        for action in actions:
            if action.action_type == ActionType.reassign_resource:
                target_res = next((r for r in world_state.resources if r.id == action.target_resource_id), None)
                if target_res and target_res.status == 'failed':
                    errors.append(f"Cannot reassign to failed resource: {target_res.name}")
                    
        state_validation = validate_state(world_state)
        if not state_validation.valid:
            errors.extend(state_validation.errors)
            
        return ValidationResult(valid=len(errors) == 0, errors=errors)

    def execute(self, plan: Dict[str, Any], current_state: Scenario) -> Scenario:
        new_state = current_state.model_copy(deep=True)
        
        actions_data = plan.get("actions", [])
        for action in actions_data:
            action_type = action.get("action_type")
            if action_type == "reassign_resource":
                target_task_id = action.get("target_task_id")
                new_resource_id = action.get("target_resource_id")
                
                for mission in new_state.missions:
                    for task in mission.tasks:
                        if task.id == target_task_id:
                            task.assignedResourceId = new_resource_id
                            
        return new_state

    def metrics(self) -> List[AdapterMetric]:
        return [
            AdapterMetric(key="ordersCompleted", value=1450, unit="count", label="Orders Completed"),
            AdapterMetric(key="truckDelay", value=5.2, unit="mins", label="Avg Truck Delay"),
            AdapterMetric(key="inventoryAccuracy", value=99.8, unit="%", label="Inventory Accuracy")
        ]

    def objectives(self) -> List[str]:
        return [
            "Maximize order fulfillment throughput",
            "Minimize loading dock delays",
            "Optimize robotic fleet utilization"
        ]

    def constraints(self) -> List[ConstraintRule]:
        return get_constraints()

    def events(self) -> List[AdapterEvent]:
        return get_events()

    def get_rules(self) -> List['BaseRule']:
        from app.invariants.warehouse import get_warehouse_rules
        return get_warehouse_rules()

        
    def evaluate_invariants(self, scenario: Scenario, actions: List[RecoveryAction]) -> List[InvariantResult]:
        validation = self.validate(scenario, actions)
        if validation.valid:
            return [InvariantResult(status=ValidationStatus.PASS, constraint="Warehouse Rules", reason="All constraints passed.")]
        else:
            return [InvariantResult(status=ValidationStatus.REJECTED, constraint="Warehouse Rules", reason=err) for err in validation.errors]
