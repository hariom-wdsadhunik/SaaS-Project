import { CompletionResponse } from "../types";

export interface NormalizedAIResponse {
  id: string;
  provider: string;
  model: string;
  text: string;
  tokensUsed: number;
  timestamp: string;
}

export const ResponseNormalizer = {
  normalizeCompletion(response: CompletionResponse): NormalizedAIResponse {
    return {
      id: response.id,
      provider: response.provider,
      model: response.model,
      text: response.content,
      tokensUsed: response.usage.totalTokens,
      timestamp: response.timestamp,
    };
  },
};
