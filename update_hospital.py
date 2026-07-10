import json
import os

file_path = "backend/data/hospital-er.json"

with open(file_path, "r") as f:
    data = json.load(f)

# Modify existing missions
# MSN-501 (Trauma Code T-14)
msn_501 = next(m for m in data["missions"] if m["id"] == "MSN-501")
msn_501["tasks"][0]["assignedResourceId"] = "RES-H2" # Triage Assessment -> Trauma Bay (Bay 3)
msn_501["tasks"][1]["assignedResourceId"] = "RES-H1" # CT Scan -> CT Scanner (CT-Main, failed)

# MSN-502 (Ambulance Inbound)
msn_502 = next(m for m in data["missions"] if m["id"] == "MSN-502")
msn_502["tasks"][1]["assignedResourceId"] = "RES-H3" # Patient Transfer -> Attending (Dr. Chen)

# Add new missions
new_missions = [
    {
        "id": "MSN-503",
        "name": "Emergency OR Prep",
        "type": "Surgery",
        "status": "in-progress",
        "priority": 1,
        "deadline": "2026-07-09T18:20:00.000Z",
        "tasks": [
            {
                "id": "t1",
                "name": "Anesthesia",
                "type": "medical",
                "status": "COMPLETED",
                "duration": 10,
                "assignedResourceId": "RES-H3",
                "dependencies": []
            },
            {
                "id": "t2",
                "name": "Incision",
                "type": "medical",
                "status": "PENDING",
                "duration": 60,
                "assignedResourceId": None,
                "dependencies": ["t1"]
            }
        ]
    },
    {
        "id": "MSN-504",
        "name": "ICU Intake",
        "type": "Intensive Care",
        "status": "pending",
        "priority": 2,
        "deadline": "2026-07-09T19:00:00.000Z",
        "tasks": [
            {
                "id": "t1",
                "name": "Vitals Monitoring",
                "type": "medical",
                "status": "COMPLETED",
                "duration": 5,
                "assignedResourceId": None,
                "dependencies": []
            },
            {
                "id": "t2",
                "name": "Ventilator Setup",
                "type": "medical",
                "status": "PENDING",
                "duration": 15,
                "assignedResourceId": "RES-H4",
                "dependencies": ["t1"]
            }
        ]
    }
]

data["missions"].extend(new_missions)

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Saved hospital-er.json")
