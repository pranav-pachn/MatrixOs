import sys
import os

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

try:
    from backend.main import app
    from backend.schemas.runtime_dto import Scenario
    from backend.services.state_manager import state_manager
    print("Imports successful!")
except Exception as e:
    import traceback
    traceback.print_exc()
