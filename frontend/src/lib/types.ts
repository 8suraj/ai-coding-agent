export type Role = "user" | "assistant" | "system";

export interface ChatMessage {
  role: Role;
  content: string;
  id: string;
}

export interface ChatArtifact {
  language?: string | null;
  code: string;
}

export interface ChatChunkToken {
  type: "token";
  content: string;
}

export interface ChatChunkComplete {
  type: "complete";
  content: string;
  artifact?: ChatArtifact | null;
}

export interface ChatChunkError {
  type: "error";
  error: string;
}

export type ChatChunk = ChatChunkToken | ChatChunkComplete | ChatChunkError;
