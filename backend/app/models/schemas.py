from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str


class ChatRequest(BaseModel):
    session_id: str = Field(..., min_length=1)
    messages: list[ChatMessage]


class ChatArtifact(BaseModel):
    language: Optional[str]
    code: str


class ChatChunk(BaseModel):
    type: Literal["token", "complete", "error"]
    content: Optional[str] = None
    artifact: Optional[ChatArtifact] = None
    error: Optional[str] = None
