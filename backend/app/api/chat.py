from __future__ import annotations

import json
import re
from typing import AsyncGenerator, Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from app.core.config import Settings, get_settings
from app.core.gemini_client import GeminiClient
from app.core.memory import ConversationMemory, get_memory
from app.models.schemas import ChatArtifact, ChatChunk, ChatMessage, ChatRequest

router = APIRouter(prefix="/chat", tags=["chat"])

CODE_BLOCK_RE = re.compile(r"```(?P<language>[\w+#-]*)\n(?P<code>.*?)```", re.DOTALL)


def _extract_artifact(text: str) -> Optional[ChatArtifact]:
    match = CODE_BLOCK_RE.search(text)
    if not match:
        return None
    language = match.group("language") or None
    code = match.group("code").strip()
    if not code:
        return None
    return ChatArtifact(language=language, code=code)


def get_client(settings: Settings = Depends(get_settings)) -> GeminiClient:
    if not settings.gemini_api_key:
        raise HTTPException(status_code=500, detail="Missing GEMINI_API_KEY")
    return GeminiClient(settings.gemini_api_key, settings.gemini_model)


def get_conversation_memory() -> ConversationMemory:
    return get_memory()


@router.post("/stream")
async def chat_stream(
    payload: ChatRequest,
    settings: Settings = Depends(get_settings),
    client: GeminiClient = Depends(get_client),
    memory: ConversationMemory = Depends(get_conversation_memory),
) -> StreamingResponse:
    history = memory.get_history(payload.session_id, settings.max_history_messages)
    combined_messages = [*history, *payload.messages]

    async def event_generator() -> AsyncGenerator[str, None]:
        aggregated = ""
        try:
            async for token in client.stream_chat(combined_messages):
                aggregated += token
                chunk = ChatChunk(type="token", content=token)
                yield json.dumps(chunk.model_dump()) + "\n"
        except Exception as exc:  # pragma: no cover - surfaced to client
            error_chunk = ChatChunk(type="error", error=str(exc))
            yield json.dumps(error_chunk.model_dump()) + "\n"
            return

        artifact = _extract_artifact(aggregated)
        assistant_message = ChatMessage(role="assistant", content=aggregated)

        for message in payload.messages:
            memory.append(payload.session_id, message)
        memory.append(payload.session_id, assistant_message)

        complete_chunk = ChatChunk(type="complete", content=aggregated, artifact=artifact)
        yield json.dumps(complete_chunk.model_dump()) + "\n"

    return StreamingResponse(event_generator(), media_type="application/x-ndjson")
