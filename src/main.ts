import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Aura from '@primevue/themes/aura';

import App from './App.vue';
import router from './router';
import { apiClient } from './services/api';

import './style.css';
import ConfirmationService from 'primevue/confirmationservice';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(VueQueryPlugin);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.p-dark',
      cssLayer: false,
    },
  },
});
app.use(ToastService);
app.use(ConfirmationService);

// Set up toast for API client
app.provide('toast', app.config.globalProperties.$toast);

app.mount('#app');