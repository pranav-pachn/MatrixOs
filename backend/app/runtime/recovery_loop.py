import datetime
import uuid
import time
from typing import List
import asyncio

from app.models.events import (
    RuntimePhaseEvent, RuntimePhase, RecoveryPlanEvent,
    WorldStateUpdateEvent, DivergenceResolvedEvent
)
from app.models.domain import Recovery, Memory
from app.websocket.manager import manager
from app.agents.recovery import recovery_agent
from app.runtime.state_manager import state_manager
from app.runtime.execution_engine import execution_runtime

async def broadcast_phase(scenario_id: str, phase: RuntimePhase, status: str, message: str, duration: int = None):
    event = RuntimePhaseEvent(
        timestamp=datetime.datetime.utcnow().isoformat(),
        event=f"runtime.phase.{status}",
        phase=phase,
        message=message,
        duration=duration
    )
    await manager.broadcast_model(scenario_id, event)

async def run_recovery_loop(scenario_id: str, event_type: str, divergence_id: str):
    scenario = await state_manager.get_scenario(scenario_id)
    if not scenario: return
    
    # Phase 1: OBSERVING (Starts as soon as event is injected, we log completion here)
    await broadcast_phase(scenario_id, RuntimePhase.OBSERVING, "completed", f"Detected {event_type} event", duration=0)
    
    # Phase 2: ASSESSING
    start_time = time.perf_counter()
    await broadcast_phase(scenario_id, RuntimePhase.ASSESSING, "started", "AI Agent analyzing impact...")
    
    impact = await recovery_agent.assess_impact(event_type, scenario)
    
    duration_ms = int((time.perf_counter() - start_time) * 1000)
    await broadcast_phase(scenario_id, RuntimePhase.ASSESSING, "completed", f"Impact: {impact}", duration_ms)

    max_retries = 3
    for attempt in range(max_retries):
        # Phase 3: PLANNING
        start_time = time.perf_counter()
        await broadcast_phase(scenario_id, RuntimePhase.PLANNING, "started", f"Generating candidate recovery plans (Attempt {attempt+1}/{max_retries})...")
        
        from app.planner.planner_service import planner_service
        planner_response = await planner_service.plan(scenario_id, event_type)
        
        duration_ms = int((time.perf_counter() - start_time) * 1000)
        await broadcast_phase(scenario_id, RuntimePhase.PLANNING, "completed", f"Generated {len(planner_response.plans)} candidate strategies.", duration_ms)

        # Phase 4: POLICY
        start_time = time.perf_counter()
        await broadcast_phase(scenario_id, RuntimePhase.POLICY, "started", "Evaluating strategies against domain objectives...")
        
        from app.policy.engine import policy_engine
        from app.adapters.registry import get as get_adapter
        
        adapter = get_adapter(scenario_id)
        objectives = adapter.objectives() if hasattr(adapter, "objectives") else []
        constraints = adapter.constraints() if hasattr(adapter, "constraints") else []
        timeout = adapter.config.solver_timeout_seconds if hasattr(adapter, "config") else 5
        
        best_plan = policy_engine.choose(planner_response.plans, objectives)
        
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
            await broadcast_phase(scenario_id, RuntimePhase.OPTIMIZING, "failed", f"OR-Tools found no feasible solution.", duration_ms)
            if attempt < max_retries - 1:
                continue # Re-invoke planner
            else:
                await broadcast_phase(scenario_id, RuntimePhase.COMPLETED, "failed", "Exhausted planning retries. Manual intervention required.", duration_ms)
                return
        
        await broadcast_phase(scenario_id, RuntimePhase.OPTIMIZING, "completed", f"Assignments optimal. Delay: {optimized_plan.estimated_delay}m", duration_ms)
        
        # Create compatible dict for ExecutionRuntime
        plan_data = {
            "eventType": event_type,
            "affectedMissions": best_plan.affected_resources, 
            "confidence": best_plan.confidence,
            "actions": optimized_plan.assignments
        }
        
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
            
            # Post-execution State Updates
            await state_manager.resolve_divergence(scenario_id, divergence_id)
            
            memory = Memory(
                id=f"MEM-{uuid.uuid4().hex[:6].upper()}",
                type=event_type,
                strategy="AI Adaptive Recovery",
                confidence=best_plan.confidence * 100, 
                outcome="success",
                date=datetime.datetime.utcnow().isoformat(),
                resolutionTime=3.14
            )
            await state_manager.add_memory(scenario_id, memory)
            
            recovery_obj = Recovery(
                eventType=event_type,
                affectedMissions=best_plan.affected_resources,
                confidence=best_plan.confidence,
                steps=[]
            )
            
            # Broadcast Updates
            await manager.broadcast_model(scenario_id, RecoveryPlanEvent(
                timestamp=datetime.datetime.utcnow().isoformat(),
                data=recovery_obj
            ))
            
            await manager.broadcast_model(scenario_id, DivergenceResolvedEvent(
                timestamp=datetime.datetime.utcnow().isoformat(),
                divergenceId=divergence_id
            ))
            
            await manager.broadcast_model(scenario_id, WorldStateUpdateEvent(
                timestamp=datetime.datetime.utcnow().isoformat(),
                missions=result.scenario.missions,
                resources=result.scenario.resources,
                edges=result.scenario.edges,
                divergences=result.scenario.divergences
            ))
            
            duration_ms = int((time.perf_counter() - start_time) * 1000)
            await broadcast_phase(scenario_id, RuntimePhase.EXECUTING, "completed", "Recovery executed successfully.", duration_ms)
            break # Success, exit retry loop
            
        else:
            reasons = "; ".join(result.validation_errors or ["Unknown validation error"])
            await broadcast_phase(scenario_id, RuntimePhase.VALIDATING, "failed", f"Validation rejected: {reasons}", duration_ms)
            if attempt < max_retries - 1:
                continue
            else:
                return
