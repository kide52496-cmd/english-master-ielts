import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Kept separate from vite.config.js on purpose: the app build config carries a
// large manualChunks map that is irrelevant to tests, and Vitest picks this
// file up in preference to vite.config.js.
export default defineConfig({
  plugins: [react()],
  test: {
    // happy-dom over jsdom purely for speed: on this project jsdom cost ~80s
    // per worker just to construct the environment, which made the suite too
    // slow to run on every change. happy-dom covers everything these tests
    // touch (DOM, localStorage, history, events).
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.{js,jsx}'],
    // Content files are megabytes of static data; importing them in a few
    // integrity tests is slow but legitimate.
    testTimeout: 30000,
    hookTimeout: 30000,
    restoreMocks: true,
    clearMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/routes.js', 'src/context/**'],
      reporter: ['text', 'html'],
    },
  },
})
