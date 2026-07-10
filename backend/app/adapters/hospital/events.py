from typing import List
from app.models.domain import AdapterEvent, EventSeverity

def get_events() -> List[AdapterEvent]:
    return [
        AdapterEvent(
            id="evt_emerg_patient",
            type="EmergencyPatient",
            severity=EventSeverity.critical,
            description="Mass casualty or emergency patient incoming."
        ),
        AdapterEvent(
            id="evt_doc_unavail",
            type="DoctorUnavailable",
            severity=EventSeverity.critical,
            description="Surgeon or doctor is unavailable."
        ),
        AdapterEvent(
            id="evt_mri_fail",
            type="MRIFailure",
            severity=EventSeverity.warning,
            description="MRI machine requires emergency maintenance."
        )
    ]
