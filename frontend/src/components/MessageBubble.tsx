import clsx from "classnames";

import type { ChatMessage } from "@/lib/types";
import { MarkdownMessage } from "@/components/MarkdownMessage";

interface Props {
  message: ChatMessage;
  onResend: (content: string) => void;
  onEdit: (id: string, content: string) => void;
  isEditing: boolean;
}

const roleLabel: Record<ChatMessage["role"], string> = {
  assistant: "Agent",
  user: "You",
  system: "System",
};

const roleAccent: Record<ChatMessage["role"], string> = {
  assistant: "bg-[#f4d35e]",
  user: "bg-[#6366f1]",
  system: "bg-[#9b59b6]",
};

export function MessageBubble({ message, onResend, onEdit, isEditing }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      className={clsx(
        "flex w-full items-start gap-4 rounded-3xl px-5 py-6 shadow-[0_15px_45px_rgba(0,0,0,0.35)]",
        isUser ? "bg-[#0a0f1b]" : "bg-[#121b2d]"
      )}
    >
      <div
        className={clsx(
          "mt-1 h-9 w-9 flex-shrink-0 rounded-full text-xs font-semibold uppercase tracking-wide text-white/90",
          isUser ? "bg-white/10 border border-white/20" : roleAccent[message.role]
        )}
      >
        <div className="flex h-full w-full items-center justify-center">
          {roleLabel[message.role].slice(0, 2)}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
          {roleLabel[message.role]}
        </p>
        <div className="mt-3 text-white">
          <MarkdownMessage content={message.content} />
        </div>
        {isUser && (
          <div className="mt-4 flex gap-3 text-xs text-white/80">
            <button
              type="button"
              onClick={() => onResend(message.content)}
              className="rounded-full border border-white/15 px-4 py-1.5 hover:border-white/30"
            >
              Resend
            </button>
            <button
              type="button"
              onClick={() => onEdit(message.id, message.content)}
              className="rounded-full border border-white/15 px-4 py-1.5 hover:border-white/30"
            >
              {isEditing ? "Editing…" : "Edit"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
