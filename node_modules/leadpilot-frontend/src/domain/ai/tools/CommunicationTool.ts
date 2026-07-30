import { AITool } from "./Tool";
import { ToolResult } from "./ToolResult";
import { ToolPermissionLevel } from "./ToolPermission";
import { supabaseCommunicationRepository } from "@/infrastructure/repositories/SupabaseCommunicationRepository";

export class CommunicationTool implements AITool {
  public name(): string {
    return "communication_intelligence_tool";
  }

  public description(): string {
    return "Omnichannel AI messaging tool for conversation analysis, sentiment scoring, and reply suggestions.";
  }

  public category(): string {
    return "COMMUNICATION";
  }

  public requiredPermission(): ToolPermissionLevel {
    return "READ";
  }

  public validate(params: Record<string, unknown>): boolean {
    return !!params.conversationId || !!params.query;
  }

  public async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const conversationId = (params.conversationId as string) || "conv-101";
    const action = (params.action as string) || "GET_SUMMARY";
    const query = (params.query as string) || "";

    const conversation = await supabaseCommunicationRepository.getConversation(conversationId);

    let outputData: Record<string, unknown> = {};

    switch (action) {
      case "GET_SUMMARY":
        outputData = {
          summary: {
            conversationId,
            subject: conversation?.subject || "VIP Walkthrough",
            channel: conversation?.channel || "WHATSAPP",
            unreadCount: conversation?.unreadCount || 0,
            sentimentPlaceholder: "URGENT",
          },
        };
        break;

      case "SUGGEST_REPLY":
        outputData = {
          suggestedReply: `Hi, thank you for reaching out! I would be delighted to confirm your walkthrough for ${conversation?.subject || "the property"}.`,
        };
        break;

      case "SEARCH": {
        const searchResults = await supabaseCommunicationRepository.searchMessages(query);
        outputData = { searchResults };
        break;
      }

      default:
        outputData = { sentiment: "POSITIVE" };
        break;
    }

    return {
      toolName: this.name(),
      success: true,
      data: outputData,
      timestamp: new Date().toISOString(),
    };
  }
}
