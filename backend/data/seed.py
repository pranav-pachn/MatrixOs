import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "memory.db")
JSON_PATH = os.path.join(os.path.dirname(__file__), "recovery_cases.json")

def seed_db():
    # Only seed if the DB doesn't exist to preserve runtime changes during testing
    if os.path.exists(DB_PATH):
        print("memory.db already exists. Skipping seed.")
        return

    print("Seeding memory.db from recovery_cases.json...")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS episodic_memory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT NOT NULL,
            strategy TEXT NOT NULL,
            outcome TEXT NOT NULL,
            confidence REAL,
            delay INTEGER,
            context TEXT,
            timestamp TEXT
        )
    """)
    
    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, "r") as f:
            cases = json.load(f)
            for case in cases:
                cursor.execute("""
                    INSERT INTO episodic_memory (event_type, strategy, outcome, confidence, delay, context, timestamp)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    case.get("event_type"), 
                    case.get("strategy"), 
                    case.get("outcome"), 
                    case.get("confidence"), 
                    case.get("delay"), 
                    case.get("context"), 
                    case.get("timestamp")
                ))
        print(f"Seeded {len(cases)} operational memory records.")
    else:
        print(f"Seed file {JSON_PATH} not found.")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    seed_db()
