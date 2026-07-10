from typing import Dict, Optional
from app.adapters.base import BaseAdapter

_registry: Dict[str, BaseAdapter] = {}

def register(scenario_id: str, adapter: BaseAdapter):
    """Register a domain adapter for a specific scenario ID."""
    _registry[scenario_id] = adapter

def get(scenario_id: str) -> Optional[BaseAdapter]:
    """Retrieve the domain adapter for the given scenario ID."""
    return _registry.get(scenario_id)
