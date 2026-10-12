import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Reveal } from './Reveal';

/**
 * The reveal animation hides content until it enters the viewport. That is a
 * readability risk, not just a cosmetic one: if the trigger never fires the
 * copy is simply gone. These tests pin the three layers of protection —
 * reduced-motion, missing IntersectionObserver, and the failsafe timer.
 */
function setReducedMotion(matches: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  );
}

describe('Reveal', () => {
  it('always renders its children into the document', () => {
    setReducedMotion(false);
    render(<Reveal>Important copy</Reveal>);
    expect(screen.getByText('Important copy')).toBeInTheDocument();
  });

  it('shows content immediately when the visitor asks for reduced motion', async () => {
    setReducedMotion(true);
    const { container } = render(<Reveal>Calm copy</Reveal>);
    const el = container.firstElementChild as HTMLElement;
    // no animation class means it is never mid-fade
    await waitFor(() => {
      expect(el.className).toContain('shown');
    });
  });

  it('renders visible when IntersectionObserver is unavailable', async () => {
    setReducedMotion(false);
    const original = window.IntersectionObserver;
    // simulate an old browser with no IntersectionObserver at all
    // @ts-expect-error -- deliberately removing the API
    delete window.IntersectionObserver;

    try {
      const { container } = render(<Reveal>Legacy copy</Reveal>);
      const el = container.firstElementChild as HTMLElement;
      await waitFor(() => expect(el.className).toContain('shown'));
    } finally {
      window.IntersectionObserver = original;
    }
  });

  it('reveals the content regardless once the failsafe elapses', async () => {
    setReducedMotion(false);
    const original = window.IntersectionObserver;
    // an observer that never reports intersecting -- the pathological case
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    } as unknown as typeof IntersectionObserver;

    try {
      const { container } = render(<Reveal>Never observed</Reveal>);
      const el = container.firstElementChild as HTMLElement;
      await waitFor(() => expect(el.className).toContain('shown'), { timeout: 6000 });
    } finally {
      window.IntersectionObserver = original;
    }
  });
});