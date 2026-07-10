import json
import os
import asyncio
from typing import Dict, Optional, List
from fastapi import HTTPException
from app.models.domain import Scenario, Resource, Mission, Task, Divergence, Memory, Status, MissionStatus, TaskStatus

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")

class RuntimeStateManager:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RuntimeStateManager, cls).__new__(cls)
            cls._instance.initialized = False
        return cls._instance

    def __init__(self):
        if self.initialized:
            return
        self.scenarios: Dict[str, Scenario] = {}
        self.locks: Dict[str, asyncio.Lock] = {}
        self.active_scenario_id: Optional[str] = None
        self.initialized = True

    def _get_lock(self, scenario_id: str) -> asyncio.Lock:
        if scenario_id not in self.locks:
            self.locks[scenario_id] = asyncio.Lock()
        return self.locks[scenario_id]

    async def get_scenario(self, scenario_id: str) -> Scenario:
        async with self._get_lock(scenario_id):
            if scenario_id not in self.scenarios:
                from app.adapters.registry import get as get_adapter
                adapter = get_adapter(scenario_id)
                if adapter:
                    self.scenarios[scenario_id] = adapter.load()
                else:
                    file_path = os.path.join(DATA_DIR, f"{scenario_id}.json")
                    if not os.path.exists(file_path):
                        raise HTTPException(status_code=404, detail=f"Scenario {scenario_id} not found in data dir")
                    with open(file_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        self.scenarios[scenario_id] = Scenario.model_validate(data)
            self.active_scenario_id = scenario_id
            return self.scenarios[scenario_id]

    async def apply_recovery_actions(self, scenario_id: str, new_state: Scenario):
        async with self._get_lock(scenario_id):
            self.scenarios[scenario_id] = new_state

    async def get_active_scenario(self) -> Optional[Scenario]:
        if not self.active_scenario_id:
            return None
        return await self.get_scenario(self.active_scenario_id)

    async def update_resource(self, scenario_id: str, resource_id: str, status: Optional[Status] = None, currentAssignment: Optional[str] = None) -> Optional[Resource]:
        async with self._get_lock(scenario_id):
            scenario = self.scenarios.get(scenario_id)
            if not scenario: return None
            
            for res in scenario.resources:
                if res.id == resource_id:
                    if status is not None:
                        res.status = status
                    if currentAssignment is not None:
                        res.currentAssignment = currentAssignment
                    return res
            return None

    async def update_task(self, scenario_id: str, task_id: str, status: Optional[TaskStatus] = None, assigned_resource_id: Optional[str] = None) -> Optional[Task]:
        async with self._get_lock(scenario_id):
            scenario = self.scenarios.get(scenario_id)
            if not scenario: return None
            
            for mission in scenario.missions:
                for task in mission.tasks:
                    if task.id == task_id:
                        if status is not None:
                            task.status = status
                        if assigned_resource_id is not None:
                            task.assignedResourceId = assigned_resource_id
                        return task
            return None

    async def update_mission(self, scenario_id: str, mission_id: str, status: Optional[MissionStatus] = None) -> Optional[Mission]:
        async with self._get_lock(scenario_id):
            scenario = self.scenarios.get(scenario_id)
            if not scenario: return None
            
            for mission in scenario.missions:
                if mission.id == mission_id:
                    if status is not None:
                        mission.status = status
                    return mission
            return None

    async def add_divergence(self, scenario_id: str, divergence: Divergence):
        async with self._get_lock(scenario_id):
            scenario = self.scenarios.get(scenario_id)
            if scenario:
                scenario.divergences.append(divergence)

    async def resolve_divergence(self, scenario_id: str, divergence_id: str):
        async with self._get_lock(scenario_id):
            scenario = self.scenarios.get(scenario_id)
            if scenario:
                scenario.divergences = [d for d in scenario.divergences if d.id != divergence_id]

    async def add_memory(self, scenario_id: str, memory: Memory):
        async with self._get_lock(scenario_id):
            scenario = self.scenarios.get(scenario_id)
            if scenario:
                scenario.memories.append(memory)

state_manager = RuntimeStateManager()
