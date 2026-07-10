from typing import List
from app.models.domain import AdapterEvent, EventSeverity

def get_events() -> List[AdapterEvent]:
    return [
        AdapterEvent(
            id="evt_fuel_fail",
            type="FuelTruckFailure",
            severity=EventSeverity.critical,
            description="Fuel truck broke down on the tarmac."
        ),
        AdapterEvent(
            id="evt_heavy_rain",
            type="HeavyRain",
            severity=EventSeverity.warning,
            description="Heavy rain causing operational delays."
        ),
        AdapterEvent(
            id="evt_crew_unavail",
            type="CrewUnavailable",
            severity=EventSeverity.critical,
            description="Flight crew delayed or unavailable."
        ),
        AdapterEvent(
            id="evt_gate_blocked",
            type="GateBlocked",
            severity=EventSeverity.critical,
            description="Gate is occupied by an unserviceable aircraft."
        )
    ]
