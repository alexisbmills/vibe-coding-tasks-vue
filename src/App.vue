<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import { apiClient } from '@/services/api';
import AppNavbar from '@/components/AppNavbar.vue';
import Toast from 'primevue/toast';

const toast = useToast();

onMounted(() => {
  // Set up toast for API client
  apiClient.setToast(toast);
});
</script>

<template>
  <div id="app" class="min-h-screen bg-surface-50">
    <AppNavbar />
    <main class="main-content">
      <RouterView />
    </main>
    <Toast position="top-right" />
  </div>
</template>

<style scoped>
.main-content {
  padding-top: 4rem; /* Account for fixed navbar */
  min-height: calc(100vh - 4rem);
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 3.5rem;
    min-height: calc(100vh - 3.5rem);
  }
}
</style>