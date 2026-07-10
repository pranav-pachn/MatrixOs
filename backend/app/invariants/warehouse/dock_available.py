from typing import List
from app.models.domain import Scenario, RecoveryAction, ActionType, Status
from app.invariants.base_rule import BaseRule
from app.invariants.result import RuleResult

class DockAvailableRule(BaseRule):
    name = "DockAvailable"
    description = "A dock resource cannot be reassigned if already occupied."
    
    def validate(self, world_model: Scenario, actions: List[RecoveryAction]) -> RuleResult:
        for action in actions:
            if action.action_type == ActionType.reassign_resource and action.target_resource_id:
                res_id = action.target_resource_id
                
                target_res = next((r for r in world_model.resources if r.id == res_id), None)
                if target_res and target_res.type == 'dock':
                    if target_res.status == Status.occupied:
                        return RuleResult(
                            valid=False,
                            rule=self.name,
                            message=f"Dock {target_res.name} is already occupied by another truck.",
                            category="capacity"
                        )
                        
        return RuleResult(valid=True, rule=self.name, message="Valid.", category="capacity")
