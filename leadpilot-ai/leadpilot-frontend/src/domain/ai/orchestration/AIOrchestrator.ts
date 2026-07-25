import { ModelRouter } from "./ModelRouter";
import { ResponseNormalizer, NormalizedAIResponse } from "./ResponseNormalizer";
import { CompletionService } from "../services/CompletionService";
import { EmbeddingService } from "../services/EmbeddingService";
import { CompletionRequest, EmbeddingResponse } from "../types";

export const AIOrchestrator = {
  async complete(prompt: string, taskType: "summary" | "chat" | "completion" = "completion"): Promise<NormalizedAIResponse> {
    const route = ModelRouter.route(taskType);
    const req: CompletionRequest = {
      provider: route.provider,
      model: route.model,
      prompt,
    };

    const res = await CompletionService.generateCompletion(req);
    return ResponseNormalizer.normalizeCompletion(res);
  },

  async embed(textArray: string[]): Promise<EmbeddingResponse> {
    const route = ModelRouter.route("embedding");
    return EmbeddingService.generateEmbedding({
      provider: route.provider,
      model: route.model,
      input: textArray,
    });
  },
};
