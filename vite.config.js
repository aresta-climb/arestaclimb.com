import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        cla: resolve(__dirname, 'cla.html'),
        termosDeUso: resolve(__dirname, 'termos-de-uso.html'),
        politicaDePrivacidade: resolve(__dirname, 'politica-de-privacidade.html'),
        privacidadeContribuidores: resolve(__dirname, 'privacidade-contribuidores.html')
      }
    }
  },
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
      include: ['src/**/*.js'],
      exclude: ['src/main.js'], // Exclude main entry point from logic tests
    },
  },
});
