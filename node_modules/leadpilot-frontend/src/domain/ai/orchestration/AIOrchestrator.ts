import { ModelRouter } from "./ModelRouter";
import { ResponseNormalizer, NormalizedAIResponse } from "./ResponseNormalizer";
import { CompletionService } from "../services/CompletionService";
import { EmbeddingService } from "../services/EmbeddingService";
import { MemoryService } from "../memory/MemoryService";
import { CompletionRequest, EmbeddingResponse } from "../types";
import { eventBus } from "@/platform/events/EventBus";
import { DOMAIN_EVENTS } from "@/platform/events/EventRegistry";

export const AIOrchestrator = {
  initEventListener(): void {
    eventBus.subscribe(DOMAIN_EVENTS.TASK_COMPLETED, (evt) => {
      console.log(`[AIOrchestrator Architecture Hook] Event received: ${evt.eventName}. Preparing automated follow-up suggestion...`);
    });

    eventBus.subscribe(DOMAIN_EVENTS.DEAL_WON, (evt) => {
      console.log(`[AIOrchestrator Architecture Hook] Event received: ${evt.eventName}. Recommending customer retention sequence...`);
    });

    eventBus.subscribe(DOMAIN_EVENTS.APPOINTMENT_SCHEDULED, (evt) => {
      console.log(`[AIOrchestrator Architecture Hook] Event received: ${evt.eventName}. Drafting meeting prep summary...`);
    });
  },

  async complete(prompt: string, taskType: "summary" | "chat" | "completion" = "completion"): Promise<NormalizedAIResponse> {
    const memoryContext = MemoryService.getRelevantMemory(prompt);
    const enrichedPrompt = `${memoryContext}\n\n[USER PROMPT]: ${prompt}`;

    const route = ModelRouter.route(taskType);
    const req: CompletionRequest = {
      provider: route.provider,
      model: route.model,
      prompt: enrichedPrompt,
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

AIOrchestrator.initEventListener();
