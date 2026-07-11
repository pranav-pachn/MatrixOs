from fastapi import APIRouter, BackgroundTasks
from typing import List, Any

from gateway.schemas import (
    RuntimeSnapshot, InjectEventRequest, InjectEventResponse, ScenarioListResponse
)
from gateway.runtime_service import runtime_service
from app.models.domain import AdapterMetric

router = APIRouter(tags=["Runtime"])

@router.get("/scenarios", response_model=List[ScenarioListResponse])
async def get_scenarios():
    """List registered adapters/scenarios"""
    return await runtime_service.list_scenarios()

@router.get("/{runtime_id}", response_model=RuntimeSnapshot)
async def get_runtime_snapshot(runtime_id: str):
    """Get the complete Runtime Snapshot"""
    return await runtime_service.get_snapshot(runtime_id)

@router.get("/{runtime_id}/metrics", response_model=Any)
async def get_runtime_metrics(runtime_id: str):
    """Get just the runtime metrics"""
    return await runtime_service.get_metrics(runtime_id)

@router.post("/{runtime_id}/events", response_model=InjectEventResponse, status_code=202)
async def inject_runtime_event(runtime_id: str, request: InjectEventRequest, background_tasks: BackgroundTasks):
    """Inject an event into the runtime"""
    return await runtime_service.inject_event(runtime_id, request.event, background_tasks)
