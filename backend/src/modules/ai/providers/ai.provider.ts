import OpenAI from "openai";
import {
  APIConnectionError,
  AuthenticationError,
  NotFoundError,
  RateLimitError,
  BadRequestError,
} from "openai";
import { logger } from "../../../lib/logger.js";
import { env } from "../../../config/env.js";
import { provider } from "./index.js";
import { AIProviderError } from "./ai.erros.js";

const aiProvider = async (messages: OpenAI.ChatCompletionMessageParam[]) => {
  try {
    const response = await provider.chat.completions.create({
      model: env.ai.model,
      messages,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new AIProviderError("AI returned an empty response", "EMPTY_RESPONSE");
    }

    return content;
  } catch (error) {
    throw mapAIError(error);
  }
};

function mapAIError(error: unknown): AIProviderError {
  if (error instanceof AIProviderError) {
    return error;
  }

  if (error instanceof APIConnectionError) {
    logger.error(
      { err: error, baseUrl: env.ai.baseUrl, model: env.ai.model },
      "AI provider connection failed",
    );
    return new AIProviderError(
      "Could not reach the AI service. Is Ollama running?",
      "CONNECTION_ERROR",
      error,
      true,
    );
  }

  if (error instanceof AuthenticationError) {
    logger.error({ err: error, model: env.ai.model }, "AI authentication failed");
    return new AIProviderError("Invalid AI API key", "AUTH_ERROR", error);
  }

  if (error instanceof NotFoundError) {
    logger.error({ err: error, model: env.ai.model }, "AI model not found");
    return new AIProviderError(
      `Model "${env.ai.model}" was not found`,
      "MODEL_NOT_FOUND",
      error,
    );
  }

  if (error instanceof RateLimitError) {
    logger.warn({ err: error, model: env.ai.model }, "AI rate limit hit");
    return new AIProviderError(
      "AI service is busy. Please try again shortly.",
      "RATE_LIMIT",
      error,
      true,
    );
  }

  if (error instanceof BadRequestError) {
    logger.error({ err: error, model: env.ai.model }, "Invalid AI request");
    return new AIProviderError("Invalid AI request", "BAD_REQUEST", error);
  }

  if (error instanceof OpenAI.APIError) {
    logger.error(
      {
        err: error,
        status: error.status,
        requestId: error.requestID,
        model: env.ai.model,
      },
      "AI provider API error",
    );
    return new AIProviderError(
      "AI service returned an error",
      "PROVIDER_ERROR",
      error,
      error.status ? error.status >= 500 : false,
    );
  }

  logger.error({ err: error, model: env.ai.model }, "Unexpected AI error");
  return new AIProviderError("Unexpected AI error", "PROVIDER_ERROR", error);
}

export default aiProvider;
