from __future__ import annotations

import asyncio
from typing import AsyncGenerator, Iterable

import google.generativeai as genai

from app.models.schemas import ChatMessage


def _to_gemini_history(messages: Iterable[ChatMessage]) -> list[dict]:
    history: list[dict] = []
    for msg in messages:
        history.append(
            {
                "role": msg.role,
                "parts": [msg.content],
            }
        )
    return history


class GeminiClient:
    def __init__(self, api_key: str, model: str) -> None:
        genai.configure(api_key=api_key)
        self._model = genai.GenerativeModel(model)

    async def stream_chat(self, messages: list[ChatMessage]) -> AsyncGenerator[str, None]:
        if not messages:
            return

        history = _to_gemini_history(messages[:-1])
        latest = messages[-1]
        queue: asyncio.Queue[str | Exception | None] = asyncio.Queue()
        loop = asyncio.get_running_loop()

        def _run_stream() -> None:
            try:
                chat = self._model.start_chat(history=history)
                for chunk in chat.send_message(latest.content, stream=True):
                    text = chunk.text or ""
                    if not text and hasattr(chunk, "candidates"):
                        for candidate in chunk.candidates:
                            for part in candidate.content.parts:
                                text += getattr(part, "text", "")
                    if text:
                        asyncio.run_coroutine_threadsafe(queue.put(text), loop)
            except Exception as exc:  # pragma: no cover - surfaces via queue
                asyncio.run_coroutine_threadsafe(queue.put(exc), loop)
            finally:
                asyncio.run_coroutine_threadsafe(queue.put(None), loop)

        stream_task = asyncio.create_task(asyncio.to_thread(_run_stream))

        try:
            while True:
                item = await queue.get()
                if item is None:
                    break
                if isinstance(item, Exception):
                    raise item
                yield item
        finally:
            await stream_task
