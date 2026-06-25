import { defineConfig } from 'vitest/config'

export default defineConfig({
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
})
