from typing import List
from app.models.domain import Scenario, RecoveryAction, TaskState
from app.invariants.base_rule import BaseRule
from app.invariants.result import RuleResult

class FuelingBeforePushbackRule(BaseRule):
    name = "FuelBeforePushback"
    description = "Aircraft cannot push back before fueling completes."
    
    def validate(self, world_model: Scenario, actions: List[RecoveryAction]) -> RuleResult:
        # Check current state + actions
        for mission in world_model.missions:
            pushback = next((t for t in mission.tasks if t.type == 'pushback'), None)
            fueling = next((t for t in mission.tasks if t.type == 'fuel'), None)
            
            if pushback and fueling:
                # If fueling is running or pending, pushback cannot be running/ready.
                if fueling.status in [TaskState.RUNNING, TaskState.PENDING, TaskState.READY]:
                    if pushback.status in [TaskState.RUNNING, TaskState.READY]:
                        return RuleResult(
                            valid=False,
                            rule=self.name,
                            message=f"Mission {mission.name}: Pushback cannot proceed while fueling is incomplete.",
                            category="task_ordering"
                        )
                        
        return RuleResult(valid=True, rule=self.name, message="Valid.", category="task_ordering")
