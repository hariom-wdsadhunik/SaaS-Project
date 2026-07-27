import { EmbeddingRequest, EmbeddingResponse } from "../types";
import { TokenEstimator } from "./TokenEstimator";

export const EmbeddingService = {
  async generateEmbedding(req: EmbeddingRequest): Promise<EmbeddingResponse> {
    await new Promise((res) => setTimeout(res, 150));

    const mockVector = Array.from({ length: 1536 }, () => Number(Math.random().toFixed(4)));
    const totalPromptText = req.input.join(" ");
    const usage = TokenEstimator.calculateUsage(totalPromptText, "");

    return {
      embeddings: [mockVector],
      usage,
    };
  },
};
