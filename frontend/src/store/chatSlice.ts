import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

import type { ChatArtifact, ChatMessage } from "@/lib/types";
import { createMessage } from "@/lib/utils";

export type ViewMode = "code" | "preview";

export interface ChatState {
  sessionId: string;
  messages: ChatMessage[];
  isStreaming: boolean;
  sidebarOpen: boolean;
  currentArtifact: ChatArtifact | null;
  viewMode: ViewMode;
  error: string | null;
  composerValue: string;
  editingMessageId: string | null;
}

const createIntroMessage = () =>
  createMessage(
    "assistant",
    "Hi! I’m your Claude-style coding agent powered by Gemini. Ask me to build or refactor UI, APIs, data pipelines, or anything code-related."
  );

const createInitialState = (): ChatState => ({
  sessionId: nanoid(),
  messages: [createIntroMessage()],
  isStreaming: false,
  sidebarOpen: false,
  currentArtifact: null,
  viewMode: "code",
  error: null,
  composerValue: "",
  editingMessageId: null,
});

const appendToLastAssistant = (messages: ChatMessage[], content: string, replace = false) => {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === "assistant") {
      messages[i] = {
        ...messages[i],
        content: replace ? content : `${messages[i].content}${content}`,
      };
      break;
    }
  }
};

const chatSlice = createSlice({
  name: "chat",
  initialState: createInitialState(),
  reducers: {
    appendUserMessage(state, action: PayloadAction<string>) {
      state.messages.push(createMessage("user", action.payload));
      state.error = null;
    },
    appendAssistantPlaceholder(state) {
      state.messages.push(createMessage("assistant", ""));
    },
    appendToLastAssistantContent(state, action: PayloadAction<string>) {
      appendToLastAssistant(state.messages, action.payload);
    },
    setLastAssistantContent(state, action: PayloadAction<string>) {
      appendToLastAssistant(state.messages, action.payload, true);
    },
    setLastAssistantContentIfEmpty(state, action: PayloadAction<string>) {
      for (let i = state.messages.length - 1; i >= 0; i -= 1) {
        if (state.messages[i].role === "assistant") {
          if (!state.messages[i].content) {
            state.messages[i] = { ...state.messages[i], content: action.payload };
          }
          break;
        }
      }
    },
    setStreaming(state, action: PayloadAction<boolean>) {
      state.isStreaming = action.payload;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.viewMode = action.payload;
    },
    setArtifact(state, action: PayloadAction<ChatArtifact | null>) {
      state.currentArtifact = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setComposerValue(state, action: PayloadAction<string>) {
      state.composerValue = action.payload;
    },
    setEditingMessageId(state, action: PayloadAction<string | null>) {
      state.editingMessageId = action.payload;
    },
    resetConversation() {
      return createInitialState();
    },
  },
});

export const {
  appendAssistantPlaceholder,
  appendToLastAssistantContent,
  appendUserMessage,
  resetConversation,
  setArtifact,
  setError,
  setLastAssistantContent,
  setLastAssistantContentIfEmpty,
  setSidebarOpen,
  setStreaming,
  setViewMode,
  setComposerValue,
  setEditingMessageId,
} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
