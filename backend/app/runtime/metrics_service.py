from app.models.domain import Scenario, RuntimeMetrics, Status, TaskState

def compute_metrics(scenario: Scenario) -> RuntimeMetrics:
    total_resources = len(scenario.resources)
    if total_resources == 0:
        utilization = 0.0
    else:
        # Utilization: occupied or unavailable / total
        used = sum(1 for r in scenario.resources if r.status in [Status.occupied, Status.unavailable])
        utilization = (used / total_resources) * 100
        
    active_tasks = 0
    completed_tasks = 0
    failed_tasks = 0
    
    for mission in scenario.missions:
        for task in mission.tasks:
            if task.status == TaskState.RUNNING:
                active_tasks += 1
            elif task.status == TaskState.COMPLETED:
                completed_tasks += 1
            elif task.status == TaskState.FAILED:
                failed_tasks += 1
                
    # Delay logic (mock based on divergences)
    delay = len(scenario.divergences) * 15
    
    # Throughput (mock based on completed)
    throughput = completed_tasks * 2
    
    return RuntimeMetrics(
        active_tasks=active_tasks,
        completed_tasks=completed_tasks,
        failed_tasks=failed_tasks,
        utilization=round(utilization, 1),
        delay=delay,
        throughput=throughput
    )
