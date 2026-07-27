import { toolRegistry } from "./ToolRegistry";
import { ToolResult } from "./ToolResult";
import { ToolPermissionLevel } from "./ToolPermission";
import { platformAuditLogger } from "@/platform/audit";

export const ToolExecutor = {
  async executeTool(
    name: string,
    params: Record<string, unknown>,
    userRole: "ADMIN" | "AGENT" | "VIEWER" = "AGENT"
  ): Promise<ToolResult> {
    const tool = toolRegistry.getTool(name);

    // Permission enforcement
    const requiredPermission: ToolPermissionLevel = tool.requiredPermission();
    if (requiredPermission === "ADMIN" && userRole !== "ADMIN") {
      throw new Error(`Insufficient permissions to execute tool ${name}. Required: ADMIN`);
    }

    if (!tool.validate(params)) {
      throw new Error(`Invalid parameters supplied for tool ${name}`);
    }

    const result = await tool.execute(params);

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "SYSTEM",
      entityIds: [name],
      payload: { toolName: name, params, success: result.success },
      timestamp: new Date().toISOString(),
    });

    return result;
  },
};
