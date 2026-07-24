export type EntityId = string;

export type LoadingState = "idle" | "loading" | "success" | "error";

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}

export interface SortState {
  columnId: string;
  direction: "asc" | "desc";
}

export interface SelectionState {
  selectedRowIds: Record<string, boolean>;
  selectedCount: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface MutationResult<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export type EntityActionType =
  | "CREATE"
  | "UPDATE"
  | "ASSIGN"
  | "CHANGE_STATUS"
  | "ARCHIVE"
  | "DELETE";

export interface AuditEvent {
  action: EntityActionType;
  entityType: "LEAD" | "DEAL" | "PROPERTY" | "TASK" | "SYSTEM";
  entityIds: EntityId[];
  payload?: Record<string, unknown>;
  timestamp: string;
}
