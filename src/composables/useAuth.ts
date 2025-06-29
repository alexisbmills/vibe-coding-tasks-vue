import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth';
import { apiClient } from '@/services/api';
import { logoutUser, logoutUserSimple } from '@/utils/logoutUser';
import type { RegisterRequest, LoginRequest, UserProfileUpdateRequest } from '@/types/api';

export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => apiClient.register(data),
    onSuccess: () => {
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Account created successfully! Please log in.',
        life: 5000,
      });
      router.push('/login');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Registration failed';
      toast.add({
        severity: 'error',
        summary: 'Registration Failed',
        detail: message,
        life: 5000,
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => apiClient.login(data),
    onSuccess: (response) => {
      authStore.setAuth(response.token, response.user);
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Logged in successfully!',
        life: 3000,
      });
      router.push('/tasks');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Login failed';
      toast.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: message,
        life: 5000,
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UserProfileUpdateRequest) => apiClient.updateUserProfile(data),
    onSuccess: (updatedUser) => {
      authStore.updateUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Profile updated successfully!',
        life: 3000,
      });
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Profile update failed';
      toast.add({
        severity: 'error',
        summary: 'Update Failed',
        detail: message,
        life: 5000,
      });
    },
  });

  const logout = () => {
    logoutUser();
  };

  return {
    register: registerMutation,
    login: loginMutation,
    updateProfile: updateProfileMutation,
    logout,
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
  };
}