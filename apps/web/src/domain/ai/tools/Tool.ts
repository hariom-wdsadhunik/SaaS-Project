import { ToolResult } from "./ToolResult";
import { ToolPermissionLevel } from "./ToolPermission";

export interface AITool {
  name(): string;
  description(): string;
  category(): string;
  requiredPermission(): ToolPermissionLevel;
  validate(params: Record<string, unknown>): boolean;
  execute(params: Record<string, unknown>): Promise<ToolResult>;
}
