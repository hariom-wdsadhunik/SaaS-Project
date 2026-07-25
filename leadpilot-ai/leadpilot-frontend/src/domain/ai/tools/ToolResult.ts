export interface ToolResult {
  toolName: string;
  success: boolean;
  data: Record<string, unknown>;
  error?: string;
  timestamp: string;
}
