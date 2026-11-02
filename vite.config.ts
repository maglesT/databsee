import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The core screens; served by the core app from dist/core-web.
export default defineConfig({
  root: 'apps/core/web',
  plugins: [react()],
  build: { outDir: '../../../dist/core-web', emptyOutDir: true },
  server: { proxy: { '/api': 'http://127.0.0.1:3000' } },
});
