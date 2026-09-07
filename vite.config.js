import { defineConfig } from 'vite';
import { resolve } from 'path';
import { plugin404 } from './src/vitePlugin404.js';

export default defineConfig({
  appType: 'mpa',
  plugins: [plugin404()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        termosDeUso: resolve(__dirname, 'termos-de-uso.html'),
        politicaDePrivacidade: resolve(__dirname, 'politica-de-privacidade.html'),
        politicaDePrivacidadeEditor: resolve(__dirname, 'politica-de-privacidade-editor.html'),
        privacidadeContribuidores: resolve(__dirname, 'privacidade-contribuidores.html'),
        contato: resolve(__dirname, 'contato.html'),
        app: resolve(__dirname, 'app.html'),
        download: resolve(__dirname, 'download.html'),
        editor: resolve(__dirname, 'editor.html'),
        editorBeta: resolve(__dirname, 'editor/beta/index.html'),
        certificadoInstalado: resolve(__dirname, 'editor/beta/certificado-instalado/index.html'),
        termosDeUsoFixlog: resolve(__dirname, 'termos-de-uso-fixlog.html'),
        politicaDePrivacidadeFixlog: resolve(__dirname, 'politica-de-privacidade-fixlog.html'),
        notFound: resolve(__dirname, '404.html')
      }
    }
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
      include: ['src/**/*.js']
    },
  },
});
