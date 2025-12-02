from __future__ import annotations

from collections import defaultdict
from typing import DefaultDict, List

from app.models.schemas import ChatMessage


class ConversationMemory:
    def __init__(self) -> None:
        self._store: DefaultDict[str, List[ChatMessage]] = defaultdict(list)

    def get_history(self, session_id: str, limit: int | None = None) -> list[ChatMessage]:
        history = self._store.get(session_id, [])
        if limit is None or limit >= len(history):
            return history.copy()
        return history[-limit:]

    def append(self, session_id: str, message: ChatMessage) -> None:
        self._store[session_id].append(message)

    def reset(self, session_id: str) -> None:
        if session_id in self._store:
            del self._store[session_id]


def get_memory() -> ConversationMemory:
    # Singleton for process lifetime
    global _MEMORY
    try:
        return _MEMORY
    except NameError:  # pragma: no cover - guard for module load
        _MEMORY = ConversationMemory()
        return _MEMORY
