import pytest
from app.planner.schemas import PlannerRequest, CandidatePlan, PlannerResponse
from app.planner.parser import PlannerParser, PlannerParseError
from app.policy.engine import PolicyEngine

def test_parser_valid_json():
    raw_json = """
    ```json
    {
      "planning_context": "Delay is preferred due to high resource cost.",
      "plans": [
        {
          "id": "A",
          "title": "Plan A",
          "description": "Desc A",
          "strategy": "Delay",
          "affected_resources": ["r1"],
          "estimated_delay": 5,
          "confidence": 0.9,
          "reasoning": "Reason A",
          "actions": []
        },
        {
          "id": "B",
          "title": "Plan B",
          "description": "Desc B",
          "strategy": "Reassign",
          "affected_resources": ["r2"],
          "estimated_delay": 0,
          "confidence": 0.8,
          "reasoning": "Reason B",
          "actions": []
        },
        {
          "id": "C",
          "title": "Plan C",
          "description": "Desc C",
          "strategy": "Cancel",
          "affected_resources": [],
          "estimated_delay": 0,
          "confidence": 0.1,
          "reasoning": "Reason C",
          "actions": []
        }
      ]
    }
    ```
    """
    response = PlannerParser.parse(raw_json)
    assert len(response.plans) == 3
    assert response.plans[0].id == "A"
    assert response.planning_context == "Delay is preferred due to high resource cost."

def test_parser_invalid_json():
    raw_json = "{ invalid json"
    with pytest.raises(PlannerParseError):
        PlannerParser.parse(raw_json)

def test_parser_wrong_number_of_plans():
    raw_json = """
    {
      "planning_context": "Context",
      "plans": [
        {
          "id": "A",
          "title": "Plan A",
          "description": "Desc A",
          "strategy": "Delay",
          "affected_resources": ["r1"],
          "estimated_delay": 5,
          "confidence": 0.9,
          "reasoning": "Reason A",
          "actions": []
        }
      ]
    }
    """
    with pytest.raises(PlannerParseError, match="Expected exactly 3 plans"):
        PlannerParser.parse(raw_json)

def test_policy_engine_scoring():
    engine = PolicyEngine()
    engine.priority_weight = 10
    engine.delay_penalty = 0.5
    engine.resource_penalty = 1.0
    engine.confidence_bonus = 10.0
    
    plan_a = CandidatePlan(
        id="A", title="A", description="A", strategy="Delay",
        affected_resources=["r1"], estimated_delay=10, confidence=0.9, reasoning="A", actions=[]
    )
    # Score A: (0.9 * 10) - (10 * 0.5) - (1 * 1.0) = 9 - 5 - 1 = 3.0
    
    plan_b = CandidatePlan(
        id="B", title="B", description="B", strategy="Reassign",
        affected_resources=["r2", "r3"], estimated_delay=2, confidence=0.95, reasoning="B", actions=[]
    )
    # Score B: (0.95 * 10) - (2 * 0.5) - (2 * 1.0) = 9.5 - 1 - 2 = 6.5
    
    plan_c = CandidatePlan(
        id="C", title="C", description="C", strategy="Reallocate",
        affected_resources=["r1"], estimated_delay=5, confidence=0.5, reasoning="C", actions=[]
    )
    # Score C: (0.5 * 10) - (5 * 0.5) - (1 * 1.0) = 5 - 2.5 - 1 = 1.5

    best_plan = engine.choose([plan_a, plan_b, plan_c], [])
    assert best_plan.id == "B"
