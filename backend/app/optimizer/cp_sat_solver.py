from typing import List, Dict, Tuple
from ortools.sat.python import cp_model
from app.optimizer.models import OptimizationRequest, OptimizedPlan, TaskWindow
from app.optimizer.objectives import parse_objectives

class CpSatSolver:
    def solve(self, request: OptimizationRequest) -> OptimizedPlan:
        model = cp_model.CpModel()
        
        # 1. Identify relevant tasks and resources
        # Find the target mission's tasks that need assignment
        target_mission = next((m for m in request.world_state.missions if m.id == request.recovery_intent.target_mission_id), None)
        if not target_mission:
            return OptimizedPlan(solver_status="INFEASIBLE", assignments=[], schedule=[], estimated_delay=0, resource_utilization=0, cost=0)
            
        # For simplicity, we just target all tasks in the mission that don't have an assigned resource
        # or that might need the required resource_type_needed. 
        tasks_to_schedule = [t for t in target_mission.tasks if t.status not in ["COMPLETED"]]
        
        # Available resources of the correct type
        available_resources = [
            r for r in request.world_state.resources 
            if r.status == 'available' # Note: We could be smarter about type checking here
        ]
        
        if not available_resources:
            return OptimizedPlan(solver_status="INFEASIBLE", assignments=[], schedule=[], estimated_delay=0, resource_utilization=0, cost=0)
            
        HORIZON = request.recovery_intent.max_delay_minutes + 120 # time horizon in minutes
        
        # 2. Decision Variables
        # assignments[(t.id, r.id)] = 1 if task t is assigned to resource r
        assignments = {}
        # start[t.id] = start time of task t
        start_vars = {}
        # end[t.id] = end time of task t
        end_vars = {}
        # intervals[(t.id, r.id)] = interval variable for task t on resource r
        intervals = {}
        
        for t in tasks_to_schedule:
            start_vars[t.id] = model.NewIntVar(0, HORIZON, f'start_{t.id}')
            end_vars[t.id] = model.NewIntVar(0, HORIZON, f'end_{t.id}')
            
            # Duration constraint
            model.Add(end_vars[t.id] == start_vars[t.id] + t.duration)
            
            for r in available_resources:
                assn_var = model.NewBoolVar(f'assign_{t.id}_{r.id}')
                assignments[(t.id, r.id)] = assn_var
                
                # Optional interval: only active if assn_var is true
                interval_var = model.NewOptionalIntervalVar(
                    start_vars[t.id], t.duration, end_vars[t.id], assn_var, f'interval_{t.id}_{r.id}'
                )
                intervals[(t.id, r.id)] = interval_var
                
        # 3. Constraints
        # Every task must be assigned to EXACTLY ONE resource
        for t in tasks_to_schedule:
            model.AddExactlyOne([assignments[(t.id, r.id)] for r in available_resources])
            
        # No overlap on resources: A resource can only do one task at a time
        for r in available_resources:
            resource_intervals = [intervals[(t.id, r.id)] for t in tasks_to_schedule]
            if resource_intervals:
                model.AddNoOverlap(resource_intervals)
                
        # Dependencies (Start after predecessors)
        for t in tasks_to_schedule:
            for dep_id in t.dependencies:
                if dep_id in end_vars:
                    model.Add(start_vars[t.id] >= end_vars[dep_id])
                    
        # 4. Objective: Minimize maximum end time (Makespan / Delay)
        makespan = model.NewIntVar(0, HORIZON, 'makespan')
        model.AddMaxEquality(makespan, [end_vars[t.id] for t in tasks_to_schedule])
        
        # Parse weights
        weights = parse_objectives(request.objectives)
        
        # We can add penalties for resource changes if we had previous assignments, but keeping it simple for Phase 5.
        model.Minimize(makespan * int(weights["delay"] * 10))
        
        # 5. Solve
        solver = cp_model.CpSolver()
        solver.parameters.max_time_in_seconds = request.timeout_seconds
        status = solver.Solve(model)
        
        # 6. Extract Solution
        if status in [cp_model.OPTIMAL, cp_model.FEASIBLE]:
            status_str = "OPTIMAL" if status == cp_model.OPTIMAL else "FEASIBLE"
            
            final_assignments = []
            final_schedule = []
            for t in tasks_to_schedule:
                for r in available_resources:
                    if solver.Value(assignments[(t.id, r.id)]):
                        final_assignments.append({
                            "action_type": "reassign_resource",
                            "target_task_id": t.id,
                            "target_resource_id": r.id,
                            "target_mission_id": target_mission.id
                        })
                        
                        final_schedule.append(TaskWindow(
                            task_id=t.id,
                            resource_id=r.id,
                            start=solver.Value(start_vars[t.id]),
                            end=solver.Value(end_vars[t.id])
                        ))
            
            delay = solver.Value(makespan)
            cost = solver.ObjectiveValue()
            
            return OptimizedPlan(
                solver_status=status_str,
                assignments=final_assignments,
                schedule=final_schedule,
                estimated_delay=delay,
                resource_utilization=0.85, # Mock value for now
                cost=cost
            )
            
        else:
            return OptimizedPlan(
                solver_status="INFEASIBLE",
                assignments=[],
                schedule=[],
                estimated_delay=0,
                resource_utilization=0,
                cost=0
            )
