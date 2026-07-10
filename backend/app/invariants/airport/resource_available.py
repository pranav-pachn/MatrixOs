from typing import List
from app.models.domain import Scenario, RecoveryAction, ActionType, Status
from app.invariants.base_rule import BaseRule
from app.invariants.result import RuleResult

class ResourceAvailableRule(BaseRule):
    name = "ResourceAvailable"
    description = "Resources assigned to tasks must be available and not failed."
    
    def validate(self, world_model: Scenario, actions: List[RecoveryAction]) -> RuleResult:
        # Check if any action assigns a failed resource
        for action in actions:
            if action.action_type == ActionType.reassign_resource and action.target_resource_id:
                target_resource = next((r for r in world_model.resources if r.id == action.target_resource_id), None)
                if target_resource and target_resource.status == Status.failed:
                    return RuleResult(
                        valid=False,
                        rule=self.name,
                        message=f"Cannot assign failed resource: {target_resource.name}.",
                        category="resource_allocation"
                    )
                    
        # Check current state too
        for mission in world_model.missions:
            for task in mission.tasks:
                if task.assignedResourceId:
                    target_res = next((r for r in world_model.resources if r.id == task.assignedResourceId), None)
                    if target_res and target_res.status == Status.failed:
                        return RuleResult(
                            valid=False,
                            rule=self.name,
                            message=f"Task '{task.name}' is assigned to a failed resource '{target_res.name}'.",
                            category="resource_allocation"
                        )
                        
        return RuleResult(valid=True, rule=self.name, message="Valid.", category="resource_allocation")
