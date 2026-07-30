import { TokenUsage } from "../types";

export const TokenEstimator = {
  estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  },

  calculateUsage(promptText: string, completionText: string): TokenUsage {
    const promptTokens = this.estimateTokens(promptText);
    const completionTokens = this.estimateTokens(completionText);
    return {
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
    };
  },
};
