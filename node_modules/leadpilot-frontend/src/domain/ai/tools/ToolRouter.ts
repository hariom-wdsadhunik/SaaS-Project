import { ToolExecutor } from "./ToolExecutor";
import { ToolResult } from "./ToolResult";

export const ToolRouter = {
  async dispatchToolCall(
    toolName: string,
    params: Record<string, unknown>,
    userRole: "ADMIN" | "AGENT" | "VIEWER" = "AGENT"
  ): Promise<ToolResult> {
    return ToolExecutor.executeTool(toolName, params, userRole);
  },
};
