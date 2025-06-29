import { useAuthStore } from '@/stores/auth';
import { useQueryClient } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

/**
 * Logs out the user, clears cache, shows a toast, and redirects to login.
 * This function is intended to be called from within a Vue component or composable.
 */
export function logoutUser() {
    const authStore = useAuthStore();
    const queryClient = useQueryClient();
    const router = useRouter();
    const toast = useToast();

    authStore.logout();
    queryClient.clear();
    toast.add({
        severity: 'info',
        summary: 'Logged Out',
        detail: 'You have been logged out successfully.',
        life: 3000,
    });
    router.push('/login');
}

/**
 * Logs out the user and redirects to login (for use outside Vue setup, e.g. Axios interceptors).
 * This version does not use hooks and should be called in non-setup code.
 */
export function logoutUserSimple() {
    // Only clear auth store; router guard will handle redirect
    const authStore = useAuthStore();
    authStore.logout();
    // Optionally, clear localStorage/sessionStorage if used
}
