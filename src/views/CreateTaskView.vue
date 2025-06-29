<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useTasks } from '@/composables/useTasks';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';

const router = useRouter();
const { createTask } = useTasks();

const form = reactive({
  name: '',
  notes: '',
});

const errors = ref<Record<string, string>>({});

const validateForm = () => {
  errors.value = {};
  
  if (!form.name.trim()) {
    errors.value.name = 'Task name is required';
  }
  
  return Object.keys(errors.value).length === 0;
};

const handleSubmit = () => {
  if (!validateForm()) return;
  
  createTask.mutate(
    {
      name: form.name.trim(),
      notes: form.notes.trim() || null,
    },
    {
      onSuccess: () => {
        router.push('/tasks');
      },
    }
  );
};

const handleCancel = () => {
  router.push('/tasks');
};
</script>

<template>
  <div class="create-task-view">
    <div class="create-task-container">
      <div class="page-header">
        <Button
          icon="pi pi-arrow-left"
          severity="secondary"
          text
          rounded
          @click="handleCancel"
          class="back-button"
        />
        <div class="header-content">
          <h1 class="page-title">Create New Task</h1>
          <p class="page-subtitle">Add a new task to your list</p>
        </div>
      </div>

      <Card class="task-form-card">
        <template #content>
          <form @submit.prevent="handleSubmit" class="task-form">
            <div class="field">
              <label for="name" class="field-label required">Task Name</label>
              <InputText
                id="name"
                v-model="form.name"
                placeholder="Enter task name"
                :class="{ 'p-invalid': errors.name }"
                class="w-full"
                :aria-describedby="errors.name ? 'name-error' : undefined"
                autofocus
              />
              <small v-if="errors.name" id="name-error" class="p-error">
                {{ errors.name }}
              </small>
            </div>

            <div class="field">
              <label for="notes" class="field-label">Notes</label>
              <Textarea
                id="notes"
                v-model="form.notes"
                placeholder="Add any additional notes or details"
                rows="4"
                class="w-full"
                auto-resize
              />
              <small class="field-help">
                Optional: Add any additional details about this task
              </small>
            </div>

            <div class="form-actions">
              <Button
                type="button"
                label="Cancel"
                severity="secondary"
                outlined
                @click="handleCancel"
                class="cancel-button"
              />
              <Button
                type="submit"
                label="Create Task"
                icon="pi pi-plus"
                :loading="createTask.isPending.value"
                class="create-button"
              />
            </div>
          </form>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.create-task-view {
  min-height: 100vh;
  background: var(--p-surface-50);
}

.create-task-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-button {
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--p-text-color);
  margin: 0 0 0.25rem;
  line-height: 1.2;
}

.page-subtitle {
  color: var(--p-surface-600);
  margin: 0;
}

.task-form-card {
  border: 1px solid var(--p-surface-200);
}

.task-form {
  padding: 2rem;
}

.field {
  margin-bottom: 2rem;
}

.field-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--p-text-color);
  font-weight: 500;
}

.field-label.required::after {
  content: ' *';
  color: var(--p-red-500);
}

.field-help {
  display: block;
  margin-top: 0.5rem;
  color: var(--p-surface-600);
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--p-surface-200);
}

.cancel-button,
.create-button {
  height: 2.75rem;
  min-width: 120px;
}

@media (max-width: 768px) {
  .create-task-container {
    padding: 1rem 0.5rem;
  }
  
  .page-header {
    margin-bottom: 1.5rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .task-form {
    padding: 1.5rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }
  
  .cancel-button,
  .create-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .task-form {
    padding: 1rem;
  }
}
</style>