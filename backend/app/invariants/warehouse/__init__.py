from typing import List
from app.invariants.base_rule import BaseRule
from app.invariants.warehouse.dock_available import DockAvailableRule
from app.invariants.warehouse.forklift_required import ForkliftRequiredRule

def get_warehouse_rules() -> List[BaseRule]:
    return [
        DockAvailableRule(),
        ForkliftRequiredRule()
    ]
