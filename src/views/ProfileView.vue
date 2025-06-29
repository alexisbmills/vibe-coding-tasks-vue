<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';

const router = useRouter();
const { user, updateProfile } = useAuth();

const form = reactive({
  firstName: '',
  lastName: '',
});

const errors = ref<Record<string, string>>({});

onMounted(() => {
  if (user.value) {
    form.firstName = user.value.firstName || '';
    form.lastName = user.value.lastName || '';
  }
});

const initials = computed(() => {
  if (!user.value) return 'U';
  
  const { firstName, lastName, username } = user.value;
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) return firstName[0].toUpperCase();
  if (lastName) return lastName[0].toUpperCase();
  if (username) return username[0].toUpperCase();
  return 'U';
});

const displayName = computed(() => {
  if (!user.value) return 'User';
  
  const { firstName, lastName, username } = user.value;
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) return firstName;
  if (lastName) return lastName;
  return username || 'User';
});

const validateForm = () => {
  errors.value = {};
  
  if (!form.firstName.trim()) {
    errors.value.firstName = 'First name is required';
  }
  
  if (!form.lastName.trim()) {
    errors.value.lastName = 'Last name is required';
  }
  
  return Object.keys(errors.value).length === 0;
};

const handleSubmit = () => {
  if (!validateForm()) return;
  
  updateProfile.mutate({
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
  });
};

const handleCancel = () => {
  if (user.value) {
    form.firstName = user.value.firstName || '';
    form.lastName = user.value.lastName || '';
  }
  errors.value = {};
};
</script>

<template>
  <div class="profile-view">
    <div class="profile-container">
      <div class="page-header">
        <Button
          icon="pi pi-arrow-left"
          severity="secondary"
          text
          rounded
          @click="router.push('/tasks')"
          class="back-button"
        />
        <div class="header-content">
          <h1 class="page-title">Profile Settings</h1>
          <p class="page-subtitle">Manage your account information</p>
        </div>
      </div>

      <div class="profile-cards">
        <!-- Profile Overview -->
        <Card class="profile-overview-card">
          <template #header>
            <div class="profile-header">
              <Avatar
                :label="initials"
                size="xlarge"
                shape="circle"
                class="profile-avatar"
              />
              <div class="profile-info">
                <h2 class="profile-name">{{ displayName }}</h2>
                <p class="profile-email">{{ user?.username }}</p>
                <p class="profile-joined">
                  Member since {{ new Date(user?.createdAt || '').toLocaleDateString() }}
                </p>
              </div>
            </div>
          </template>
        </Card>

        <!-- Profile Form -->
        <Card class="profile-form-card">
          <template #header>
            <h3 class="form-title">Personal Information</h3>
          </template>
          
          <template #content>
            <form @submit.prevent="handleSubmit" class="profile-form">
              <div class="name-fields">
                <div class="field">
                  <label for="firstName" class="field-label required">First Name</label>
                  <InputText
                    id="firstName"
                    v-model="form.firstName"
                    placeholder="Enter your first name"
                    :class="{ 'p-invalid': errors.firstName }"
                    class="w-full"
                    :aria-describedby="errors.firstName ? 'firstName-error' : undefined"
                  />
                  <small v-if="errors.firstName" id="firstName-error" class="p-error">
                    {{ errors.firstName }}
                  </small>
                </div>

                <div class="field">
                  <label for="lastName" class="field-label required">Last Name</label>
                  <InputText
                    id="lastName"
                    v-model="form.lastName"
                    placeholder="Enter your last name"
                    :class="{ 'p-invalid': errors.lastName }"
                    class="w-full"
                    :aria-describedby="errors.lastName ? 'lastName-error' : undefined"
                  />
                  <small v-if="errors.lastName" id="lastName-error" class="p-error">
                    {{ errors.lastName }}
                  </small>
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
                  :loading="updateProfile.isPending.value"
                  class="save-button"
                />
              </div>
            </form>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-view {
  min-height: 100vh;
  background: var(--p-surface-50);
}

.profile-container {
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

.profile-cards {
  display: grid;
  gap: 2rem;
}

.profile-overview-card,
.profile-form-card {
  border: 1px solid var(--p-surface-200);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--p-primary-50) 0%, var(--p-surface-50) 100%);
}

.profile-avatar {
  background-color: var(--p-primary-500);
  color: white;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--p-text-color);
  margin: 0 0 0.5rem;
}

.profile-email {
  color: var(--p-surface-600);
  font-size: 1rem;
  margin: 0 0 0.25rem;
}

.profile-joined {
  color: var(--p-surface-500);
  font-size: 0.875rem;
  margin: 0;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--p-text-color);
  margin: 0;
  padding: 1.5rem 2rem 0;
}

.profile-form {
  padding: 1.5rem 2rem 2rem;
}

.name-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.field {
  margin-bottom: 1.5rem;
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

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 2rem;
  border-top: 1px solid var(--p-surface-200);
}

.cancel-button,
.save-button {
  height: 2.75rem;
  min-width: 120px;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 1rem 0.5rem;
  }
  
  .page-header {
    margin-bottom: 1.5rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .name-fields {
    grid-template-columns: 1fr;
    gap: 0;
  }
  
  .profile-form {
    padding: 1.5rem;
  }
  
  .form-title {
    padding: 1.5rem 1.5rem 0;
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
  
  .profile-header {
    padding: 1.5rem;
  }
  
  .profile-form {
    padding: 1rem;
  }
  
  .form-title {
    padding: 1rem 1rem 0;
  }
}
</style>