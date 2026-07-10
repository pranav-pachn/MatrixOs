from typing import List
from app.models.domain import Scenario, RecoveryAction, ActionType
from app.invariants.base_rule import BaseRule
from app.invariants.result import RuleResult

class DoctorAvailableRule(BaseRule):
    name = "DoctorAvailable"
    description = "A doctor cannot be assigned to two tasks simultaneously via actions."
    
    def validate(self, world_model: Scenario, actions: List[RecoveryAction]) -> RuleResult:
        doctor_assignments = {}
        
        for action in actions:
            if action.action_type == ActionType.reassign_resource and action.target_resource_id:
                res_id = action.target_resource_id
                
                # Check if this resource is a doctor
                target_res = next((r for r in world_model.resources if r.id == res_id), None)
                if target_res and target_res.type == 'doctor':
                    if res_id in doctor_assignments:
                        return RuleResult(
                            valid=False,
                            rule=self.name,
                            message=f"Doctor {target_res.name} is assigned to multiple surgeries/tasks simultaneously.",
                            category="resource_allocation"
                        )
                    doctor_assignments[res_id] = action.target_task_id
                    
        return RuleResult(valid=True, rule=self.name, message="Valid.", category="resource_allocation")
