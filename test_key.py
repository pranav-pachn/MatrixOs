import urllib.request
import urllib.error

key = "sk-v81zcdCE2GVT0cKAXYgIYot5o9R3wshsZqHNQibdMc99vNf2"

endpoints = {
    "OpenAI": "https://api.openai.com/v1/models",
    "OpenRouter": "https://openrouter.ai/api/v1/auth/key",
    "Groq": "https://api.groq.com/openai/v1/models",
    "Together": "https://api.together.xyz/v1/models"
}

print("Testing API Key...")
for name, url in endpoints.items():
    try:
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {key}"})
        res = urllib.request.urlopen(req)
        print(f"{name}: Success ({res.status})")
    except urllib.error.HTTPError as e:
        print(f"{name}: Failed ({e.code})")
    except Exception as e:
        print(f"{name}: Error ({e})")
