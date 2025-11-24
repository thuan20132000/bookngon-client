// API Response types
export interface ApiResponse<T> {
  success: boolean;
  results?: T;
  message?: string;
  errors?: Record<string, string[]>;
  metadata?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
  metadata?: Record<string, unknown>;
}