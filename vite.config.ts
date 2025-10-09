import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || 'AIzaSyDQHyQpghww3NcBawrBMm4Ds7HJ5RuTdik'),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || 'AIzaSyDQHyQpghww3NcBawrBMm4Ds7HJ5RuTdik')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
