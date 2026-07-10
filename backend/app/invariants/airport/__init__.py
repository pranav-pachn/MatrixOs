from typing import List
from app.invariants.base_rule import BaseRule
from app.invariants.airport.fueling_before_pushback import FuelingBeforePushbackRule
from app.invariants.airport.boarding_fueling_overlap import BoardingFuelingOverlapRule
from app.invariants.airport.resource_available import ResourceAvailableRule
from app.invariants.airport.resource_not_double_assigned import ResourceNotDoubleAssignedRule

def get_airport_rules() -> List[BaseRule]:
    return [
        FuelingBeforePushbackRule(),
        BoardingFuelingOverlapRule(),
        ResourceAvailableRule(),
        ResourceNotDoubleAssignedRule()
    ]
