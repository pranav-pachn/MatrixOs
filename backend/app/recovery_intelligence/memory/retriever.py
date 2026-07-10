from typing import List, Dict, Any
from memory.memory_service import operational_memory
from app.recovery_intelligence.memory.playbooks import PLAYBOOKS
from memory.schemas import RecoveryRecord

class MemoryRetriever:
    def retrieve(self, event_type: str, limit: int = 3) -> Dict[str, Any]:
        """
        Retrieves episodic memory and procedural playbooks for the given event type.
        """
        episodic_records = operational_memory.retrieve(event_type, limit=limit)
        playbook_entries = PLAYBOOKS.get(event_type, [])
        
        return {
            "episodic": episodic_records,
            "procedural": playbook_entries
        }

retriever = MemoryRetriever()
