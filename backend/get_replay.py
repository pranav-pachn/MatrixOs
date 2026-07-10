import urllib.request
import json

SCENARIO = "airport"
BASE_URL = "http://localhost:8000"

req = urllib.request.Request(f"{BASE_URL}/api/scenarios/{SCENARIO}/events/replay")
with urllib.request.urlopen(req) as response:
    events = json.loads(response.read().decode())
    
print(f"Events in buffer: {len(events)}")
for e in events:
    print(f"  {e['type']} @ {e['timestamp']}")
    if 'phase' in e and e['phase']:
        print(f"    Phase: {e['phase']}")
    if e['type'] == "runtime.state.updated":
        print(f"    Scenario Plan Set: {e['payload'].get('currentPlan') is not None}")
