import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint(),
  ],
  server: {
    proxy: {
      // Redireciona requisições de /api para a própria aplicação,
      // permitindo que o Vercel (ou o servidor de dev) lide com as funções serverless.
      '/api': {
        target: 'http://localhost:5173', // A porta padrão do Vite
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
});
