import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Lets QA-Agent-Test/client test files (which live in a sibling directory to this
    // package, outside its own directory tree) resolve these packages from this project's
    // already-installed node_modules instead of failing Node's ancestor-only lookup.
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
      '@testing-library/react': path.resolve(__dirname, 'node_modules/@testing-library/react'),
      '@testing-library/jest-dom': path.resolve(__dirname, 'node_modules/@testing-library/jest-dom'),
      '@testing-library/user-event': path.resolve(__dirname, 'node_modules/@testing-library/user-event'),
      '@heroicons/react': path.resolve(__dirname, 'node_modules/@heroicons/react'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
    // Allow Vite's dev-server/vitest file-serving to reach one level up (code/v2), which
    // covers the sibling QA-Agent-Test/client directory — otherwise Vite's default fs
    // access restriction rejects loading test files that exist outside this package's own
    // directory tree with a misleading "Does the file exist?" error.
    fs: {
      allow: ['..'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    // Original default coverage: all src/** test files. Added: the QA Agent's dedicated
    // suite under the sibling QA-Agent-Test/client directory (see WinWire QA Agent rules).
    include: [
      'src/**/*.{test,spec}.{js,jsx}',
      '../QA-Agent-Test/client/**/*.{test,spec}.{js,jsx}',
    ],
  },
});
