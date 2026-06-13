import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/stores/auth';
import { logoutUserSimple } from '@/utils/logoutUser';
import type {
  RegisterRequest,
  LoginRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  UserProfileUpdateRequest,
  TaskResponse,
  UserProfileResponse,
  PaginatedTasksResponse,
  LoginResponse,
  TaskFilters,
} from '@/types/api';

class ApiClient {
  private client: AxiosInstance;
  private toast: any;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for global error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logoutUserSimple();
          // Redirect to login will be handled by router guard
        } else if (error.response?.status >= 500) {
          this.showErrorToast('Server error occurred. Please try again later.');
        }
        return Promise.reject(error);
      }
    );
  }

  private showErrorToast(message: string) {
    // This will be initialized when the app starts
    if (this.toast) {
      this.toast.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 5000,
      });
    }
  }

  setToast(toast: any) {
    this.toast = toast;
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<UserProfileResponse> {
    const response = await this.client.post<UserProfileResponse>('/api/v1/auth/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post('/api/v1/auth/login', data);
    // The API returns a token, but we need to extract it from headers or response
    const token = response.headers.authorization?.replace('Bearer ', '') || response.data.token;

    // Get user profile after login
    const userResponse = await this.client.get<UserProfileResponse>('/api/v1/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      token,
      user: userResponse.data,
    };
  }

  // User profile endpoints
  async getUserProfile(): Promise<UserProfileResponse> {
    const response = await this.client.get<UserProfileResponse>('/api/v1/users/me');
    return response.data;
  }

  async updateUserProfile(data: UserProfileUpdateRequest): Promise<UserProfileResponse> {
    const response = await this.client.put<UserProfileResponse>('/api/v1/users/me', data);
    return response.data;
  }

  // Task endpoints
  async getTasks(filters: TaskFilters = {}): Promise<PaginatedTasksResponse> {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.isCompleted !== undefined) params.append('isCompleted', filters.isCompleted.toString());
    if (filters.isArchived !== undefined) params.append('isArchived', filters.isArchived.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.currentPage) params.append('currentPage', filters.currentPage.toString());

    const response = await this.client.get<PaginatedTasksResponse>(`/api/v1/tasks?${params.toString()}`);
    return response.data;
  }

  async getTask(id: string): Promise<TaskResponse> {
    const response = await this.client.get<TaskResponse>(`/api/v1/tasks/${id}`);
    return response.data;
  }

  async createTask(data: CreateTaskRequest): Promise<TaskResponse> {
    const response = await this.client.post<TaskResponse>('/api/v1/tasks', data);
    return response.data;
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<TaskResponse> {
    const response = await this.client.put<TaskResponse>(`/api/v1/tasks/${id}`, data);
    return response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await this.client.delete(`/api/v1/tasks/${id}`);
  }
}

export const apiClient = new ApiClient();