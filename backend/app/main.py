import datetime
import uuid
from typing import List
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from app.models.events import AdapterModel, InjectEventRequest, InjectEventResponse, NewDivergenceEvent, Divergence
from app.models.domain import Scenario, SystemMetrics, AdapterMetric, ConstraintRule, AdapterEvent, RuntimeMetrics
from app.runtime.state_manager import state_manager
from app.websocket.manager import manager
from app.events.bus import event_bus
from app.adapters.loader import load_all_adapters
from app.adapters.registry import get as get_adapter
from typing import Dict, Any
from app.runtime.recovery_loop import run_recovery_loop
from app.runtime.metrics_service import compute_metrics

app = FastAPI(title="MatrixOS Backend - Foundation")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    import sys
    import os
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
    try:
        from data.seed import seed_db
        seed_db()
    except Exception as e:
        print(f"Failed to seed DB: {e}")
    load_all_adapters()

ALLOWED_SCENARIOS = ["airport", "hospital-er", "warehouse-hub"]

@app.get("/api/scenarios", response_model=List[AdapterModel])
async def get_scenarios():
    return [
        {
            "id": "airport",
            "name": "Airport Hub",
            "description": "Aircraft turnaround and ground operations",
            "status": "live",
            "href": "/playground/airport"
        },
        {
            "id": "hospital-er",
            "name": "Emergency Room",
            "description": "Patient triage and resource allocation",
            "status": "coming-soon",
            "href": "/playground/hospital-er"
        },
        {
            "id": "warehouse-hub",
            "name": "Fulfillment Hub",
            "description": "Inventory routing and robotic fleets",
            "status": "coming-soon",
            "href": "/playground/warehouse-hub"
        }
    ]

@app.get("/api/scenarios/{scenario_id}/state", response_model=Scenario)
async def get_world_state(scenario_id: str):
    if scenario_id not in ALLOWED_SCENARIOS:
        raise HTTPException(status_code=400, detail="Invalid scenario ID")
    return await state_manager.get_scenario(scenario_id)

@app.get("/api/scenarios/{scenario_id}/metrics", response_model=List[AdapterMetric])
async def get_metrics(scenario_id: str):
    if scenario_id not in ALLOWED_SCENARIOS:
        raise HTTPException(status_code=400, detail="Invalid scenario ID")
    adapter = get_adapter(scenario_id)
    if not adapter:
        raise HTTPException(status_code=404, detail="Adapter not found")
    return adapter.metrics()

@app.get("/api/scenarios/{scenario_id}/invariants")
async def get_invariants(scenario_id: str):
    """Returns a dry-run of all invariants against the current world state."""
    from app.invariants.engine import InvariantEngine
    
    if scenario_id not in ALLOWED_SCENARIOS:
        raise HTTPException(status_code=400, detail="Invalid scenario ID")
        
    adapter = get_adapter(scenario_id)
    if not adapter:
        raise HTTPException(status_code=404, detail="Scenario adapter not found")
        
    state = await state_manager.get_scenario(scenario_id)
    if not state:
        raise HTTPException(status_code=404, detail="Scenario state not found")
        
    engine = InvariantEngine(adapter.get_rules())
    report = engine.validate(state, []) # empty actions = pure state check
    return report

@app.get("/api/scenarios/{scenario_id}/runtime-metrics", response_model=RuntimeMetrics)
async def get_runtime_metrics(scenario_id: str):
    if scenario_id not in ALLOWED_SCENARIOS:
        raise HTTPException(status_code=400, detail="Invalid scenario ID")
    current_state = await state_manager.get_scenario(scenario_id)
    return compute_metrics(current_state)

@app.get("/api/scenarios/{scenario_id}/constraints", response_model=List[ConstraintRule])
async def get_constraints(scenario_id: str):
    adapter = get_adapter(scenario_id)
    if not adapter:
        raise HTTPException(status_code=404, detail="Adapter not found")
    return adapter.constraints()

@app.get("/api/scenarios/{scenario_id}/events", response_model=List[AdapterEvent])
async def get_events(scenario_id: str):
    adapter = get_adapter(scenario_id)
    if not adapter:
        raise HTTPException(status_code=404, detail="Adapter not found")
    return adapter.events()

@app.post("/api/scenarios/{scenario_id}/execute", response_model=Scenario)
async def execute_plan(scenario_id: str, plan: Dict[str, Any]):
    adapter = get_adapter(scenario_id)
    if not adapter:
        raise HTTPException(status_code=404, detail="Adapter not found")
    current_state = await state_manager.get_scenario(scenario_id)
    new_state = adapter.execute(plan, current_state)
    await state_manager.apply_recovery_actions(scenario_id, new_state)
    return new_state

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.websocket("/ws/runtime/{scenario_id}")
async def websocket_endpoint(websocket: WebSocket, scenario_id: str):
    if scenario_id not in ALLOWED_SCENARIOS:
        await websocket.close(code=1008)
        return
    await manager.connect(websocket, scenario_id)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, scenario_id)

@app.post("/api/events/inject", response_model=InjectEventResponse)
async def inject_event(request: InjectEventRequest, background_tasks: BackgroundTasks):
    if request.scenarioId not in ALLOWED_SCENARIOS:
        raise HTTPException(status_code=400, detail="Invalid scenario ID")
        
    event_id = f"evt_{uuid.uuid4().hex[:8]}"
    divergence_id = f"div_{uuid.uuid4().hex[:8]}"
    
    divergence = Divergence(
        id=divergence_id,
        eventId=event_id,
        expectedState="Normal operations",
        actualState=f"Divergence detected: {request.type}",
        severity="critical",
        detectedAt=datetime.datetime.utcnow().isoformat()
    )
    
    # Add to state manager
    await state_manager.add_divergence(request.scenarioId, divergence)
    
    # Broadcast via EventBus
    event = NewDivergenceEvent(
        timestamp=datetime.datetime.utcnow().isoformat(),
        eventId=event_id,
        type=request.type,
        message=f"Divergence triggered: {request.type}",
        severity="critical",
        divergence=divergence
    )
    await event_bus.broadcast(event)
    
    # Trigger the AI Recovery Loop in the background
    background_tasks.add_task(run_recovery_loop, request.scenarioId, request.type, divergence_id)

    return InjectEventResponse(
        status="accepted",
        eventId=event_id,
        divergenceId=divergence_id,
        recoveryJobId=f"job_{uuid.uuid4().hex[:8]}"
    )

class PlanRequest(BaseModel):
    event_type: str

@app.post("/api/scenarios/{scenario_id}/plan")
async def generate_plan(scenario_id: str, request: PlanRequest):
    if scenario_id not in ALLOWED_SCENARIOS:
        raise HTTPException(status_code=400, detail="Invalid scenario ID")
    
    from app.planner.planner_service import planner_service
    try:
        response = await planner_service.plan(scenario_id, request.event_type)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class OptimizeRequest(BaseModel):
    event_type: str
    plan_id: str

@app.post("/api/scenarios/{scenario_id}/optimize")
async def optimize_plan(scenario_id: str, request: OptimizeRequest):
    if scenario_id not in ALLOWED_SCENARIOS:
        raise HTTPException(status_code=400, detail="Invalid scenario ID")
    
    # Normally this would fetch the specific plan from a cache.
    # For now, we return a 501 Not Implemented or we can run the pipeline here if we wanted.
    # We will just expose the endpoint stub as requested in the plan for inspection.
    raise HTTPException(status_code=501, detail="Standalone optimization inspection coming soon. Currently runs in recovery loop.")
