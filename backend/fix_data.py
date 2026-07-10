import json
import os
import sys

# Ensure backend directory is in path so we can import app.models
sys.path.insert(0, os.path.dirname(__file__))

from app.models.domain import Scenario, Mission, Resource, Divergence, Memory, Recovery, RecoveryStep

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

def fix_json(scenario_id: str):
    path = os.path.join(DATA_DIR, f"{scenario_id}.json")
    if not os.path.exists(path):
        print(f"Skipping {scenario_id}")
        return
        
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    # Ensure all required arrays/objects exist
    if "missions" not in data: data["missions"] = []
    if "resources" not in data: data["resources"] = []
    if "nodes" not in data: data["nodes"] = []
    if "edges" not in data: data["edges"] = []
    if "divergences" not in data: data["divergences"] = []
    if "memories" not in data: data["memories"] = []
    if "confidenceData" not in data: data["confidenceData"] = []
    
    if "recovery" not in data:
        data["recovery"] = {
            "eventType": "N/A",
            "affectedMissions": [],
            "confidence": 0,
            "steps": []
        }

    # Validate against schema
    try:
        scenario = Scenario(**data)
        
        # Write back cleanly formatted JSON
        with open(path, "w", encoding="utf-8") as f:
            f.write(scenario.model_dump_json(indent=2))
        print(f"Successfully fixed and validated {scenario_id}.json")
    except Exception as e:
        print(f"Failed to validate {scenario_id}.json: {e}")

if __name__ == "__main__":
    for s_id in ["airport", "hospital-er", "warehouse-hub"]:
        fix_json(s_id)
