import { type FormEvent, useEffect, useRef } from "react";

import { useChatStream } from "@/hooks/useChatStream";
import { setComposerValue, setEditingMessageId } from "@/store/chatSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectComposerValue, selectEditingMessageId, selectIsStreaming } from "@/store/selectors";

export function ChatInput() {
  const dispatch = useAppDispatch();
  const value = useAppSelector(selectComposerValue);
  const isStreaming = useAppSelector(selectIsStreaming);
  const editingMessageId = useAppSelector(selectEditingMessageId);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { startStreaming, stopStreaming } = useChatStream();

  useEffect(() => {
    if (editingMessageId) {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(value.length, value.length);
    }
  }, [editingMessageId, value.length]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    startStreaming(value);
    dispatch(setComposerValue(""));
    dispatch(setEditingMessageId(null));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-b from-transparent to-[#05070f] pb-10 pt-4">
      <div className="mx-auto flex max-w-4xl flex-col gap-3">
        {editingMessageId && (
          <div className="flex items-center justify-between rounded-xl border border-[#f4d35e]/20 bg-[#f4d35e]/5 px-4 py-2 text-xs text-[#f7e9bc]">
            <span>Editing previous prompt</span>
            <button
              type="button"
              onClick={() => dispatch(setEditingMessageId(null))}
              className="text-[#f4d35e] underline decoration-dotted hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}
        <textarea
          ref={textareaRef}
          className="min-h-[110px] w-full resize-none rounded-3xl border border-[#1b2335] bg-[#0b1220] px-5 py-4 text-base text-white placeholder:text-white/40 focus:border-[#f4d35e]/40 focus:outline-none"
          placeholder="Message the coding agent..."
          value={value}
          onChange={(event) => dispatch(setComposerValue(event.target.value))}
          disabled={isStreaming}
        />
        <div className="flex items-center justify-end gap-2">
          {isStreaming && (
            <button
              type="button"
              onClick={stopStreaming}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/10"
            >
              Stop generating
            </button>
          )}
          <button
            type="submit"
            disabled={!value.trim() || isStreaming}
            className="rounded-lg bg-[#f4d35e] px-6 py-2 text-sm font-semibold text-[#2b1d07] transition hover:bg-[#f2c94c] disabled:cursor-not-allowed disabled:bg-[#f4d35e]/50"
          >
            {editingMessageId ? "Update & Send" : "Send"}
          </button>
        </div>
        <p className="text-center text-xs text-white/40">
          Gemini 2.5 can make mistakes. Please verify code before running in production.
        </p>
      </div>
    </form>
  );
}
