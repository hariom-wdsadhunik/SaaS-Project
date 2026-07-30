export type ToolPermissionLevel = "READ" | "WRITE" | "ADMIN";

export interface ToolPermissionCheck {
  permission: ToolPermissionLevel;
  role: string;
}
