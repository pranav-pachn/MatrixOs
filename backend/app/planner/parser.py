import json
import re
from app.planner.schemas import PlannerResponse

class PlannerParseError(Exception):
    pass

class PlannerParser:
    @staticmethod
    def parse(raw: str) -> PlannerResponse:
        # Strip markdown fences if present
        content = raw.strip()
        if "```" in content:
            content = re.sub(r'```json\s*', '', content)
            content = re.sub(r'```\s*', '', content)
        
        try:
            parsed_json = json.loads(content)
            response = PlannerResponse(**parsed_json)
            
            if len(response.plans) != 3:
                raise PlannerParseError(f"Expected exactly 3 plans, got {len(response.plans)}")
                
            return response
        except json.JSONDecodeError as e:
            raise PlannerParseError(f"Invalid JSON: {e}")
        except ValueError as e:
            raise PlannerParseError(f"Schema validation failed: {e}")
