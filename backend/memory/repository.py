import sqlite3
import os
import json
from typing import List, Dict, Any
from .schemas import RecoveryRecord

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'memory.db'))

class MemoryRepository:
    def create_tables(self):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS recoveries (
                id TEXT PRIMARY KEY,
                disruption_type TEXT NOT NULL,
                mission_type TEXT NOT NULL,
                strategy_id TEXT NOT NULL,
                strategy_name TEXT NOT NULL,
                success INTEGER NOT NULL,
                delay_minutes INTEGER NOT NULL,
                latency_ms INTEGER NOT NULL,
                failure_reason TEXT,
                context_snapshot TEXT,
                timestamp TEXT NOT NULL
            )
        """)
        conn.commit()
        conn.close()

    def insert(self, record: RecoveryRecord):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        context_str = json.dumps(record.context_snapshot) if record.context_snapshot else None
        cursor.execute("""
            INSERT INTO recoveries (id, disruption_type, mission_type, strategy_id, strategy_name, success, delay_minutes, latency_ms, failure_reason, context_snapshot, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            record.id, record.disruption_type, record.mission_type, 
            record.strategy_id, record.strategy_name, 1 if record.success else 0,
            record.delay_minutes, record.latency_ms, record.failure_reason, 
            context_str, record.timestamp
        ))
        conn.commit()
        conn.close()

    def query_by_disruption(self, disruption_type: str, limit: int = 3) -> List[RecoveryRecord]:
        if not os.path.exists(DB_PATH):
            return []
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, disruption_type, mission_type, strategy_id, strategy_name, success, delay_minutes, latency_ms, failure_reason, context_snapshot, timestamp
            FROM recoveries
            WHERE disruption_type = ?
            ORDER BY success DESC, delay_minutes ASC
            LIMIT ?
        """, (disruption_type, limit))
        rows = cursor.fetchall()
        conn.close()
        return [self._map_row(row) for row in rows]

    def query_recent(self, limit: int = 10) -> List[RecoveryRecord]:
        if not os.path.exists(DB_PATH):
            return []
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, disruption_type, mission_type, strategy_id, strategy_name, success, delay_minutes, latency_ms, failure_reason, context_snapshot, timestamp
            FROM recoveries
            ORDER BY timestamp DESC
            LIMIT ?
        """, (limit,))
        rows = cursor.fetchall()
        conn.close()
        return [self._map_row(row) for row in rows]
        
    def query_all_by_disruption(self, disruption_type: str) -> List[RecoveryRecord]:
        if not os.path.exists(DB_PATH):
            return []
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, disruption_type, mission_type, strategy_id, strategy_name, success, delay_minutes, latency_ms, failure_reason, context_snapshot, timestamp
            FROM recoveries
            WHERE disruption_type = ?
        """, (disruption_type,))
        rows = cursor.fetchall()
        conn.close()
        return [self._map_row(row) for row in rows]

    def _map_row(self, row) -> RecoveryRecord:
        context_data = None
        if row[9]:
            try:
                context_data = json.loads(row[9])
            except:
                pass
        return RecoveryRecord(
            id=row[0],
            disruption_type=row[1],
            mission_type=row[2],
            strategy_id=row[3],
            strategy_name=row[4],
            success=bool(row[5]),
            delay_minutes=row[6],
            latency_ms=row[7],
            failure_reason=row[8],
            context_snapshot=context_data,
            timestamp=row[10]
        )

repository = MemoryRepository()
