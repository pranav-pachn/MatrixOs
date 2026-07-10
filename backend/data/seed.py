import sqlite3
import json
import os

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "memory.db"))
JSON_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "memory", "seed_cases.json"))

def seed_db():
    if os.path.exists(DB_PATH):
        # Check if new table exists
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='recoveries'")
        table_exists = cursor.fetchone()
        conn.close()
        
        if table_exists:
            print("memory.db already has 'recoveries' table. Skipping seed.")
            return
        else:
            print("memory.db is missing 'recoveries' table. Proceeding to seed.")

    print("Seeding memory.db from memory/seed_cases.json...")
    
    # Initialize repository
    import sys
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    from memory.repository import repository
    from memory.schemas import RecoveryRecord
    
    repository.create_tables()
    
    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, "r") as f:
            cases = json.load(f)
            import uuid
            import datetime
            for case in cases:
                case_id = f"case_{uuid.uuid4().hex[:8]}"
                timestamp = datetime.datetime.utcnow().isoformat()
                record = RecoveryRecord(
                    id=case_id,
                    disruption_type=case.get("disruption_type"),
                    mission_type=case.get("mission_type"),
                    strategy_id=case.get("strategy_id"),
                    strategy_name=case.get("strategy_name"),
                    success=case.get("success"),
                    delay_minutes=case.get("delay_minutes"),
                    latency_ms=case.get("latency_ms"),
                    failure_reason=case.get("failure_reason"),
                    context_snapshot=case.get("context_snapshot"),
                    timestamp=timestamp
                )
                repository.insert(record)
        print(f"Seeded {len(cases)} operational memory records.")
    else:
        print(f"Seed file {JSON_PATH} not found.")

if __name__ == "__main__":
    seed_db()
