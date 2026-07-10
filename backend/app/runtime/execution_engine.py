from typing import List
from app.models.domain import RecoveryAction, ActionType, Status, MissionStatus
from app.runtime.state_manager import state_manager

class ExecutionEngine:
    async def execute(self, scenario_id: str, actions: List[RecoveryAction]):
        for action in actions:
            if action.action_type == ActionType.reassign_resource:
                if action.target_resource_id and action.target_task_id:
                    # Update task with new resource
                    await state_manager.update_task(
                        scenario_id, 
                        action.target_task_id, 
                        assigned_resource_id=action.target_resource_id
                    )
                    # Update resource status to occupied
                    await state_manager.update_resource(
                        scenario_id, 
                        action.target_resource_id, 
                        status=Status.occupied
                    )
            elif action.action_type == ActionType.delay_mission:
                if action.target_mission_id:
                    await state_manager.update_mission(
                        scenario_id,
                        action.target_mission_id,
                        status=MissionStatus.delayed
                    )

execution_engine = ExecutionEngine()
