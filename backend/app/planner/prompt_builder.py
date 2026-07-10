import os
import json
from app.planner.schemas import PlannerRequest

class PromptBuilder:
    @staticmethod
    def build_system_prompt() -> str:
        prompt_path = os.path.join(os.path.dirname(__file__), 'prompts', 'planner_system.txt')
        with open(prompt_path, 'r') as f:
            return f.read()

    @staticmethod
    def build_user_message(request: PlannerRequest) -> str:
        # Simplify the world state for the LLM
        state_summary = {
            "missions": [m.model_dump() for m in request.world_state.missions],
            "resources": [r.model_dump() for r in request.world_state.resources],
            "divergences": [d.model_dump() for d in request.world_state.divergences]
        }
        
        constraints_text = "\n".join([f"- {c.description}" for c in request.constraints if c.is_active])
        objectives_text = "\n".join([f"{i+1}. {obj}" for i, obj in enumerate(request.objectives)])
        
        memory_text = "None"
        if request.operational_memory:
            memories = []
            for m in request.operational_memory:
                memories.append(f"Event: {m.type} | Strategy: {m.strategy} | Outcome: {m.outcome} | Confidence: {m.confidence}%")
            memory_text = "\n".join(memories)

        prompt = f"""
Current Event:
{request.current_event}

Objectives (In Priority Order):
{objectives_text}

Active Constraints:
{constraints_text}

Operational Memory (Past Recoveries):
{memory_text}

Current World State (JSON):
{json.dumps(state_summary, indent=2)}

Generate exactly THREE candidate recovery plans according to the system rules.
"""
        return prompt.strip()
