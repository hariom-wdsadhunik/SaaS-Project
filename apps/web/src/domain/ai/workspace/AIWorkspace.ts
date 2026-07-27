import { AIConversation } from "./AIConversation";
import { AIContextBuilder } from "./AIContextBuilder";
import { AIResponseFormatter } from "./AIResponseFormatter";
import { ConversationMemory } from "./ConversationMemory";
import { EntityReference, FormattedAIResponse } from "./types";

export class AIWorkspace {
  public static async processQuery(
    conversationId: string,
    organizationId: string,
    userId: string,
    userQuery: string,
    activeEntity?: EntityReference
  ): Promise<FormattedAIResponse> {
    let conversation = ConversationMemory.getConversation(conversationId);
    if (!conversation) {
      conversation = new AIConversation(conversationId, organizationId, userId);
    }

    conversation.addMessage("USER", userQuery, activeEntity ? [activeEntity] : undefined);

    const context = await AIContextBuilder.buildContext(organizationId, userId, activeEntity);

    const responseText = `[AI Copilot Workspace] Processed query: "${userQuery}". Context Summary: ${context.recentActivitySummary}. Found ${context.relatedEntities.length} related CRM entities in current workspace.`;

    const formatted = AIResponseFormatter.formatResponse(responseText, context.relatedEntities);

    conversation.addMessage("ASSISTANT", formatted.message, formatted.citations);
    ConversationMemory.saveConversation(conversation);

    return formatted;
  }
}
