from typing import List
from app.models.domain import AdapterEvent, EventSeverity

def get_events() -> List[AdapterEvent]:
    return [
        AdapterEvent(
            id="evt_forklift_fail",
            type="ForkliftFailure",
            severity=EventSeverity.critical,
            description="Autonomous forklift breakdown."
        ),
        AdapterEvent(
            id="evt_dock_blocked",
            type="DockBlocked",
            severity=EventSeverity.warning,
            description="Loading dock is blocked by unverified truck."
        ),
        AdapterEvent(
            id="evt_inventory_short",
            type="InventoryShortage",
            severity=EventSeverity.critical,
            description="Unexpected shortage in high-priority inventory."
        )
    ]
