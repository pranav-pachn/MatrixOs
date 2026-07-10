import datetime
from typing import Dict, Any, List
from app.models.domain import Scenario, RecoveryAction, RuntimeMetrics
from app.adapters.registry import get as get_adapter
from app.runtime.state_manager import state_manager
from app.events.bus import event_bus
from app.runtime.metrics_service import compute_metrics
from app.runtime.runtime_types import ExecutionResult, RuntimeEvent

class ExecutionRuntime:
    async def execute(self, scenario_id: str, plan_data: Dict[str, Any]) -> ExecutionResult:
        # Step 1: Get Adapter and World Model
        adapter = get_adapter(scenario_id)
        if not adapter:
            return ExecutionResult(valid=False, validation_errors=["Adapter not found"])
            
        current_state = await state_manager.get_scenario(scenario_id)
        if not current_state:
            return ExecutionResult(valid=False, validation_errors=["Scenario not found"])
            
        actions = [RecoveryAction(**a) for a in plan_data.get("actions", [])]
        
        # Step 2: Validate Plan using Invariant Engine
        from app.invariants.engine import InvariantEngine
        
        rules = adapter.get_rules()
        engine = InvariantEngine(rules)
        report = engine.validate(current_state, actions)
        
        if not report.approved:
            # We must return ExecutionResult with valid=False
            return ExecutionResult(
                valid=False,
                validation_errors=[v.message for v in report.violations]
            )

            
        # Step 3: Apply Execution (Adapter executes plan and mutates state)
        new_state = adapter.execute(plan_data, current_state)
        
        # Step 4: Update World State (Reconcile state via state_manager)
        await self.update_state(scenario_id, new_state)
        
        # Step 5: Emit Runtime Events
        await self.emit_events(scenario_id, new_state)
        
        # Step 6: Compute Metrics
        metrics = self.measure_metrics(new_state)
        
        return ExecutionResult(
            valid=True,
            metrics=metrics,
            scenario=new_state
        )

    async def update_state(self, scenario_id: str, new_state: Scenario):
        await state_manager.apply_recovery_actions(scenario_id, new_state)

    async def emit_events(self, scenario_id: str, new_state: Scenario):
        event = RuntimeEvent(
            event_type="state_updated",
            scenario_id=scenario_id,
            timestamp=datetime.datetime.utcnow().isoformat(),
            data={"missions": len(new_state.missions), "resources": len(new_state.resources)}
        )
        await event_bus.publish("state_updated", event)

    def measure_metrics(self, state: Scenario) -> RuntimeMetrics:
        return compute_metrics(state)

execution_runtime = ExecutionRuntime()
