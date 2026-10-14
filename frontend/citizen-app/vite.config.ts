import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@garmiq/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
      '@garmiq/api-client': path.resolve(__dirname, '../../packages/api-client/src/index.ts'),
      '@garmiq/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
    },
  },
  server: {
    port: 3001,
  },
});
