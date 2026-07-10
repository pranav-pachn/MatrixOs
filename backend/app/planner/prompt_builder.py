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
        stats = request.memory_stats
        
        if stats.total_occurrences > 0:
            memory_text = f"Operational Memory for {request.current_event}:\n"
            memory_text += f"- Occurrences: {stats.total_occurrences}\n"
            memory_text += f"- Best Strategy: {stats.best_strategy}\n"
            memory_text += f"- Success Rate: {stats.success_rate * 100:.1f}%\n"
            
            successes = [m for m in request.operational_memory if m.success]
            failures = [m for m in request.operational_memory if not m.success]
            
            if successes:
                memory_text += "\nRecent Successes:\n"
                for m in successes:
                    memory_text += f"- {m.strategy_name} (Delay: {m.delay_minutes}m)\n"
                    
            if failures:
                memory_text += "\nRecent Failures:\n"
                for m in failures:
                    reason = m.failure_reason or "Unknown"
                    memory_text += f"- {m.strategy_name} | Reason: {reason}\n"

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
