import json
import re
from typing import List
from app.agents.gateway import gateway
from app.recovery_intelligence.schemas import RecoveryRequest, RecoveryStrategy
from app.recovery_intelligence.rie_prompt import RIEPromptBuilder

class RIEParseError(Exception):
    pass

class RIEParser:
    @staticmethod
    def parse(content: str) -> List[RecoveryStrategy]:
        if "```" in content:
            content = re.sub(r'```json\s*', '', content)
            content = re.sub(r'```\s*', '', content)
        try:
            data = json.loads(content)
            strategies = data.get("strategies", [])
            return [RecoveryStrategy(**s) for s in strategies]
        except Exception as e:
            raise RIEParseError(f"Failed to parse RIE output: {e}")

class RecoveryLLM:
    async def generate(self, request: RecoveryRequest, memory_data: dict) -> List[RecoveryStrategy]:
        system = RIEPromptBuilder.build_system_prompt()
        user = RIEPromptBuilder.build_user_message(request, memory_data)
        prompt = f"{system}\n\n{user}"
        
        # Primary: Gemini
        try:
            raw = await gateway._execute_with_retry(
                gateway.gemini_clients,
                gateway.gemini_model,
                prompt,
                temperature=0.3,
                max_tokens=1500
            )
            return RIEParser.parse(raw)
        except Exception as e:
            print(f"RIE Primary (Gemini) failed: {e}. Trying fallback.")
            
        # Fallback 1: DeepSeek
        try:
            raw = await gateway._execute_with_retry(
                gateway.deepseek_clients,
                gateway.deepseek_model,
                prompt,
                temperature=0.3,
                max_tokens=1500
            )
            return RIEParser.parse(raw)
        except Exception as e:
            print(f"RIE Fallback (DeepSeek) failed: {e}. Trying OpenRouter.")
            
        # Fallback 2: OpenRouter
        raw = await gateway._execute_with_retry(
            gateway.openrouter_clients,
            gateway.openrouter_model,
            prompt,
            temperature=0.3,
            max_tokens=1500
        )
        return RIEParser.parse(raw)

rie_llm = RecoveryLLM()
