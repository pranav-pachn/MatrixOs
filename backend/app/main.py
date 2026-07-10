import datetime
import uuid
from typing import List, Dict, Any
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from app.models.events import AdapterModel, InjectEventRequest, InjectEventResponse, RuntimeEvent
from app.models.domain import Scenario, SystemMetrics, AdapterMetric, ConstraintRule, AdapterEvent, RuntimeMetrics, Divergence
from app.runtime.state_manager import state_manager
from app.websocket.manager import manager
from app.websocket.broadcaster import runtime_broadcaster
from app.adapters.loader import load_all_adapters
from app.adapters.registry import get as get_adapter
from app.runtime.recovery_loop import run_recovery_loop
from app.runtime.metrics_service import compute_metrics
from memory.schemas import MemoryStats, RecoveryRecord
from memory.memory_service import operational_memory

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

# ==========================================
# GATEWAY ROUTER (NEW ARCHITECTURE)
# ==========================================
from gateway.routers.runtime import router as runtime_router
app.include_router(runtime_router, prefix="/api/v1/runtime")


@app.get("/api/memory/{disruption_type}/stats", response_model=MemoryStats)
async def get_memory_stats(disruption_type: str):
    return operational_memory.statistics(disruption_type)

@app.get("/api/memory/recent", response_model=List[RecoveryRecord])
async def get_recent_memory():
    return operational_memory.recent(limit=10)

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


