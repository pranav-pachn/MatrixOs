from typing import List
from app.models.domain import Scenario, RecoveryAction, ActionType
from app.invariants.base_rule import BaseRule
from app.invariants.result import RuleResult

class ResourceNotDoubleAssignedRule(BaseRule):
    name = "ResourceNotDoubleAssigned"
    description = "A resource cannot be assigned to two tasks simultaneously via actions."
    
    def validate(self, world_model: Scenario, actions: List[RecoveryAction]) -> RuleResult:
        resource_assignments = {}
        
        for action in actions:
            if action.action_type == ActionType.reassign_resource and action.target_resource_id:
                res_id = action.target_resource_id
                if res_id in resource_assignments:
                    return RuleResult(
                        valid=False,
                        rule=self.name,
                        message=f"Resource {res_id} is assigned to multiple tasks simultaneously.",
                        category="resource_allocation"
                    )
                resource_assignments[res_id] = action.target_task_id
                
        return RuleResult(valid=True, rule=self.name, message="Valid.", category="resource_allocation")
