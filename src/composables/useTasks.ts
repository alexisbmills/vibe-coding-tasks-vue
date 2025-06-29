import { ref, computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import { apiClient } from '@/services/api';
import type { CreateTaskRequest, UpdateTaskRequest, TaskFilters, TaskResponse } from '@/types/api';

export function useTasks() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const filters = ref<TaskFilters>({
    search: '',
    isArchived: false,
    pageSize: 20,
    currentPage: 1,
  });

  const tasksQuery = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => apiClient.getTasks(filters.value),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const tasks = computed(() => tasksQuery.data.value?.tasks || []);
  const pagination = computed(() => tasksQuery.data.value?.pagination);

  const createTaskMutation = useMutation({
    mutationFn: (data: CreateTaskRequest) => apiClient.createTask(data),
    onMutate: async (newTask) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks', filters.value]);

      // Optimistically update
      if (previousTasks) {
        const optimisticTask: TaskResponse = {
          id: `temp-${Date.now()}`,
          userId: '',
          name: newTask.name,
          notes: newTask.notes,
          isCompleted: false,
          completedAt: null,
          isArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        queryClient.setQueryData(['tasks', filters.value], (old: any) => ({
          ...old,
          tasks: [optimisticTask, ...(old?.tasks || [])],
          pagination: {
            ...old?.pagination,
            totalTasks: (old?.pagination?.totalTasks || 0) + 1,
          },
        }));
      }

      return { previousTasks };
    },
    onError: (error, newTask, context) => {
      // Revert optimistic update on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', filters.value], context.previousTasks);
      }
      
      const message = error.response?.data?.detail || 'Failed to create task';
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 5000,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Task created successfully!',
        life: 3000,
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) => apiClient.updateTask(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      const previousTasks = queryClient.getQueryData(['tasks', filters.value]);
      
      // Optimistically update
      queryClient.setQueryData(['tasks', filters.value], (old: any) => {
        if (!old?.tasks) return old;
        
        return {
          ...old,
          tasks: old.tasks.map((task: TaskResponse) =>
            task.id === id
              ? {
                  ...task,
                  ...data,
                  completedAt: data.isCompleted && !task.isCompleted ? new Date().toISOString() : task.completedAt,
                  updatedAt: new Date().toISOString(),
                }
              : task
          ),
        };
      });

      return { previousTasks };
    },
    onError: (error, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', filters.value], context.previousTasks);
      }
      
      const message = error.response?.data?.detail || 'Failed to update task';
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 5000,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Task updated successfully!',
        life: 3000,
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => apiClient.deleteTask(id),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      
      const previousTasks = queryClient.getQueryData(['tasks', filters.value]);
      
      // Optimistically remove task
      queryClient.setQueryData(['tasks', filters.value], (old: any) => {
        if (!old?.tasks) return old;
        
        return {
          ...old,
          tasks: old.tasks.filter((task: TaskResponse) => task.id !== taskId),
          pagination: {
            ...old.pagination,
            totalTasks: Math.max((old.pagination?.totalTasks || 0) - 1, 0),
          },
        };
      });

      return { previousTasks };
    },
    onError: (error, taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', filters.value], context.previousTasks);
      }
      
      const message = error.response?.data?.detail || 'Failed to delete task';
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 5000,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Task deleted successfully!',
        life: 3000,
      });
    },
  });

  const updateFilters = (newFilters: Partial<TaskFilters>) => {
    filters.value = { ...filters.value, ...newFilters, currentPage: 1 };
  };

  const resetFilters = () => {
    filters.value = {
      search: '',
      isArchived: false,
      pageSize: 20,
      currentPage: 1,
    };
  };

  return {
    tasks,
    pagination,
    filters: filters.value,
    isLoading: tasksQuery.isLoading,
    isError: tasksQuery.isError,
    error: tasksQuery.error,
    createTask: createTaskMutation,
    updateTask: updateTaskMutation,
    deleteTask: deleteTaskMutation,
    updateFilters,
    resetFilters,
    refetch: tasksQuery.refetch,
  };
}