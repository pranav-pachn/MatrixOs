from typing import List, Dict, Any
from app.recovery_intelligence.memory.sqlite_store import memory_store
from app.recovery_intelligence.memory.playbooks import PLAYBOOKS
from app.recovery_intelligence.schemas import MemoryRecord

class MemoryRetriever:
    def retrieve(self, event_type: str, limit: int = 3) -> Dict[str, Any]:
        """
        Retrieves episodic memory and procedural playbooks for the given event type.
        """
        episodic_records = memory_store.read_records(event_type, limit=limit)
        playbook_entries = PLAYBOOKS.get(event_type, [])
        
        return {
            "episodic": episodic_records,
            "procedural": playbook_entries
        }

retriever = MemoryRetriever()
