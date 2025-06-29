<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuery } from '@tanstack/vue-query';
import { useTasks } from '@/composables/useTasks';
import { apiClient } from '@/services/api';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import ProgressSpinner from 'primevue/progressspinner';

interface Props {
  id: string;
}

const props = defineProps<Props>();
const router = useRouter();
const { updateTask } = useTasks();

const form = reactive({
  name: '',
  notes: '',
  isCompleted: false,
  isArchived: false,
});

const errors = ref<Record<string, string>>({});

const taskQuery = useQuery({
  queryKey: ['task', props.id],
  queryFn: () => apiClient.getTask(props.id),
});

const task = computed(() => taskQuery.data.value);

onMounted(() => {
  if (task.value) {
    form.name = task.value.name || '';
    form.notes = task.value.notes || '';
    form.isCompleted = task.value.isCompleted;
    form.isArchived = task.value.isArchived;
  }
});

const validateForm = () => {
  errors.value = {};
  
  if (!form.name.trim()) {
    errors.value.name = 'Task name is required';
  }
  
  return Object.keys(errors.value).length === 0;
};

const handleSubmit = () => {
  if (!validateForm()) return;
  
  updateTask.mutate(
    {
      id: props.id,
      data: {
        name: form.name.trim(),
        notes: form.notes.trim() || null,
        isCompleted: form.isCompleted,
        isArchived: form.isArchived,
      },
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
  <div class="edit-task-view">
    <div class="edit-task-container">
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
          <h1 class="page-title">Edit Task</h1>
          <p class="page-subtitle">Update your task details</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="taskQuery.isLoading.value" class="loading-state">
        <ProgressSpinner />
        <p>Loading task details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="taskQuery.isError.value" class="error-state">
        <i class="pi pi-exclamation-triangle text-4xl text-orange-500 mb-3"></i>
        <h3 class="text-xl font-semibold mb-2">Task not found</h3>
        <p class="text-surface-600 mb-4">
          The task you're looking for doesn't exist or has been deleted.
        </p>
        <Button
          label="Back to Tasks"
          icon="pi pi-arrow-left"
          @click="router.push('/tasks')"
        />
      </div>

      <!-- Form -->
      <Card v-else-if="task" class="task-form-card">
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
            </div>

            <div class="status-fields">
              <div class="field">
                <div class="checkbox-field">
                  <Checkbox
                    id="completed"
                    v-model="form.isCompleted"
                    binary
                  />
                  <label for="completed" class="checkbox-label">
                    Mark as completed
                  </label>
                </div>
              </div>

              <div class="field">
                <div class="checkbox-field">
                  <Checkbox
                    id="archived"
                    v-model="form.isArchived"
                    binary
                  />
                  <label for="archived" class="checkbox-label">
                    Archive this task
                  </label>
                </div>
              </div>
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
                label="Save Changes"
                icon="pi pi-check"
                :loading="updateTask.isPending.value"
                class="save-button"
              />
            </div>
          </form>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.edit-task-view {
  min-height: 100vh;
  background: var(--p-surface-50);
}

.edit-task-container {
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

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.loading-state p,
.error-state p {
  margin-top: 1rem;
  color: var(--p-surface-600);
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

.status-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--p-surface-100);
  border-radius: 0.5rem;
  border: 1px solid var(--p-surface-200);
}

.checkbox-field {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.checkbox-label {
  color: var(--p-text-color);
  font-weight: 500;
  cursor: pointer;
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
.save-button {
  height: 2.75rem;
  min-width: 120px;
}

@media (max-width: 768px) {
  .edit-task-container {
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
  
  .status-fields {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
  }
  
  .cancel-button,
  .save-button {
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