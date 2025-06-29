<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';

const router = useRouter();
const route = useRoute();
const { isAuthenticated, user, logout } = useAuth();

const items = computed(() => {
  if (!isAuthenticated.value) {
    return [
      {
        label: 'Login',
        icon: 'pi pi-sign-in',
        command: () => router.push('/login'),
      },
      {
        label: 'Register',
        icon: 'pi pi-user-plus',
        command: () => router.push('/register'),
      },
    ];
  }

  return [
    {
      label: 'Tasks',
      icon: 'pi pi-list',
      command: () => router.push('/tasks'),
    },
    {
      label: 'New Task',
      icon: 'pi pi-plus',
      command: () => router.push('/tasks/new'),
    },
  ];
});

const userMenu = computed(() => [
  {
    label: 'Profile',
    icon: 'pi pi-user',
    command: () => router.push('/profile'),
  },
  {
    separator: true,
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => logout(),
  },
]);

const displayName = computed(() => {
  if (!user.value) return '';
  
  const { firstName, lastName, username } = user.value;
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) return firstName;
  if (lastName) return lastName;
  return username || 'User';
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
</script>

<template>
  <nav class="app-navbar">
    <Menubar :model="items" class="navbar-menu">
      <template #start>
        <div class="brand" @click="router.push('/')" role="button" tabindex="0">
          <i class="pi pi-check-square text-2xl text-primary mr-2"></i>
          <span class="font-bold text-xl">TaskFlow</span>
        </div>
      </template>
      
      <template #end>
        <div v-if="isAuthenticated" class="user-section">
          <span class="user-name hidden sm:inline mr-3">{{ displayName }}</span>
          <Avatar 
            :label="initials"
            shape="circle"
            class="user-avatar cursor-pointer"
            @click="$refs.userMenu.toggle($event)"
          />
        </div>
      </template>
    </Menubar>
  </nav>
</template>

<style scoped>
.app-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 4rem;
  background: var(--p-surface-0);
  border-bottom: 1px solid var(--p-surface-200);
}

.navbar-menu {
  height: 100%;
  border: none;
  border-radius: 0;
}

.brand {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.brand:hover {
  background-color: var(--p-surface-100);
}

.brand:focus {
  outline: 2px solid var(--p-primary-500);
  outline-offset: 2px;
}

.user-section {
  display: flex;
  align-items: center;
}

.user-name {
  color: var(--p-text-color);
  font-weight: 500;
}

.user-avatar {
  background-color: var(--p-primary-500);
  color: white;
  transition: background-color 0.2s;
}

.user-avatar:hover {
  background-color: var(--p-primary-600);
}

@media (max-width: 768px) {
  .app-navbar {
    height: 3.5rem;
  }
  
  .navbar-menu {
    padding: 0 0.5rem;
  }
  
  .brand span {
    font-size: 1.125rem;
  }
}
</style>