from abc import ABC, abstractmethod
from app.planner.schemas import PlannerRequest, PlannerResponse
from app.planner.prompt_builder import PromptBuilder
from app.planner.parser import PlannerParser, PlannerParseError
from app.agents.gateway import gateway

class PlannerLLM(ABC):
    @abstractmethod
    async def generate(self, request: PlannerRequest) -> PlannerResponse:
        pass

class GeminiPlanner(PlannerLLM):
    """Primary Planner using Gemini 2.5 Flash (Thinking)"""
    async def generate(self, request: PlannerRequest) -> PlannerResponse:
        system = PromptBuilder.build_system_prompt()
        user = PromptBuilder.build_user_message(request)
        prompt = f"{system}\n\n{user}"
        
        try:
            raw = await gateway._execute_with_retry(
                gateway.groq_clients,
                gateway.groq_model,
                prompt,
                temperature=0.2,
                max_tokens=2000
            )
            return PlannerParser.parse(raw)
        except PlannerParseError as e:
            # One retry with correction
            correction = f"Your previous response failed validation: {e}. Please strictly follow the schema and rules. Return ONLY valid JSON."
            raw = await gateway._execute_with_retry(
                gateway.groq_clients,
                gateway.groq_model,
                retry_prompt,
                temperature=0.1,
                max_tokens=2000
            )
            return PlannerParser.parse(raw)

class DeepSeekPlanner(PlannerLLM):
    """Fallback Planner using DeepSeek"""
    async def generate(self, request: PlannerRequest) -> PlannerResponse:
        system = PromptBuilder.build_system_prompt()
        user = PromptBuilder.build_user_message(request)
        prompt = f"{system}\n\n{user}"
        
        raw = await gateway._execute_with_retry(
            gateway.groq_clients,
            gateway.groq_model,
            prompt,
            temperature=0.2,
            max_tokens=2000
        )
        return PlannerParser.parse(raw)

class OpenRouterPlanner(PlannerLLM):
    """Secondary Fallback Planner using OpenRouter"""
    async def generate(self, request: PlannerRequest) -> PlannerResponse:
        system = PromptBuilder.build_system_prompt()
        user = PromptBuilder.build_user_message(request)
        prompt = f"{system}\n\n{user}"
        
        raw = await gateway._execute_with_retry(
            gateway.groq_clients,
            gateway.groq_model,
            prompt,
            temperature=0.2,
            max_tokens=2000
        )
        return PlannerParser.parse(raw)
