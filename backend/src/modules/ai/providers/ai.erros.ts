import type { AIErrorCode } from "../shared/types.js";

export type { AIErrorCode };

export class AIProviderError extends Error {
  constructor(
    message: string,
    public readonly code: AIErrorCode,
    public readonly cause?: unknown,
    public readonly retryable = false,
  ) {
    super(message);
    this.name = "AIProviderError";
  }
}