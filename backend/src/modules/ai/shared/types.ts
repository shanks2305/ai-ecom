export type MessageRole = "system" | "user" | "assistant" | "tool";

export type ToolCall = {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
};

export type ToolResult = {
  toolCallId: string;
  name: string;
  content: string;
  isError?: boolean;
};

export type ChatMessage = {
  role: MessageRole;
  content: string | null;
  name?: string;
  toolCallId?: string;
  toolCalls?: ToolCall[];
};

export type ToolDefinition = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
};

export type ChatRequest = {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: ToolDefinition[];
  stream?: boolean;
};

export type Usage = {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
};

export type FinishReason =
  | "stop"
  | "tool_calls"
  | "length"
  | "content_filter"
  | "error";

export type ChatResponse = {
  message: ChatMessage;
  usage?: Usage;
  finishReason: FinishReason;
  model: string;
};

export type StreamChunk = {
  type: "text" | "tool_call_delta" | "done";
  content?: string;
  toolCall?: Partial<ToolCall>;
  usage?: Usage;
  finishReason?: FinishReason;
};

export type AIProviderConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
  timeoutMs?: number;
};

export type AIErrorCode =
  | "CONFIG_ERROR"
  | "CONNECTION_ERROR"
  | "AUTH_ERROR"
  | "RATE_LIMIT"
  | "MODEL_NOT_FOUND"
  | "BAD_REQUEST"
  | "PROVIDER_ERROR"
  | "EMPTY_RESPONSE";

export type AIError = {
  code: AIErrorCode;
  message: string;
  retryable: boolean;
  cause?: unknown;
};
