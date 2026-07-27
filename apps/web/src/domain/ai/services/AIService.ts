import { CompletionRequest, CompletionResponse } from "../types";
import { CompletionService } from "./CompletionService";

export const AIService = {
  async complete(req: CompletionRequest): Promise<CompletionResponse> {
    return CompletionService.generateCompletion(req);
  },
};
