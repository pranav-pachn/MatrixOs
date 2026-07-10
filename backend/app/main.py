import datetime
import uuid
from typing import List
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.models.events import AdapterModel, InjectEventRequest, InjectEventResponse, NewDivergenceEvent, Divergence
from app.models.domain import Scenario, SystemMetrics
from app.runtime.state_manager import state_manager
from app.websocket.manager import manager
from app.events.bus import event_bus

app = FastAPI(title="MatrixOS Backend - Foundation")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/api/scenarios/{scenario_id}/metrics", response_model=SystemMetrics)
async def get_metrics(scenario_id: str):
    if scenario_id not in ALLOWED_SCENARIOS:
        raise HTTPException(status_code=400, detail="Invalid scenario ID")
    # For Phase 0, we can just return a dummy SystemMetrics 
    return SystemMetrics(
        systemHealth=100.0,
        activeConstraints=0,
        divergenceRate=0.0,
        recoveryLatency=0.0,
        resourceUtilization=50.0
    )

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
async def inject_event(request: InjectEventRequest):
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
    
    # Phase 0: No AI yet. We do not call recovery_loop.py.

    return InjectEventResponse(
        status="accepted",
        eventId=event_id,
        divergenceId=divergence_id,
        recoveryJobId=f"job_{uuid.uuid4().hex[:8]}"
    )
