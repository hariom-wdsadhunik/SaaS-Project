import { AITool } from "./Tool";
import { ToolResult } from "./ToolResult";
import { ToolPermissionLevel } from "./ToolPermission";

export class TaskTool implements AITool {
  name(): string {
    return "task_generation_tool";
  }

  description(): string {
    return "Automatically generates follow-up tasks for assigned broker agents.";
  }

  category(): string {
    return "Tasks";
  }

  requiredPermission(): ToolPermissionLevel {
    return "WRITE";
  }

  validate(params: Record<string, unknown>): boolean {
    return typeof params.title === "string";
  }

  async execute(params: Record<string, unknown>): Promise<ToolResult> {
    await new Promise((res) => setTimeout(res, 100));
    return {
      toolName: this.name(),
      success: true,
      data: { taskId: `task-gen-${Date.now()}`, title: params.title, status: "OPEN" },
      timestamp: new Date().toISOString(),
    };
  }
}
