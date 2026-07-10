from typing import List
from app.models.domain import Scenario, RecoveryAction, ActionType
from app.invariants.base_rule import BaseRule
from app.invariants.result import RuleResult

class ForkliftRequiredRule(BaseRule):
    name = "ForkliftRequired"
    description = "Any load/unload task must have a forklift resource assigned."
    
    def validate(self, world_model: Scenario, actions: List[RecoveryAction]) -> RuleResult:
        # Evaluate current state against potential un-assignments
        for mission in world_model.missions:
            for task in mission.tasks:
                if task.type in ['load', 'unload']:
                    # We check if a cancel_task action or reassign_resource action leaves this task without a forklift
                    # For simplicity, if they reassign to a resource that is NOT a forklift, we fail it.
                    new_resource_id = task.assignedResourceId
                    
                    for action in actions:
                        if action.action_type == ActionType.reassign_resource and action.target_task_id == task.id:
                            new_resource_id = action.target_resource_id
                            
                    if new_resource_id:
                        res = next((r for r in world_model.resources if r.id == new_resource_id), None)
                        if res and res.type != 'forklift':
                            return RuleResult(
                                valid=False,
                                rule=self.name,
                                message=f"Task {task.name} requires a forklift but was assigned a {res.type}.",
                                category="domain"
                            )
                            
        return RuleResult(valid=True, rule=self.name, message="Valid.", category="domain")
