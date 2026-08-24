import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

// Minimal test harness — the bulk-paste parser is a pure module, so a plain
// node environment is enough (no jsdom / testing-library). The `@` alias mirrors
// tsconfig so tests import app modules the same way the app does.
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/__tests__/**/*.test.ts'],
  },
})
