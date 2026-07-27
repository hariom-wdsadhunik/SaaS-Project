import { CompletionRequest, CompletionResponse } from "../types";
import { TokenEstimator } from "./TokenEstimator";
import { platformAuditLogger } from "@/platform/audit";

export const CompletionService = {
  async generateCompletion(req: CompletionRequest): Promise<CompletionResponse> {
    await new Promise((res) => setTimeout(res, 200));

    const mockContent = `[LeadPilot AI Assistant] Processed request for prompt "${req.prompt.slice(0, 35)}..." via ${req.provider} model (${req.model}). Score: HIGH (88/100). Recommended Next Action: Schedule VIP Walkthrough.`;

    const usage = TokenEstimator.calculateUsage(req.prompt, mockContent);

    const response: CompletionResponse = {
      id: `cmpl-${Date.now()}`,
      provider: req.provider,
      model: req.model,
      content: mockContent,
      usage,
      finishReason: "stop",
      timestamp: new Date().toISOString(),
    };

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "SYSTEM",
      entityIds: [response.id],
      payload: { provider: req.provider, model: req.model, tokens: usage.totalTokens },
      timestamp: new Date().toISOString(),
    });

    return response;
  },
};
