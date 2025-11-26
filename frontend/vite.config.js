import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,            // permite usar expect() sin importarlo
    environment: 'jsdom',     // necesario para testing-library
    setupFiles: './src/setupTests.js', // archivo setup
  },
});
