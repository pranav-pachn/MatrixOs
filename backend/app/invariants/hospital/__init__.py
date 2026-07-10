from typing import List
from app.invariants.base_rule import BaseRule
from app.invariants.hospital.doctor_available import DoctorAvailableRule
from app.invariants.hospital.bed_unique import BedUniqueRule

def get_hospital_rules() -> List[BaseRule]:
    return [
        DoctorAvailableRule(),
        BedUniqueRule()
    ]
