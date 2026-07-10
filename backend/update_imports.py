import os
import re

app_dir = os.path.join(os.path.dirname(__file__), "app")

for root, _, files in os.walk(app_dir):
    for file in files:
        if file.endswith(".py"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Replace imports
            content = content.replace("from schemas.runtime_dto import", "from app.models.domain import")
            content = content.replace("from api.websockets.manager import", "from app.websocket.manager import")
            content = content.replace("from services.state_manager import", "from app.runtime.state_manager import")
            content = content.replace("from runtime.recovery_loop import", "from app.runtime.recovery_loop import")
            content = content.replace("from services.metrics_service import", "from app.runtime.metrics_service import")

            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
