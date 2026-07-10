import urllib.request
import json
import time

SCENARIO = "airport"
BASE_URL = "http://localhost:8000"

def get_replay():
    req = urllib.request.Request(f"{BASE_URL}/api/scenarios/{SCENARIO}/events/replay")
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())

print("--- Initial Replay Buffer ---")
initial = get_replay()
print(f"Events in buffer: {len(initial)}")
for e in initial[-3:]: # Print last 3 if any
    print(f"  {e['type']} @ {e['timestamp']}")

print("\n--- Injecting Event ---")
req = urllib.request.Request(
    f"{BASE_URL}/api/events/inject",
    data=json.dumps({"scenarioId": SCENARIO, "type": "Fuel Truck Breakdown"}).encode(),
    headers={"Content-Type": "application/json"}
)
with urllib.request.urlopen(req) as response:
    result = json.loads(response.read().decode())
    print(f"Injection Result: {result}")

print("\n--- Waiting for Recovery Loop (10s) ---")
for i in range(10):
    time.sleep(1)
    print(".", end="", flush=True)
print()

print("\n--- Final Replay Buffer ---")
final = get_replay()
print(f"Events in buffer: {len(final)}")
for e in final:
    print(f"  Type: {e['type']}")
    if 'phase' in e and e['phase']:
        print(f"    Phase: {e['phase']}")
    if e['type'] == "runtime.state.updated":
        print(f"    Scenario Plan Set: {e['payload'].get('currentPlan') is not None}")
