import { useCallback, useRef } from 'react';

import type { ChatChunk } from '@/lib/types';
import { splitNdjsonBuffer } from '@/lib/utils';
import {
	appendAssistantPlaceholder,
	appendToLastAssistantContent,
	appendUserMessage,
	setArtifact,
	setError,
	setLastAssistantContent,
	setLastAssistantContentIfEmpty,
	setSidebarOpen,
	setStreaming,
} from '@/store/chatSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSessionId } from '@/store/selectors';

export const useChatStream = () => {
	const sessionId = useAppSelector(selectSessionId);
	const dispatch = useAppDispatch();
	const abortControllerRef = useRef<AbortController | null>(null);

	const startStreaming = useCallback(
		async (prompt: string) => {
			const trimmed = prompt.trim();
			if (!trimmed) return;

			abortControllerRef.current?.abort();

			dispatch(appendUserMessage(trimmed));
			dispatch(appendAssistantPlaceholder());
			dispatch(setStreaming(true));
			dispatch(setError(null));

			const controller = new AbortController();
			abortControllerRef.current = controller;

			try {
				const response = await fetch(
					'https://ai-coding-agent-production-9682.up.railway.app/api/chat/stream',
					{
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							session_id: sessionId,
							messages: [{ role: 'user', content: trimmed }],
						}),
						signal: controller.signal,
					}
				);

				if (!response.ok || !response.body) {
					throw new Error('Unable to start streaming response');
				}

				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				let buffer = '';

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					buffer += decoder.decode(value, { stream: true });

					const { lines, remainder } = splitNdjsonBuffer(buffer);
					buffer = remainder;

					for (const line of lines) {
						const data = JSON.parse(line) as ChatChunk;

						if (data.type === 'token') {
							dispatch(appendToLastAssistantContent(data.content));
						} else if (data.type === 'complete') {
							if (data.content) {
								dispatch(setLastAssistantContent(data.content));
							}
							const artifact = data.artifact ?? null;
							dispatch(setArtifact(artifact));
							if (artifact) {
								dispatch(setSidebarOpen(true));
							}
						} else if (data.type === 'error') {
							throw new Error(data.error);
						}
					}
				}
			} catch (error) {
				if ((error as DOMException).name === 'AbortError') {
					return;
				}
				const message = (error as Error).message || 'Unexpected error';
				dispatch(setError(message));
				dispatch(
					setLastAssistantContentIfEmpty('The agent ran into an issue.')
				);
			} finally {
				dispatch(setStreaming(false));
				abortControllerRef.current = null;
			}
		},
		[dispatch, sessionId]
	);

	const stopStreaming = useCallback(() => {
		abortControllerRef.current?.abort();
		abortControllerRef.current = null;
		dispatch(setStreaming(false));
	}, [dispatch]);

	return { startStreaming, stopStreaming };
};
