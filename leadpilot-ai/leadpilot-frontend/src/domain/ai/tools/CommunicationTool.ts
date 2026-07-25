import { AITool } from "./Tool";
import { ToolResult } from "./ToolResult";
import { ToolPermissionLevel } from "./ToolPermission";

export class CommunicationTool implements AITool {
  name(): string {
    return "omnichannel_dispatch_tool";
  }

  description(): string {
    return "Dispatches WhatsApp/Email messages to high-intent leads.";
  }

  category(): string {
    return "Communication";
  }

  requiredPermission(): ToolPermissionLevel {
    return "WRITE";
  }

  validate(params: Record<string, unknown>): boolean {
    return typeof params.recipient === "string" && typeof params.content === "string";
  }

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    await new Promise((res) => setTimeout(res, 100));
    return {
      toolName: this.name(),
      success: true,
      data: { messageId: `msg-tool-${Date.now()}`, recipient: params.recipient, status: "SENT" },
      timestamp: new Date().toISOString(),
    };
  }
}
