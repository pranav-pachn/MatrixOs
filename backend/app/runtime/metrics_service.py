from app.models.domain import Scenario, SystemMetrics, Status

def compute_metrics(scenario: Scenario) -> SystemMetrics:
    total_resources = len(scenario.resources)
    if total_resources == 0:
        utilization = 0.0
        health = 100.0
    else:
        # Utilization: occupied or unavailable / total
        used = sum(1 for r in scenario.resources if r.status in [Status.occupied, Status.unavailable])
        utilization = (used / total_resources) * 100
        
        # Health: 100 - penalty for failed resources
        failed = sum(1 for r in scenario.resources if r.status == Status.failed)
        health = max(0.0, 100.0 - (failed / total_resources * 50))
    
    active_constraints = len(scenario.missions) * 3
    divergence_rate = len(scenario.divergences) * 2.0  # mock value
    
    return SystemMetrics(
        systemHealth=round(health, 1),
        activeConstraints=active_constraints,
        divergenceRate=divergence_rate,
        recoveryLatency=450.0, # Default mock latency
        resourceUtilization=round(utilization, 1)
    )
