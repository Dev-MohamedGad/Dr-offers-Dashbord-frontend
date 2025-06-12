import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utilities'),
      '@redux': path.resolve(__dirname, './src/redux'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 3001,
  },
});
