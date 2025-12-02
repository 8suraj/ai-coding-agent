import type { RootState } from "@/store";

export const selectSessionId = (state: RootState) => state.chat.sessionId;
export const selectMessages = (state: RootState) => state.chat.messages;
export const selectIsStreaming = (state: RootState) => state.chat.isStreaming;
export const selectSidebarOpen = (state: RootState) => state.chat.sidebarOpen;
export const selectCurrentArtifact = (state: RootState) => state.chat.currentArtifact;
export const selectViewMode = (state: RootState) => state.chat.viewMode;
export const selectError = (state: RootState) => state.chat.error;
export const selectComposerValue = (state: RootState) => state.chat.composerValue;
export const selectEditingMessageId = (state: RootState) => state.chat.editingMessageId;
