import datetime
import uuid
from typing import List
import asyncio

from app.models.domain import (
    RecoveryAction, AgentActionEvent, RecoveryPlanEvent, Recovery,
    WorldStateUpdateEvent, DivergenceResolvedEvent, Memory, ValidationStatus
)
from app.websocket.manager import manager
from api.agents.recovery import recovery_agent, invariant_engine
from app.runtime.state_manager import state_manager
from runtime.execution_engine import execution_engine

async def run_recovery_loop(scenario_id: str, event_type: str, divergence_id: str):
    scenario = await state_manager.get_scenario(scenario_id)
    if not scenario: return
    
    # Step 1: Impact Assessment
    impact = await recovery_agent.assess_impact(event_type, scenario)
    await manager.broadcast_model(scenario_id, AgentActionEvent(
        timestamp=datetime.datetime.utcnow().isoformat(),
        type="impact_assessment",
        message=f"AI Agent assessment: {impact}"
    ))

    # Step 2: Planning
    await manager.broadcast_model(scenario_id, AgentActionEvent(
        timestamp=datetime.datetime.utcnow().isoformat(),
        type="planning",
        message="AI Agent calculating alternative recovery vectors..."
    ))
    plan_data = await recovery_agent.generate_plan(event_type, scenario)
    
    actions = [RecoveryAction(**a) for a in plan_data.get("actions", [])]
    recovery_obj = Recovery(**plan_data)

    # Step 3: Invariant Validation
    await manager.broadcast_model(scenario_id, AgentActionEvent(
        timestamp=datetime.datetime.utcnow().isoformat(),
        type="validation",
        message="Invariant Engine validating proposed plan..."
    ))
    
    validation_results = await invariant_engine.validate(scenario_id, scenario, actions)
    is_valid = not any(r.status == ValidationStatus.REJECTED for r in validation_results)
    
    if is_valid:
        await manager.broadcast_model(scenario_id, AgentActionEvent(
            timestamp=datetime.datetime.utcnow().isoformat(),
            type="validation_success",
            message="Plan passed invariants. Executing recovery..."
        ))
        
        # Step 4: Execution
        await execution_engine.execute(scenario_id, actions)
        
        # Step 5: Post-execution State Updates
        await state_manager.resolve_divergence(scenario_id, divergence_id)
        
        memory = Memory(
            id=f"MEM-{uuid.uuid4().hex[:6].upper()}",
            type=event_type,
            strategy="AI Adaptive Recovery",
            confidence=recovery_obj.confidence * 100, 
            outcome="success",
            date=datetime.datetime.utcnow().isoformat(),
            resolutionTime=3.14
        )
        await state_manager.add_memory(scenario_id, memory)
        
        updated_scenario = await state_manager.get_scenario(scenario_id)
        
        # Step 6: Broadcast Updates
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
            missions=updated_scenario.missions,
            resources=updated_scenario.resources,
            edges=updated_scenario.edges,
            divergences=updated_scenario.divergences
        ))
        
    else:
        reasons = "; ".join([r.reason for r in validation_results if r.status == ValidationStatus.REJECTED and r.reason])
        await manager.broadcast_model(scenario_id, AgentActionEvent(
            timestamp=datetime.datetime.utcnow().isoformat(),
            type="validation_failure",
            message=f"Plan rejected by Invariant Engine. Reasons: {reasons}"
        ))
