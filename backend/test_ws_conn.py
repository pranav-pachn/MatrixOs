import asyncio
import websockets

async def test():
    try:
        async with websockets.connect('ws://127.0.0.1:8001/ws/runtime/airport') as ws:
            print("Connected successfully!")
            msg = await ws.recv()
            print("Received:", msg[:100])
    except Exception as e:
        print(f"Connection failed: {e}")

asyncio.run(test())
