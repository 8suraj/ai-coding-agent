import { useEffect, useRef } from "react";

import { MessageBubble } from "./MessageBubble";
import { useChatStream } from "@/hooks/useChatStream";
import { setComposerValue, setEditingMessageId } from "@/store/chatSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectEditingMessageId, selectMessages } from "@/store/selectors";

export function MessageList() {
  const messages = useAppSelector(selectMessages);
  const editingMessageId = useAppSelector(selectEditingMessageId);
  const dispatch = useAppDispatch();
  const { startStreaming } = useChatStream();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleResend = (content: string) => {
    startStreaming(content);
  };

  const handleEdit = (id: string, content: string) => {
    dispatch(setComposerValue(content));
    dispatch(setEditingMessageId(id));
  };

  return (
    <div className="space-y-4 p-6">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isEditing={editingMessageId === message.id}
          onResend={handleResend}
          onEdit={handleEdit}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
