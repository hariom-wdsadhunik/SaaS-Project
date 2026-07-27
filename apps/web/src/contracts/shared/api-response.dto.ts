export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PagedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

export interface FilterOptions {
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface SearchQuery {
  term?: string;
  filters?: FilterOptions;
  sort?: SortOptions;
  page?: number;
  pageSize?: number;
}
