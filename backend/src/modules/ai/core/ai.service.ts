import aiProvider from "../providers/ai.provider.js";
import { logger } from "../../../lib/logger.js";
import { AIProviderError } from "../providers/ai.erros.js";

const aiService = async (request: any) => {
  try {
    return await aiProvider(request.messages);
  } catch (error) {
    if (error instanceof AIProviderError) {
      logger.warn({ code: error.code }, error.message);
      return {
        error: error.message,
        retryable: error.retryable,
      };
    }

    logger.error({ err: error }, "Unhandled AI service error");
    return {
      error: "Something went wrong. Please try again.",
      retryable: true,
    };
  }
};

export default aiService;
