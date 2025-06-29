<script setup lang="ts">
import Button from 'primevue/button';

interface Props {
  title: string;
  description: string;
  actionLabel?: string;
  actionIcon?: string;
  icon?: string;
}

interface Emits {
  (e: 'action'): void;
}

const props = withDefaults(defineProps<Props>(), {
  actionLabel: 'Get Started',
  actionIcon: 'pi pi-plus',
  icon: 'pi pi-inbox',
});

const emit = defineEmits<Emits>();

const handleAction = () => {
  emit('action');
};
</script>

<template>
  <div class="empty-state">
    <div class="empty-state-content">
      <i :class="[icon, 'empty-state-icon']"></i>
      <h3 class="empty-state-title">{{ title }}</h3>
      <p class="empty-state-description">{{ description }}</p>
      <Button
        :label="actionLabel"
        :icon="actionIcon"
        class="empty-state-action"
        size="large"
        @click="handleAction"
      />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-state-content {
  max-width: 400px;
}

.empty-state-icon {
  font-size: 4rem;
  color: var(--p-surface-400);
  margin-bottom: 1.5rem;
}

.empty-state-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--p-text-color);
  margin: 0 0 1rem;
}

.empty-state-description {
  color: var(--p-surface-600);
  margin: 0 0 2rem;
  line-height: 1.6;
}

.empty-state-action {
  height: 3rem;
}

@media (max-width: 480px) {
  .empty-state {
    padding: 3rem 1rem;
  }
  
  .empty-state-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .empty-state-title {
    font-size: 1.25rem;
  }
  
  .empty-state-description {
    font-size: 0.9375rem;
  }
}
</style>