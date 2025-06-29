// Auto-generated types based on swagger.json
export interface RegisterRequest {
  username: string | null;
  password: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface LoginRequest {
  username: string | null;
  password: string | null;
}

export interface CreateTaskRequest {
  name: string | null;
  notes: string | null;
}

export interface UpdateTaskRequest {
  name: string | null;
  notes: string | null;
  isCompleted: boolean;
  isArchived: boolean;
}

export interface UserProfileUpdateRequest {
  firstName: string | null;
  lastName: string | null;
}

export interface TaskResponse {
  id: string;
  userId: string;
  name: string | null;
  notes: string | null;
  isCompleted: boolean;
  completedAt: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMetadata {
  pageSize: number;
  currentPage: number;
  totalTasks: number;
  totalPages: number;
}

export interface PaginatedTasksResponse {
  tasks: TaskResponse[] | null;
  pagination: PaginationMetadata;
}

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
}

export interface LoginResponse {
  token: string;
  user: UserProfileResponse;
}

export interface TaskFilters {
  search?: string;
  isCompleted?: boolean;
  isArchived?: boolean;
  pageSize?: number;
  currentPage?: number;
}