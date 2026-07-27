export type EntityActionType =
  | "CREATE"
  | "UPDATE"
  | "ASSIGN"
  | "CHANGE_STATUS"
  | "ARCHIVE"
  | "DELETE";

export interface AuditLogEvent {
  action: EntityActionType;
  leadIds: string[];
  payload?: Record<string, unknown>;
  timestamp: string;
}

export interface AgentOption {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}
