import datetime
import uuid
import time
from typing import List, Optional
import asyncio

from app.models.events import RuntimePhase, RuntimeEvent
from app.models.domain import CurrentPlan, Memory
from app.websocket.broadcaster import runtime_broadcaster
from app.agents.recovery import recovery_agent
from app.runtime.state_manager import state_manager
from app.runtime.execution_engine import execution_runtime
from app.recovery_intelligence.rie_service import rie_service
from app.recovery_intelligence.schemas import RecoveryRequest
from memory.memory_service import operational_memory

async def broadcast_phase(scenario_id: str, phase: RuntimePhase, status: str, message: str, duration: int = None):
    event = RuntimeEvent(
        id=str(uuid.uuid4()),
        type=f"runtime.phase.{status}",
        phase=phase,
        timestamp=datetime.datetime.utcnow().isoformat(),
        payload={"message": message, "duration": duration}
    )
    await runtime_broadcaster.publish(scenario_id, event)

async def run_recovery_loop(scenario_id: str, event_type: str, divergence_id: str):
    scenario = await state_manager.get_scenario(scenario_id)
    if not scenario: return
    
    await broadcast_phase(scenario_id, RuntimePhase.OBSERVING, "completed", f"Detected {event_type} event", duration=0)
    
    start_time = time.perf_counter()
    await broadcast_phase(scenario_id, RuntimePhase.ASSESSING, "started", "AI Agent analyzing impact...")
    impact = await recovery_agent.assess_impact(event_type, scenario)
    duration_ms = int((time.perf_counter() - start_time) * 1000)
    await broadcast_phase(scenario_id, RuntimePhase.ASSESSING, "completed", f"Impact: {impact}", duration_ms)

    max_attempts = 2
    
    candidate_plans = []
    failed_strategy_title = "Unknown"
    failure_reason = ""
    constraint_violations = []

    for attempt in range(max_attempts + 1):
        if attempt == 0:
            # Phase 3: PLANNING (Normal)
            start_time = time.perf_counter()
            await broadcast_phase(scenario_id, RuntimePhase.PLANNING, "started", "Generating candidate recovery plans...")
            
            from app.planner.planner_service import planner_service
            planner_response = await planner_service.plan(scenario_id, event_type)
            candidate_plans = planner_response.plans
            
            duration_ms = int((time.perf_counter() - start_time) * 1000)
            await broadcast_phase(scenario_id, RuntimePhase.PLANNING, "completed", f"Generated {len(candidate_plans)} candidate strategies.", duration_ms)
        else:
            # RIE ACTIVATION
            start_time = time.perf_counter()
            await broadcast_phase(scenario_id, RuntimePhase.RECOVERY_ACTIVATED, "started", f"Activating Recovery Intelligence Engine (Attempt {attempt})...")
            
            await broadcast_phase(scenario_id, RuntimePhase.MEMORY_RETRIEVED, "started", "Querying operational memory...")
            
            rie_request = RecoveryRequest(
                world_state=scenario,
                failed_strategy=failed_strategy_title,
                failure_reason=failure_reason,
                event_type=event_type,
                constraint_violations=constraint_violations
            )
            
            rie_plan = await rie_service.generate(rie_request)
            
            if rie_request.retrieval_memory:
                mem_msg = f"Retrieved {len(rie_request.retrieval_memory)} episodic records."
            else:
                mem_msg = "No episodic memory found. Using procedural playbooks."
            await broadcast_phase(scenario_id, RuntimePhase.MEMORY_RETRIEVED, "completed", mem_msg, duration=10)
            
            await broadcast_phase(scenario_id, RuntimePhase.RECOVERY_REPLANNING, "started", "Synthesizing alternative strategy...")
            
            duration_ms = int((time.perf_counter() - start_time) * 1000)
            
            if not rie_plan:
                await broadcast_phase(scenario_id, RuntimePhase.RECOVERY_REPLANNING, "failed", "RIE failed to generate an alternative strategy.", duration_ms)
                await broadcast_phase(scenario_id, RuntimePhase.COMPLETED, "failed", "Exhausted RIE retries.", duration_ms)
                break
                
            await broadcast_phase(scenario_id, RuntimePhase.RECOVERY_ACTIVATED, "completed", f"Alternative strategy synthesized: {rie_plan.title}", duration_ms)
            await broadcast_phase(scenario_id, RuntimePhase.RECOVERY_REPLANNING, "completed", "Re-entering main pipeline.", duration_ms)
            
            candidate_plans = [rie_plan]

        # Phase 4: POLICY
        start_time = time.perf_counter()
        await broadcast_phase(scenario_id, RuntimePhase.POLICY, "started", "Evaluating strategies against domain objectives...")
        
        from app.policy.engine import policy_engine
        from app.adapters.registry import get as get_adapter
        
        adapter = get_adapter(scenario_id)
        objectives = adapter.objectives() if hasattr(adapter, "objectives") else []
        constraints = adapter.constraints() if hasattr(adapter, "constraints") else []
        timeout = adapter.config.solver_timeout_seconds if hasattr(adapter, "config") else 5
        
        best_plan = policy_engine.choose(candidate_plans, objectives)
        failed_strategy_title = best_plan.title
        
        duration_ms = int((time.perf_counter() - start_time) * 1000)
        await broadcast_phase(scenario_id, RuntimePhase.POLICY, "completed", f"Selected Strategy: {best_plan.title}", duration_ms)

        # Phase 5: OPTIMIZING
        start_time = time.perf_counter()
        await broadcast_phase(scenario_id, RuntimePhase.OPTIMIZING, "started", "OR-Tools computing mathematically optimal resource assignments...")
        
        from app.optimizer.optimizer import optimization_engine
        
        optimized_plan = optimization_engine.optimize(
            world_state=scenario,
            selected_plan=best_plan,
            objectives=objectives,
            constraints=constraints,
            timeout_seconds=timeout
        )
        
        duration_ms = int((time.perf_counter() - start_time) * 1000)
        if optimized_plan.solver_status == "INFEASIBLE":
            failure_reason = "Optimization Engine (OR-Tools) found no feasible mathematical solution."
            constraint_violations = ["Resource Capacity", "Task Dependencies"]
            await broadcast_phase(scenario_id, RuntimePhase.OPTIMIZING, "failed", failure_reason, duration_ms)
            
            operational_memory.record(
                disruption_type=event_type,
                mission_type=scenario_id,
                strategy_id=best_plan.id,
                strategy_name=best_plan.title,
                success=False,
                delay_minutes=0,
                latency_ms=duration_ms,
                failure_reason=failure_reason
            )
            
            if attempt < max_attempts:
                continue
            else:
                await broadcast_phase(scenario_id, RuntimePhase.COMPLETED, "failed", "Exhausted RIE retries. Manual intervention required.", duration_ms)
                return
        
        await broadcast_phase(scenario_id, RuntimePhase.OPTIMIZING, "completed", f"Assignments optimal. Delay: {optimized_plan.estimated_delay}m", duration_ms)
        
        # Create compatible dict for ExecutionRuntime
        plan_data = {
            "eventType": event_type,
            "affectedMissions": best_plan.affected_resources, 
            "confidence": best_plan.confidence,
            "actions": optimized_plan.assignments
        }
        
        scenario.currentPlan = CurrentPlan(
            eventType=event_type,
            affectedMissions=best_plan.affected_resources,
            confidence=best_plan.confidence,
            steps=[]
        )
        await state_manager.apply_recovery_actions(scenario_id, scenario)
        
        # Broadcast plan update so frontend shows Recovery Pipeline
        await runtime_broadcaster.publish(scenario_id, RuntimeEvent(
            id=str(uuid.uuid4()),
            type="runtime.plan.updated",
            timestamp=datetime.datetime.utcnow().isoformat(),
            payload={
                "eventType": event_type,
                "affectedMissions": best_plan.affected_resources,
                "confidence": best_plan.confidence,
                "steps": []
            }
        ))

        
        # Phase 6: VALIDATING
        start_time = time.perf_counter()
        await broadcast_phase(scenario_id, RuntimePhase.VALIDATING, "started", "Validating invariant constraints...")
        
        result = await execution_runtime.execute(scenario_id, plan_data)
        duration_ms = int((time.perf_counter() - start_time) * 1000)
        
        if result.valid and result.scenario:
            await broadcast_phase(scenario_id, RuntimePhase.VALIDATING, "completed", "All invariants passed.", duration_ms)
            
            # Phase 7: EXECUTING
            start_time = time.perf_counter()
            await broadcast_phase(scenario_id, RuntimePhase.EXECUTING, "started", "Applying state mutations...")
            
            # Write to operational memory
            operational_memory.record(
                disruption_type=event_type,
                mission_type=scenario_id,
                strategy_id=best_plan.id,
                strategy_name=best_plan.title,
                success=True,
                delay_minutes=optimized_plan.estimated_delay,
                latency_ms=duration_ms,
                failure_reason=None
            )
            
            # Post-execution State Updates
            await state_manager.resolve_divergence(scenario_id, divergence_id)
            
            memory = Memory(
                id=f"MEM-{uuid.uuid4().hex[:6].upper()}",
                type=event_type,
                strategy=best_plan.title,
                confidence=best_plan.confidence * 100, 
                outcome="success",
                date=datetime.datetime.utcnow().isoformat(),
                resolutionTime=3.14
            )
            await state_manager.add_memory(scenario_id, memory)
            
            # The execution runtime returned the mutated scenario
            await runtime_broadcaster.publish(scenario_id, RuntimeEvent(
                id=str(uuid.uuid4()),
                type="runtime.state.updated",
                timestamp=datetime.datetime.utcnow().isoformat(),
                payload=result.scenario.model_dump()
            ))
            
            duration_ms = int((time.perf_counter() - start_time) * 1000)
            await broadcast_phase(scenario_id, RuntimePhase.EXECUTING, "completed", "Recovery executed successfully.", duration_ms)
            break
            
        else:
            reasons = "; ".join(result.validation_errors or ["Unknown validation error"])
            failure_reason = "Invariant Engine rejected the plan."
            constraint_violations = result.validation_errors or ["Unknown Validation Error"]
            await broadcast_phase(scenario_id, RuntimePhase.VALIDATING, "failed", f"Validation rejected: {reasons}", duration_ms)
            
            operational_memory.record(
                disruption_type=event_type,
                mission_type=scenario_id,
                strategy_id=best_plan.id,
                strategy_name=best_plan.title,
                success=False,
                delay_minutes=optimized_plan.estimated_delay,
                latency_ms=duration_ms,
                failure_reason=f"{failure_reason} ({reasons})"
            )
            
            if attempt < max_attempts:
                continue
            else:
                await broadcast_phase(scenario_id, RuntimePhase.COMPLETED, "failed", "Exhausted RIE retries.", duration_ms)
                return
