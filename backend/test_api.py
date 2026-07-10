import requests
try:
    r = requests.get('http://127.0.0.1:8000/api/scenarios/airport/state')
    print("STATUS:", r.status_code)
    print("DATA:", r.json())
except Exception as e:
    print("ERR:", e)
