import json
import os

file_path = "backend/data/warehouse-hub.json"

with open(file_path, "r") as f:
    data = json.load(f)

# Modify existing missions
# MSN-W88 (Outbound Freight 404)
msn_88 = next(m for m in data["missions"] if m["id"] == "MSN-W88")
msn_88["tasks"][0]["assignedResourceId"] = "RES-W3" # Pallet Picking -> Belt 3A
msn_88["tasks"][1]["assignedResourceId"] = "RES-W4" # Dock Loading -> Forklift

# MSN-W89 (Inbound Restock A2)
msn_89 = next(m for m in data["missions"] if m["id"] == "MSN-W89")
msn_89["tasks"][0]["assignedResourceId"] = "RES-W2" # Unload -> Dock B
msn_89["tasks"][1]["assignedResourceId"] = "RES-W3" # Sort -> Belt 3A

# Add new missions
new_missions = [
    {
        "id": "MSN-W90",
        "name": "Robot Dispatch",
        "type": "Fulfillment",
        "status": "diverged",
        "priority": 1,
        "deadline": "2026-07-09T18:20:00.000Z",
        "tasks": [
            {
                "id": "t1",
                "name": "Path Calculation",
                "type": "logistics",
                "status": "COMPLETED",
                "duration": 2,
                "assignedResourceId": None,
                "dependencies": []
            },
            {
                "id": "t2",
                "name": "Transport",
                "type": "logistics",
                "status": "PENDING",
                "duration": 15,
                "assignedResourceId": "RES-W1", # Bot 004 (failed)
                "dependencies": ["t1"]
            }
        ]
    },
    {
        "id": "MSN-W91",
        "name": "Shipment Route 7",
        "type": "Fulfillment",
        "status": "pending",
        "priority": 2,
        "deadline": "2026-07-09T19:00:00.000Z",
        "tasks": [
            {
                "id": "t1",
                "name": "Staging",
                "type": "logistics",
                "status": "COMPLETED",
                "duration": 5,
                "assignedResourceId": None,
                "dependencies": []
            },
            {
                "id": "t2",
                "name": "Loading",
                "type": "loading",
                "status": "PENDING",
                "duration": 15,
                "assignedResourceId": "RES-W2",
                "dependencies": ["t1"]
            }
        ]
    }
]

data["missions"].extend(new_missions)

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Saved warehouse-hub.json")
