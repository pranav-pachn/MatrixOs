import requests
try:
    r = requests.get('http://127.0.0.1:8000/api/scenarios/airport/state', timeout=2)
    print("STATUS:", r.status_code)
    print("HEADERS:", r.headers)
except Exception as e:
    print("ERR:", e)

try:
    r2 = requests.get('http://127.0.0.1:8000/ws/runtime/airport', timeout=2)
    print("STATUS2:", r2.status_code)
    print("HEADERS2:", r2.headers)
except Exception as e:
    print("ERR2:", e)
