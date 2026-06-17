<script setup lang="ts">
import { computed } from 'vue';
import type { TaskResponse } from '@/types/api';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Badge from 'primevue/badge';

interface Props {
  task: TaskResponse;
}

interface Emits {
  (e: 'complete', taskId: string, completed: boolean): void;
  (e: 'archive', taskId: string, archived: boolean): void;
  (e: 'edit', taskId: string): void;
  (e: 'delete', taskId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formattedCreatedAt = computed(() => {
  return new Date(props.task.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
});

const formattedCompletedAt = computed(() => {
  if (!props.task.completedAt) return null;
  return new Date(props.task.completedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
});

const handleCompleteToggle = (isCompleted: boolean) => {
  emit('complete', props.task.id, isCompleted);
};

const handleArchiveToggle = () => {
  emit('archive', props.task.id, !props.task.isArchived);
};

const handleEdit = () => {
  emit('edit', props.task.id);
};

const handleDelete = () => {
  emit('delete', props.task.id);
};
</script>

<template>
  <Card class="task-card" :class="{ 'completed': task.isCompleted, 'archived': task.isArchived }">
    <template #content>
      <div class="task-content">
        <div class="task-main">
          <div class="task-header">
            <Checkbox
              :modelValue="task.isCompleted"
              :binary="true"
              @update:modelValue="handleCompleteToggle"
              class="task-checkbox"
              :aria-label="`Mark task '${task.name}' as ${task.isCompleted ? 'incomplete' : 'complete'}`"
            />

            <div class="task-info">
              <h3 class="task-name" :class="{ 'completed-text': task.isCompleted }">
                {{ task.name || 'Untitled Task' }}
              </h3>

              <div class="task-meta">
                <span class="created-date">Created {{ formattedCreatedAt }}</span>
                <span v-if="task.isCompleted && formattedCompletedAt" class="completed-date">
                  • Completed {{ formattedCompletedAt }}
                </span>
              </div>
            </div>

            <div class="task-badges">
              <Badge
                v-if="task.isCompleted"
                value="Completed"
                severity="success"
                class="status-badge"
              />
              <Badge
                v-if="task.isArchived"
                value="Archived"
                severity="secondary"
                class="status-badge"
              />
            </div>
          </div>
          
          <div v-if="task.notes" class="task-notes">
            <p>{{ task.notes }}</p>
          </div>
        </div>
        
        <div class="task-actions">
          <Button
            icon="pi pi-pencil"
            severity="secondary"
            text
            rounded
            :aria-label="`Edit task '${task.name}'`"
            @click="handleEdit"
            class="action-button"
          />
          
          <Button
            :icon="task.isArchived ? 'pi pi-inbox' : 'pi pi-inbox'"
            severity="secondary"
            text
            rounded
            :aria-label="`${task.isArchived ? 'Unarchive' : 'Archive'} task '${task.name}'`"
            @click="handleArchiveToggle"
            class="action-button"
          />
          
          <Button
            icon="pi pi-trash"
            severity="danger"
            text
            rounded
            :aria-label="`Delete task '${task.name}'`"
            @click="handleDelete"
            class="action-button"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.task-card {
  border: 1px solid var(--p-surface-200);
  transition: all 0.2s ease;
}

.task-card:hover {
  border-color: var(--p-surface-300);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-card.archived {
  opacity: 0.7;
  background-color: var(--p-surface-100);
}

.task-card.completed .task-name {
  opacity: 0.7;
}

.task-content {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.task-main {
  flex: 1;
  min-width: 0;
}

.task-header {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.task-checkbox {
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.task-info {
  flex: 1;
  min-width: 0;
}

.task-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: var(--p-text-color);
  word-wrap: break-word;
  transition: opacity 0.2s ease;
}

.task-name.completed-text {
  text-decoration: line-through;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--p-surface-600);
}

.task-badges {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}

.status-badge {
  font-size: 0.75rem;
}

.task-notes {
  margin-top: 0.75rem;
  padding-left: 2rem;
}

.task-notes p {
  margin: 0;
  color: var(--p-surface-700);
  line-height: 1.5;
  word-wrap: break-word;
}

.task-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-button {
  width: 2.5rem;
  height: 2.5rem;
  transition: all 0.2s ease;
}

.action-button:hover {
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .task-content {
    flex-direction: column;
    gap: 1rem;
  }

  .task-actions {
    flex-direction: row;
    justify-content: flex-end;
    align-self: stretch;
  }

  .task-badges {
    flex-direction: row;
  }

  .task-notes {
    padding-left: 0;
  }
}

@media (max-width: 480px) {
  .task-header {
    flex-wrap: wrap;
  }

  .task-badges {
    order: 3;
    width: 100%;
    margin-top: 0.5rem;
  }

  .task-meta {
    font-size: 0.8125rem;
  }
}
</style>