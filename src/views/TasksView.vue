<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTasks } from '@/composables/useTasks';
import { useAuth } from '@/composables/useAuth';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import SelectButton from 'primevue/selectbutton';
import ProgressSpinner from 'primevue/progressspinner';
import Badge from 'primevue/badge';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import TaskCard from '@/components/TaskCard.vue';
import EmptyState from '@/components/EmptyState.vue';

const router = useRouter();
const confirm = useConfirm();
const { user } = useAuth();
const {
  tasks,
  pagination,
  filters,
  isLoading,
  isError,
  createTask,
  updateTask,
  deleteTask,
  updateFilters,
  resetFilters,
  refetch,
} = useTasks();

const searchQuery = ref(filters.search || '');
const selectedFilter = ref<'all' | 'active' | 'archived'>(
  filters.isArchived === true ? 'archived' : 
  filters.isArchived === false ? 'active' : 'all'
);

const filterOptions = [
  { label: 'All Tasks', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
];

const filteredTasksCount = computed(() => {
  if (!tasks.value) return 0;
  return tasks.value.length;
});

const handleSearch = (value: string) => {
  searchQuery.value = value;
  updateFilters({ search: value || undefined });
};

const handleFilterChange = (value: 'all' | 'active' | 'archived') => {
  selectedFilter.value = value;
  updateFilters({ 
    isArchived: value === 'archived' ? true : value === 'active' ? false : undefined 
  });
};

const handleTaskComplete = (taskId: string, completed: boolean) => {
  console.log(`Task ${taskId} completed: ${completed}`);
  const task = tasks.value.find(t => t.id === taskId);
  if (!task) return;
console.log('Task found:', taskId);  
  updateTask.mutate({
    id: taskId,
    data: {
      name: task.name,
      notes: task.notes,
      isCompleted: completed,
      isArchived: task.isArchived,
    },
  });
};

const handleTaskArchive = (taskId: string, archived: boolean) => {
  const task = tasks.value.find(t => t.id === taskId);
  if (!task) return;
  
  updateTask.mutate({
    id: taskId,
    data: {
      name: task.name,
      notes: task.notes,
      isCompleted: task.isCompleted,
      isArchived: archived,
    },
  });
};

const handleTaskDelete = (taskId: string) => {
  confirm.require({
    message: 'Are you sure you want to delete this task? This action cannot be undone.',
    header: 'Delete Task',
    icon: 'pi pi-exclamation-triangle',
    rejectClass: 'p-button-secondary p-button-outlined',
    acceptClass: 'p-button-danger',
    accept: () => {
      deleteTask.mutate(taskId);
    },
  });
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedFilter.value = 'all';
  resetFilters();
};

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
});

const displayName = computed(() => {
  if (!user?.value) return 'there';
  const { firstName, lastName, username } = user?.value;
  return firstName || lastName || username || 'there';
});
</script>

<template>
  <div class="tasks-view">
    <div class="tasks-container">
      <!-- Header -->
      <div class="tasks-header">
        <div class="header-content">
          <h1 class="page-title">
            {{ greeting }}, {{ displayName }}!
          </h1>
          <p class="page-subtitle">
            Manage your tasks and stay productive
          </p>
        </div>
        <Button
          label="New Task"
          icon="pi pi-plus"
          class="new-task-button"
          @click="router.push('/tasks/new')"
        />
      </div>

      <!-- Filters -->
      <Card class="filters-card">
        <template #content>
          <div class="filters-content">
            <div class="search-section">
              <label for="search" class="sr-only">Search tasks</label>
              <InputText
                id="search"
                v-model="searchQuery"
                placeholder="Search tasks..."
                class="search-input"
                @input="handleSearch($event.target?.value)"
              />
            </div>
            
            <div class="filter-section">
              <SelectButton
                v-model="selectedFilter"
                :options="filterOptions"
                :allow-empty="false"
                option-label="label"
                option-value="value"
                class="filter-buttons"
                @change="handleFilterChange($event.value)"
              />
            </div>
            
            <Button
              :disabled="!searchQuery && selectedFilter === 'all'"
              label="Clear"
              icon="pi pi-times"
              severity="secondary"
              text
              @click="clearFilters"
            />
          </div>
        </template>
      </Card>

      <!-- Results Summary -->
      <div v-if="!isLoading" class="results-summary">
        <p class="text-surface-600">
          Showing {{ filteredTasksCount }} task{{ filteredTasksCount !== 1 ? 's' : '' }}
          <span v-if="pagination">
            ({{ pagination.totalTasks }} total)
          </span>
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <ProgressSpinner />
        <p>Loading your tasks...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="isError" class="error-state">
        <i class="pi pi-exclamation-triangle text-4xl text-orange-500 mb-3"></i>
        <h3 class="text-xl font-semibold mb-2">Unable to load tasks</h3>
        <p class="text-surface-600 mb-4">
          There was a problem loading your tasks. Please try again.
        </p>
        <Button
          label="Retry"
          icon="pi pi-refresh"
          @click="refetch()"
        />
      </div>

      <!-- Empty State -->
      <EmptyState
        v-else-if="!tasks.length"
        :title="searchQuery || selectedFilter !== 'all' ? 'No tasks found' : 'No tasks yet'"
        :description="searchQuery || selectedFilter !== 'all' ? 
          'Try adjusting your search or filter criteria.' : 
          'Create your first task to get started with TaskFlow.'"
        :action-label="searchQuery || selectedFilter !== 'all' ? 'Clear Filters' : 'Create Task'"
        :action-icon="searchQuery || selectedFilter !== 'all' ? 'pi pi-times' : 'pi pi-plus'"
        @action="searchQuery || selectedFilter !== 'all' ? clearFilters() : router.push('/tasks/new')"
      />

      <!-- Tasks List -->
      <div v-else class="tasks-list">
        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @complete="handleTaskComplete"
          @archive="handleTaskArchive"
          @edit="router.push(`/tasks/${task.id}/edit`)"
          @delete="handleTaskDelete"
        />
      </div>
    </div>
    
    <ConfirmDialog />
  </div>
</template>

<style scoped>
.tasks-view {
  min-height: 100vh;
  background: var(--p-surface-50);
}

.tasks-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  gap: 1rem;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--p-text-color);
  margin: 0 0 0.5rem;
  line-height: 1.2;
}

.page-subtitle {
  color: var(--p-surface-600);
  font-size: 1.125rem;
  margin: 0;
}

.new-task-button {
  height: 3rem;
  white-space: nowrap;
}

.filters-card {
  margin-bottom: 1.5rem;
  border: 1px solid var(--p-surface-200);
}

.filters-content {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-section {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
}

.filter-section {
  flex-shrink: 0;
}

.results-summary {
  margin-bottom: 1.5rem;
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

.tasks-list {
  display: grid;
  gap: 1rem;
}

@media (max-width: 768px) {
  .tasks-container {
    padding: 1rem 0.5rem;
  }
  
  .tasks-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }
  
  .page-title {
    font-size: 1.875rem;
  }
  
  .filters-content {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-section {
    min-width: auto;
  }
  
  .filter-section {
    align-self: stretch;
  }
  
  .filter-buttons {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
}
</style>