import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', 'VITE_');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        fs: {
          // Allow workspace root access when dev server is started from repo root
          allow: [
            path.resolve(__dirname, '.'),
            path.resolve(__dirname, '..'),
            path.resolve(__dirname, '../..'),
            // Windows drive root fallback for @fs/D:/... requests
            'D:/', 'd:/'
          ],
        },
      },
      plugins: [react()],
      define: {
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || '')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});

