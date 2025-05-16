import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['@solana/spl-token', 'recharts'],
  },
  // Environment variables are automatically loaded from .env files
  // and exposed with VITE_ prefix in the client
  server: {
    port: 3000,
    open: true,
  },
});
