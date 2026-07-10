from typing import List, Dict

def parse_objectives(objectives: List[str]) -> Dict[str, float]:
    """
    Parses natural-language objectives from the domain adapter into 
    numerical weights for the CP-SAT optimizer's objective function.
    """
    weights = {
        "delay": 1.0,
        "resource_changes": 0.5,
        "idle_time": 0.1
    }
    
    # Simple heuristic parser
    for obj in objectives:
        obj_lower = obj.lower()
        if "delay" in obj_lower:
            weights["delay"] += 0.5
        if "utilization" in obj_lower or "idle" in obj_lower:
            weights["idle_time"] += 0.4
        if "reassignment" in obj_lower or "changes" in obj_lower:
            weights["resource_changes"] += 0.5
            
    return weights
