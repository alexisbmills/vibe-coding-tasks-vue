<script setup lang="ts">
import { ref, reactive } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';

const { login } = useAuth();

const form = reactive({
  username: '',
  password: '',
});

const errors = ref<Record<string, string>>({});

const validateForm = () => {
  errors.value = {};
  
  if (!form.username.trim()) {
    errors.value.username = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(form.username)) {
    errors.value.username = 'Please enter a valid email address';
  }
  
  if (!form.password) {
    errors.value.password = 'Password is required';
  }
  
  return Object.keys(errors.value).length === 0;
};

const handleSubmit = () => {
  if (!validateForm()) return;
  
  login.mutate({
    username: form.username,
    password: form.password,
  });
};
</script>

<template>
  <div class="login-view">
    <div class="login-container">
      <Card class="login-card">
        <template #header>
          <div class="card-header">
            <i class="pi pi-sign-in text-4xl text-primary mb-2"></i>
            <h1 class="text-2xl font-bold mb-1">Welcome Back</h1>
            <p class="text-surface-600">Sign in to your account</p>
          </div>
        </template>
        
        <template #content>
          <form @submit.prevent="handleSubmit" class="login-form">
            <div class="field">
              <label for="username" class="field-label">Email</label>
              <InputText
                id="username"
                v-model="form.username"
                placeholder="Enter your email"
                :class="{ 'p-invalid': errors.username }"
                class="w-full"
                :aria-describedby="errors.username ? 'username-error' : undefined"
              />
              <small v-if="errors.username" id="username-error" class="p-error">
                {{ errors.username }}
              </small>
            </div>
            
            <div class="field">
              <label for="password" class="field-label">Password</label>
              <Password
                id="password"
                v-model="form.password"
                placeholder="Enter your password"
                :feedback="false"
                toggle-mask
                :class="{ 'p-invalid': errors.password }"
                class="w-full"
                :aria-describedby="errors.password ? 'password-error' : undefined"
              />
              <small v-if="errors.password" id="password-error" class="p-error">
                {{ errors.password }}
              </small>
            </div>
            
            <Button
              type="submit"
              label="Sign In"
              :loading="login.isPending.value"
              class="w-full login-button"
              size="large"
            />
          </form>
        </template>
        
        <template #footer>
          <div class="card-footer">
            <p class="text-center text-surface-600">
              Don't have an account?
              <RouterLink to="/register" class="register-link">
                Create one here
              </RouterLink>
            </p>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, var(--p-primary-50) 0%, var(--p-surface-50) 100%);
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header {
  text-align: center;
  padding: 2rem 2rem 0;
}

.login-form {
  padding: 0 2rem 2rem;
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

.login-button {
  margin-top: 1rem;
  height: 3rem;
}

.card-footer {
  padding: 0 2rem 2rem;
}

.register-link {
  color: var(--p-primary-500);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.register-link:hover {
  color: var(--p-primary-600);
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-view {
    padding: 0.5rem;
  }
  
  .card-header {
    padding: 1.5rem 1.5rem 0;
  }
  
  .login-form {
    padding: 0 1.5rem 1.5rem;
  }
  
  .card-footer {
    padding: 0 1.5rem 1.5rem;
  }
}
</style>