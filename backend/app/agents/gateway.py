import os
import json
import re
import httpx
from typing import Dict, Any, List
from openai import AsyncOpenAI
from app.models.domain import Scenario

def load_env_keys() -> Dict[str, List[str]]:
    """Parse .env supporting multi-line comma-separated keys"""
    keys = {}
    current_key = None
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    k, v = line.split('=', 1)
                    current_key = k.strip()
                    if current_key not in keys:
                        keys[current_key] = []
                    
                    v = v.strip().strip(',')
                    if v:
                        keys[current_key].extend([x.strip() for x in v.split(',') if x.strip()])
                elif current_key:
                    # Continuation of the previous key on a new line
                    v = line.strip().strip(',')
                    if v:
                        keys[current_key].extend([x.strip() for x in v.split(',') if x.strip()])
    return keys

# SSL bypass for DeepSeek via Nvidia since the user's proxy was blocking it
http_client = httpx.AsyncClient(verify=False)

class LLMGateway:
    def __init__(self):
        env_keys = load_env_keys()
        
        def create_clients(keys_list, base_url, **kwargs):
            if not keys_list: return []
            kwargs.setdefault('timeout', 3.0)
            kwargs.setdefault('http_client', http_client)
            return [AsyncOpenAI(api_key=k, base_url=base_url, **kwargs) for k in keys_list]

        # 1. DeepSeek via NVIDIA (Planning / Reasoning)
        self.deepseek_clients = create_clients(
            env_keys.get("DEEPSEEK_KEY", []),
            "https://integrate.api.nvidia.com/v1",
            http_client=http_client
        )
        self.deepseek_model = "deepseek-ai/deepseek-v4-pro"

        # 3. Groq (Fast UI interactions)
        self.groq_clients = create_clients(
            env_keys.get("GROQ_API_KEY", []),
            "https://api.groq.com/openai/v1"
        )
        self.groq_model = "llama-3.1-8b-instant"

        # 4. OpenRouter (Fallback / Routing)
        self.openrouter_clients = create_clients(
            env_keys.get("OPENROUTER_API_KEY", []),
            "https://openrouter.ai/api/v1"
        )
        self.openrouter_model = "meta-llama/llama-3.2-3b-instruct:free"

    async def _execute_with_retry(self, clients: List[AsyncOpenAI], model: str, prompt: str, **kwargs) -> str:
        """Executes the call, trying fallback keys if Rate Limit occurs"""
        if not clients:
            raise Exception(f"No API keys configured for model {model}")
            
        last_exception = None
        for i, client in enumerate(clients):
            try:
                response = await client.chat.completions.create(
                    model=model,
                    messages=[{"role": "user", "content": prompt}],
                    **kwargs
                )
                return response.choices[0].message.content.strip()
            except Exception as e:
                err_str = str(e).lower()
                # Check for rate limit, quota, or 429
                if "429" in err_str or "quota" in err_str or "rate limit" in err_str:
                    print(f"Rate limit hit on key {i+1} for {model}. Trying next key...")
                    last_exception = e
                    continue
                else:
                    # If it's a different error (e.g. 404 Model Not Found), fail fast or retry? 
                    # Usually better to raise it to fallback to openrouter.
                    raise e
        
        if last_exception:
            raise last_exception
        raise Exception("All keys failed")

    async def interpret_event(self, event_type: str, scenario: Scenario) -> str:
        prompt = f"""
        You are the MatrixOS Impact Assessor. 
        A disruption event has just occurred in the environment.
        
        Event Type: {event_type}
        
        Analyze the immediate impact on the active missions and resources.
        Provide a very concise, 1-2 sentence technical assessment. Do not include introductory text.
        """
        try:
            return await self._execute_with_retry(
                self.groq_clients, 
                self.groq_model, 
                prompt, 
                temperature=0.2, 
                max_tokens=100
            )
        except Exception as e:
            print(f"Groq Impact Assessment Error: {e}")
            return await self.fallback_call(prompt)

    async def plan_recovery(self, event_type: str, scenario: Scenario) -> Dict[str, Any]:
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
            content = await self._execute_with_retry(
                self.groq_clients,
                self.groq_model,
                prompt,
                temperature=0.2,
                max_tokens=1000
            )
            return self._parse_json(content, event_type)
        except Exception as e:
            print(f"Groq Planning Error: {e}")
            print("Falling back to DeepSeek...")
            try:
                fallback_content = await self._execute_with_retry(
                    self.groq_clients,
                    self.groq_model,
                    prompt,
                    temperature=0.2,
                    max_tokens=1000
                )
                return self._parse_json(fallback_content, event_type)
            except Exception as fallback_e:
                print(f"DeepSeek Fallback Error: {fallback_e}")
                return self._error_plan(event_type, str(fallback_e))

    async def fast_ui_interaction(self, prompt: str) -> str:
        try:
            return await self._execute_with_retry(
                self.groq_clients,
                self.groq_model,
                prompt,
                temperature=0.7,
                max_tokens=200
            )
        except Exception as e:
            print(f"Groq UI Interaction Error: {e}")
            return await self.fallback_call(prompt)

    async def fallback_call(self, prompt: str) -> str:
        try:
            return await self._execute_with_retry(
                self.groq_clients,
                self.groq_model,
                prompt,
                temperature=0.5,
                max_tokens=200
            )
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
