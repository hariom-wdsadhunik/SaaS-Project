import { AITool } from "./Tool";
import { ToolResult } from "./ToolResult";
import { ToolPermissionLevel } from "./ToolPermission";
import { supabaseContactRepository } from "@/infrastructure/repositories/SupabaseContactRepository";

export class ContactTool implements AITool {
  name(): string {
    return "contact_intelligence_tool";
  }

  description(): string {
    return "Analyzes complete contact profiles including lead history, deals, timeline events, notes, and task interactions.";
  }

  category(): string {
    return "Contacts";
  }

  requiredPermission(): ToolPermissionLevel {
    return "READ";
  }

  validate(params: Record<string, unknown>): boolean {
    return typeof params.contactId === "string";
  }

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    const contactId = params.contactId as string;
    const contact = await supabaseContactRepository.getContactById(contactId);

    if (!contact) {
      return {
        toolName: this.name(),
        success: false,
        data: { error: `Contact record with ID ${contactId} not found in database.` },
        timestamp: new Date().toISOString(),
      };
    }

    const timelineEvents = await supabaseContactRepository.getTimelineEvents(contactId);

    return {
      toolName: this.name(),
      success: true,
      data: {
        contactId: contact.id,
        fullName: contact.fullName,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        jobTitle: contact.jobTitle,
        status: contact.status,
        isFavorite: contact.isFavorite,
        tags: contact.tags,
        notes: contact.notes,
        leadId: contact.leadId || "Direct Registration",
        timelineCount: timelineEvents.length,
        recentTimeline: timelineEvents.slice(0, 5),
        aiSummary: `High-value client profile with ${contact.tags.join(", ")} classification. Active relationship managed by ${contact.assignedAgentName}.`,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
