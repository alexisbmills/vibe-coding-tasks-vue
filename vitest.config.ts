import { configDefaults, defineConfig } from 'vitest/config';
import { mergeConfig } from 'vite';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
     test: {
       environment: 'jsdom',
       globals: true,
       exclude: [...configDefaults.exclude, 'e2e/*'],
       setupFiles: ['./src/test/setup.ts'],
     }
  })
);