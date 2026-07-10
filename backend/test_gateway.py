import asyncio
from app.agents.gateway import gateway

async def test_all_providers():
    print("Testing Gemini (Event Interpretation)...")
    try:
        # Dummy scenario
        from app.models.domain import Scenario
        dummy = Scenario(id="test", name="test", missions=[], resources=[], nodes=[], edges=[], divergences=[], memories=[], confidenceData=[], recovery={"eventType": "N/A", "affectedMissions": [], "confidence": 0, "steps": []})
        res = await gateway.interpret_event("Test Disruption", dummy)
        print(f"[Gemini SUCCESS]: {res[:100]}...\n")
    except Exception as e:
        print(f"[Gemini FAILED]: {e}\n")

    print("Testing DeepSeek (Planning)...")
    try:
        res = await gateway.plan_recovery("Test Disruption", dummy)
        print(f"[DeepSeek SUCCESS]: {str(res)[:100]}...\n")
    except Exception as e:
        print(f"[DeepSeek FAILED]: {e}\n")

    print("Testing Groq (Fast UI)...")
    try:
        res = await gateway.fast_ui_interaction("Say 'Groq works' very fast.")
        print(f"[Groq SUCCESS]: {res[:100]}...\n")
    except Exception as e:
        print(f"[Groq FAILED]: {e}\n")

    print("Testing OpenRouter (Fallback)...")
    try:
        res = await gateway.fallback_call("Say 'OpenRouter works' as a fallback.")
        print(f"[OpenRouter SUCCESS]: {res[:100]}...\n")
    except Exception as e:
        print(f"[OpenRouter FAILED]: {e}\n")

if __name__ == "__main__":
    asyncio.run(test_all_providers())
