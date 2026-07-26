import { EntityReference, FormattedAIResponse } from "./types";

export class AIResponseFormatter {
  public static formatResponse(rawText: string, citations: EntityReference[] = []): FormattedAIResponse {
    const suggestedActions = [
      { label: "Create Follow-up Task", actionKey: "CREATE_TASK" },
      { label: "Schedule Walkthrough", actionKey: "SCHEDULE_APPOINTMENT" },
      { label: "Dispatch WhatsApp Message", actionKey: "SEND_WHATSAPP" },
    ];

    return {
      message: rawText,
      citations,
      suggestedActions,
    };
  }
}
