import sqlite3
import os
import datetime
from typing import List
from app.recovery_intelligence.schemas import MemoryRecord

class SQLiteMemoryStore:
    def __init__(self):
        self.db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'data', 'memory.db'))

    def write_record(self, event_type: str, strategy: str, outcome: str, confidence: float, delay: int, context: str):
        if not os.path.exists(self.db_path):
            return
            
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            timestamp = datetime.datetime.utcnow().isoformat()
            cursor.execute("""
                INSERT INTO episodic_memory (event_type, strategy, outcome, confidence, delay, context, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (event_type, strategy, outcome, confidence, delay, context, timestamp))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Error writing to memory.db: {e}")

    def read_records(self, event_type: str, limit: int = 5) -> List[MemoryRecord]:
        if not os.path.exists(self.db_path):
            return []
            
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("""
                SELECT event_type, strategy, outcome, confidence, delay, context, timestamp
                FROM episodic_memory
                WHERE event_type = ?
                ORDER BY timestamp DESC
                LIMIT ?
            """, (event_type, limit))
            
            rows = cursor.fetchall()
            conn.close()
            
            records = []
            for row in rows:
                records.append(MemoryRecord(
                    event_type=row[0],
                    strategy=row[1],
                    outcome=row[2],
                    confidence=row[3],
                    delay=row[4],
                    context=row[5],
                    timestamp=row[6]
                ))
            return records
        except Exception as e:
            print(f"Error reading from memory.db: {e}")
            return []

memory_store = SQLiteMemoryStore()
