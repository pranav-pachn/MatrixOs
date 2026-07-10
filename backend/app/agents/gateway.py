import os
import json
import re
import httpx
from typing import Dict, Any, Optional
from openai import AsyncOpenAI
from app.models.domain import Scenario

# Load .env file
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
if os.path.exists(env_path):
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                os.environ[k.strip()] = v.strip().strip(",")

# SSL bypass for DeepSeek via Nvidia since the user's proxy was blocking it
http_client = httpx.AsyncClient(verify=False)

class LLMGateway:
    def __init__(self):
        # 1. Gemini (Event Interpretation)
        self.gemini_client = AsyncOpenAI(
            api_key=os.environ.get("GEMINI_API_KEY"),
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
        )
        self.gemini_model = "gemini-2.5-flash"

        # 2. DeepSeek via NVIDIA (Planning / Reasoning)
        self.deepseek_client = AsyncOpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=os.environ.get("DEEPSEEK_KEY"),
            http_client=http_client
        )
        self.deepseek_model = "deepseek-ai/deepseek-v4-pro"

        # 3. Groq (Fast UI interactions)
        self.groq_client = AsyncOpenAI(
            base_url="https://api.groq.com/openai/v1",
            api_key=os.environ.get("GROQ_API_KEY")
        )
        self.groq_model = "llama-3.1-8b-instant"

        # 4. OpenRouter (Fallback / Routing)
        self.openrouter_client = AsyncOpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.environ.get("OPENROUTER_API_KEY"),
        )
        self.openrouter_model = "meta-llama/llama-3.2-3b-instruct:free"

    async def interpret_event(self, event_type: str, scenario: Scenario) -> str:
        """Uses Gemini for strong structured reasoning and event interpretation"""
        prompt = f"""
        You are the MatrixOS Impact Assessor. 
        A disruption event has just occurred in the environment.
        
        Event Type: {event_type}
        
        Analyze the immediate impact on the active missions and resources.
        Provide a very concise, 1-2 sentence technical assessment. Do not include introductory text.
        """
        try:
            response = await self.gemini_client.chat.completions.create(
                model=self.gemini_model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=100
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Gemini Impact Assessment Error: {e}")
            return await self.fallback_call(prompt)

    async def plan_recovery(self, event_type: str, scenario: Scenario) -> Dict[str, Any]:
        """Uses DeepSeek for complex multi-step reasoning and recovery logic"""
        prompt = f"""
        You are the MatrixOS Autonomous Recovery Planner.
        
        A disruption event has occurred: {event_type}
        
        Current World State (JSON):
        {scenario.model_dump_json()}
        
        Your job is to generate a recovery plan to mitigate the disruption.
        You must output ONLY valid JSON matching this exact schema, with no markdown formatting or extra text:
        {{
            "eventType": "{event_type}",
            "affectedMissions": ["list of affected mission IDs"],
            "confidence": 0.95,
            "actions": [
                {{
                    "action_type": "reassign_resource",
                    "target_resource_id": "ID of a currently 'available' resource that can substitute",
                    "target_task_id": "ID of the task that needs the resource"
                }}
            ],
            "steps": [
                {{
                    "id": "step_1",
                    "title": "Short title of action",
                    "description": "Explanation of what is being done",
                    "status": "pending",
                    "duration": 5
                }}
            ]
        }}
        
        CRITICAL RULES:
        1. Only return the raw JSON object. Do NOT wrap it in ```json blocks.
        2. In the "actions" array, "action_type" must be exactly "reassign_resource" or "delay_mission".
        3. Only reassign resources that are currently marked as "available" in the World State.
        4. Make sure "confidence" is a float between 0 and 1.
        """
        
        try:
            response = await self.deepseek_client.chat.completions.create(
                model=self.deepseek_model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=1000
            )
            content = response.choices[0].message.content.strip()
            return self._parse_json(content, event_type)
        except Exception as e:
            print(f"DeepSeek Planning Error: {e}")
            print("Falling back to OpenRouter...")
            try:
                # Fallback to OpenRouter
                fallback_resp = await self.openrouter_client.chat.completions.create(
                    model=self.openrouter_model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.2,
                    max_tokens=1000
                )
                return self._parse_json(fallback_resp.choices[0].message.content.strip(), event_type)
            except Exception as fallback_e:
                print(f"OpenRouter Fallback Error: {fallback_e}")
                return self._error_plan(event_type, str(fallback_e))

    async def fast_ui_interaction(self, prompt: str) -> str:
        """Uses Groq for ultra-low latency, short-lived calls (e.g. snappy demo responses)"""
        try:
            response = await self.groq_client.chat.completions.create(
                model=self.groq_model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=200
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Groq UI Interaction Error: {e}")
            return await self.fallback_call(prompt)

    async def fallback_call(self, prompt: str) -> str:
        """Provider fallback using OpenRouter"""
        try:
            response = await self.openrouter_client.chat.completions.create(
                model=self.openrouter_model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=200
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Fallback unavailable: {e}"

    def _parse_json(self, content: str, event_type: str) -> Dict[str, Any]:
        if "```" in content:
            content = re.sub(r'```json\s*', '', content)
            content = re.sub(r'```\s*', '', content)
        try:
            return json.loads(content)
        except json.JSONDecodeError as e:
            return self._error_plan(event_type, f"JSON parse error: {e}")

    def _error_plan(self, event_type: str, error_msg: str) -> Dict[str, Any]:
        return {
            "eventType": event_type,
            "affectedMissions": [],
            "confidence": 0.1,
            "steps": [{"id": "err", "title": "LLM Error", "description": error_msg, "status": "failed"}],
            "actions": []
        }

gateway = LLMGateway()
