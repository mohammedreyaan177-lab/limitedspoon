import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom has no WebGL, no IntersectionObserver and no matchMedia. The app is
// written to degrade in all three cases, and these stubs make that degradation
// the default so the tests exercise the real fallbacks rather than a polyfilled
// happy path.

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

if (!('IntersectionObserver' in window)) {
  class NoopIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds: readonly number[] = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  // `in` narrowing leaves window typed as never here, so assign through a
// widened alias rather than the narrowed global.
const globalWindow = window as unknown as Record<string, unknown>;
globalWindow.IntersectionObserver = NoopIntersectionObserver;
}

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

if (!('ResizeObserver' in window)) {
  Object.defineProperty(window, 'ResizeObserver', {
    configurable: true,
    writable: true,
    value: class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  });
}