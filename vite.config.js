import { defineConfig } from 'vite';
import { resolve } from 'path';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { plugin404 } from './src/vitePlugin404.js';
import { pluginSitemap } from './src/vitePluginSitemap.js';

if (process.env.CI && !process.env.SENTRY_AUTH_TOKEN && process.env.NODE_ENV !== 'test') {
  throw new Error('[SENTRY] SENTRY_AUTH_TOKEN não configurado no CI! O build de produção não pode ser publicado sem Source Maps no Sentry.');
}

export default defineConfig({
  appType: 'mpa',
  plugins: [
    plugin404(),
    pluginSitemap(),
    sentryVitePlugin({
      org: 'aresta-climb',
      project: 'arestaclimb-com',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: !process.env.CI,
    }),
  ],
  build: {
    sourcemap: true,
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
        termosDeUsoFixalog: resolve(__dirname, 'termos-de-uso-fixalog.html'),
        politicaDePrivacidadeFixalog: resolve(__dirname, 'politica-de-privacidade-fixalog.html'),
        comunidade: resolve(__dirname, 'comunidade.html'),
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
