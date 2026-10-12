/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // 0.0.0.0 rather than loopback, so the dev server is reachable from a
    // phone on the same wifi for checking real viewports.
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      // Fonts are written once, then never change. Watching them only risks a
      // transient EBUSY lock from whatever wrote them.
      ignored: ['**/public/fonts/**', '**/.playwright-mcp/**', '**/docs/**'],
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 2048,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // axe-core over a whole page legitimately takes 2-4s in jsdom, and this
    // machine's C: volume is full, which starves the runner further. The 5s
    // default was producing spurious timeouts, not real failures.
    testTimeout: 20000,
    hookTimeout: 20000,
  },
});