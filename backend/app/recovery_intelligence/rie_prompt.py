import json
from app.recovery_intelligence.schemas import RecoveryRequest

class RIEPromptBuilder:
    @staticmethod
    def build_system_prompt() -> str:
        return """You are the MatrixOS Recovery Intelligence Engine.
Your job is to recover from a FAILED recovery attempt.
The normal Planner generated a strategy, but the Optimization Engine or Invariant Validator rejected it.
You must use Operational Memory (past recoveries and playbooks) to synthesize an ALTERNATIVE strategy.
Do NOT repeat the failed strategy.

Output ONLY valid JSON matching this schema:
{
    "strategies": [
        {
            "title": "Short title",
            "description": "Explanation",
            "strategy": "Actionable summary",
            "estimated_delay": 15,
            "confidence": 0.85,
            "reasoning": "Why this avoids the previous failure",
            "recovery_intent": {
                "strategy_type": "string",
                "resource_type_needed": "string",
                "target_mission_id": "string",
                "max_delay_minutes": 15,
                "priority": "High"
            }
        }
    ]
}

"""

    @staticmethod
    def build_user_message(request: RecoveryRequest, memory_data: dict) -> str:
        state_summary = {
            "missions": [m.model_dump() for m in request.world_state.missions],
            "resources": [r.model_dump() for r in request.world_state.resources],
            "divergences": [d.model_dump() for d in request.world_state.divergences]
        }
        
        episodic = memory_data.get("episodic", [])
        procedural = memory_data.get("procedural", [])
        
        memory_text = ""
        if episodic:
            memory_text += "Past Successful Recoveries:\n"
            for i, m in enumerate(episodic):
                if m.outcome == "success":
                    memory_text += f"{i+1}. {m.strategy} (Confidence: {m.confidence}, Delay: {m.delay}m)\n"
        
        if procedural:
            memory_text += "\nKnown Repair Playbooks for this Event:\n"
            for i, p in enumerate(procedural):
                memory_text += f"- {p}\n"
                
        if not memory_text:
            memory_text = "No operational memory available for this event."

        violations = "\n".join([f"- {v}" for v in request.constraint_violations])

        prompt = f"""
Event: {request.event_type}

The following recovery strategy FAILED:
"{request.failed_strategy}"

Failure Reason: 
{request.failure_reason}

Violated Constraints: 
{violations}

Operational Memory:
{memory_text}

Current World State:
{json.dumps(state_summary, indent=2)}

Generate THREE alternative recovery strategies that avoid the failed approach and adhere to the constraints.
Return ONLY valid JSON.
"""
        return prompt.strip()
