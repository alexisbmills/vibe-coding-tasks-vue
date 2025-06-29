<script setup lang="ts">
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import Button from 'primevue/button';

const router = useRouter();

const goHome = () => {
  router.push('/tasks');
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="not-found-view">
    <div class="not-found-container">
      <Card class="not-found-card">
        <template #content>
          <div class="not-found-content">
            <div class="error-icon">
              <i class="pi pi-exclamation-triangle"></i>
            </div>
            
            <h1 class="error-title">404</h1>
            <h2 class="error-subtitle">Page Not Found</h2>
            
            <p class="error-description">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <div class="error-actions">
              <Button
                label="Go Back"
                icon="pi pi-arrow-left"
                severity="secondary"
                outlined
                @click="goBack"
                class="action-button"
              />
              <Button
                label="Go to Tasks"
                icon="pi pi-home"
                @click="goHome"
                class="action-button"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.not-found-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, var(--p-surface-50) 0%, var(--p-surface-100) 100%);
}

.not-found-container {
  width: 100%;
  max-width: 500px;
}

.not-found-card {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: none;
}

.not-found-content {
  text-align: center;
  padding: 3rem 2rem;
}

.error-icon {
  font-size: 4rem;
  color: var(--p-orange-500);
  margin-bottom: 1.5rem;
}

.error-title {
  font-size: 4rem;
  font-weight: 700;
  color: var(--p-text-color);
  margin: 0 0 0.5rem;
  line-height: 1;
}

.error-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--p-text-color);
  margin: 0 0 1rem;
}

.error-description {
  color: var(--p-surface-600);
  font-size: 1rem;
  margin: 0 0 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-button {
  height: 2.75rem;
  min-width: 120px;
}

@media (max-width: 480px) {
  .not-found-content {
    padding: 2rem 1rem;
  }
  
  .error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .error-title {
    font-size: 3rem;
  }
  
  .error-subtitle {
    font-size: 1.25rem;
  }
  
  .error-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .action-button {
    width: 100%;
  }
}
</style>