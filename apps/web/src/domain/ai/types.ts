export type AIProvider = "OPENAI" | "ANTHROPIC" | "GOOGLE" | "OLLAMA" | "MOCK";

export type AIModelFamily = "GPT" | "CLAUDE" | "GEMINI" | "LLAMA" | "MISTRAL";

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AIMessage {
  id: string;
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  timestamp: string;
}

export interface AIConversation {
  id: string;
  title: string;
  provider: AIProvider;
  model: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description?: string;
  systemPrompt: string;
  userPromptTemplate: string;
  variables: string[];
}

export interface CompletionRequest {
  conversationId?: string;
  provider: AIProvider;
  model: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface CompletionResponse {
  id: string;
  provider: AIProvider;
  model: string;
  content: string;
  usage: TokenUsage;
  finishReason: "stop" | "length" | "tool_calls";
  timestamp: string;
}

export interface EmbeddingRequest {
  provider: AIProvider;
  model: string;
  input: string[];
}

export interface EmbeddingResponse {
  embeddings: number[][];
  usage: TokenUsage;
}
