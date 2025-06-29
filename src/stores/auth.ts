import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { UserProfileResponse } from '@/types/api';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth-token'));
  const user = ref<UserProfileResponse | null>(
    localStorage.getItem('auth-user') 
      ? JSON.parse(localStorage.getItem('auth-user')!) 
      : null
  );

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const setAuth = (authToken: string, userData: UserProfileResponse) => {
    token.value = authToken;
    user.value = userData;
    localStorage.setItem('auth-token', authToken);
    localStorage.setItem('auth-user', JSON.stringify(userData));
  };

  const updateUser = (userData: UserProfileResponse) => {
    user.value = userData;
    localStorage.setItem('auth-user', JSON.stringify(userData));
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
  };

  return {
    token,
    user,
    isAuthenticated,
    setAuth,
    updateUser,
    logout,
  };
});