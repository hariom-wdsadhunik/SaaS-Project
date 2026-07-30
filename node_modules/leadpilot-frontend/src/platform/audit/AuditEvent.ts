export type AuditCategory = "LEAD" | "DEAL" | "TASK" | "APPOINTMENT" | "AUTH" | "SYSTEM";

export type AuditActionType = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "PERMISSION_CHANGE";

export interface AuditRecord {
  id: string;
  category: AuditCategory;
  action: AuditActionType;
  entityId: string;
  actorId: string;
  actorEmail?: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  metadata?: Record<string, unknown>;
  timestamp: string;
}
