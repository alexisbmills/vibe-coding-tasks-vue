import { useAuthStore } from '@/stores/auth';

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
