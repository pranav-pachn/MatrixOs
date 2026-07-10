from typing import List
from app.models.domain import Scenario, RecoveryAction, TaskState
from app.invariants.base_rule import BaseRule
from app.invariants.result import RuleResult

class BoardingFuelingOverlapRule(BaseRule):
    name = "BoardingFuelingOverlap"
    description = "Boarding and fueling cannot occur simultaneously."
    
    def validate(self, world_model: Scenario, actions: List[RecoveryAction]) -> RuleResult:
        for mission in world_model.missions:
            boarding = next((t for t in mission.tasks if t.type == 'pax'), None)
            fueling = next((t for t in mission.tasks if t.type == 'fuel'), None)
            
            if boarding and fueling:
                if boarding.status == TaskState.RUNNING and fueling.status == TaskState.RUNNING:
                    return RuleResult(
                        valid=False,
                        rule=self.name,
                        message=f"Mission {mission.name}: Boarding and fueling are both running, which is a safety violation.",
                        category="safety"
                    )
                    
        return RuleResult(valid=True, rule=self.name, message="Valid.", category="safety")
