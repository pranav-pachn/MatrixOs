from typing import List
from app.planner.schemas import CandidatePlan

class PolicyEngine:
    def __init__(self):
        # Weights could eventually come from the adapter objectives or configuration
        self.priority_weight = 10
        self.delay_penalty = 0.35
        self.resource_penalty = 0.30
        self.confidence_bonus = 15

    def choose(self, plans: List[CandidatePlan], objectives: List[str]) -> CandidatePlan:
        if not plans:
            raise ValueError("No candidate plans provided to Policy Engine")

        best_plan = None
        best_score = float('-inf')

        for plan in plans:
            score = self.score_plan(plan, objectives)
            
            # Print for debug/transparency
            print(f"[PolicyEngine] Plan '{plan.title}' scored {score:.2f}")
            
            if score > best_score:
                best_score = score
                best_plan = plan

        return best_plan

    def score_plan(self, plan: CandidatePlan, objectives: List[str]) -> float:
        # A simple deterministic scoring function
        
        # 1. Base score from confidence
        score = plan.confidence * self.confidence_bonus
        
        # 2. Penalize for estimated delay
        score -= plan.estimated_delay * self.delay_penalty
        
        # 3. Penalize for number of resources affected
        resource_cost = len(plan.affected_resources) * self.resource_penalty
        score -= resource_cost
        
        # In a more advanced engine, we would parse `objectives` to dynamically
        # adjust these weights (e.g. if "Minimize Delay" is top objective, delay_penalty increases).
        
        return score

policy_engine = PolicyEngine()
