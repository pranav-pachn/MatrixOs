import json
import os

file_path = "backend/data/airport.json"

with open(file_path, "r") as f:
    data = json.load(f)

# Modify existing missions
# MSN-101 (Flight AA102)
msn_101 = next(m for m in data["missions"] if m["id"] == "MSN-101")
msn_101["tasks"][0]["assignedResourceId"] = "RES-02" # Deboarding -> Gate B12
msn_101["tasks"][1]["assignedResourceId"] = "RES-01" # Fueling -> FT-402

# MSN-102 (Flight DL405)
msn_102 = next(m for m in data["missions"] if m["id"] == "MSN-102")
msn_102["tasks"][0]["assignedResourceId"] = "RES-03" # Gate Assign -> BC-109

with open(file_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Saved airport.json")
