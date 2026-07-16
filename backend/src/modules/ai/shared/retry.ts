import { AIProviderError } from "../providers/ai.erros.js";

async function retry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
    let lastError: unknown;
  
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (!(error instanceof AIProviderError) || !error.retryable || attempt === maxAttempts) {
          throw error;
        }
        await new Promise((r) => setTimeout(r, attempt * 500));
      }
    }
  
    throw lastError;
  }
  
export default retry;
