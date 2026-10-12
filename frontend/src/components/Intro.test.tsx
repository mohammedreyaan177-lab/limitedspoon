import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Intro } from './Intro';

afterEach(() => {
  vi.useRealTimers();
  document.body.style.overflow = '';
});

/** Runs past the intro's full sequence and flushes the React re-render. */
async function runIntro() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(4000);
  });
}

describe('Intro', () => {
  it('locks the page while it is up and releases it afterwards', async () => {
    // The regression this guards: the lock was originally released only from an
    // effect cleanup, but the component renders `null` rather than unmounting,
    // so that cleanup never fired and the page stayed unscrollable forever.
    vi.useFakeTimers();
    render(<Intro />);

    expect(screen.getByTestId('intro')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    await runIntro();

    expect(screen.queryByTestId('intro')).not.toBeInTheDocument();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('restores whatever overflow the page already had', async () => {
    vi.useFakeTimers();
    document.body.style.overflow = 'auto';
    render(<Intro />);

    expect(document.body.style.overflow).toBe('hidden');
    await runIntro();

    expect(document.body.style.overflow).toBe('auto');
  });

  it('renders nothing and never locks when disabled', async () => {
    render(<Intro disabled />);
    await waitFor(() => {
      expect(screen.queryByTestId('intro')).not.toBeInTheDocument();
    });
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('is hidden from assistive technology and holds no focusable content', () => {
    render(<Intro />);
    const overlay = screen.getByTestId('intro');
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
    expect(overlay.querySelectorAll('a, button, input, select, textarea')).toHaveLength(0);
  });

  it('does not come back once it has finished', async () => {
    vi.useFakeTimers();
    const { rerender } = render(<Intro />);
    await runIntro();
    expect(screen.queryByTestId('intro')).not.toBeInTheDocument();

    // A re-render with the same props is what a parent state change looks like.
    rerender(<Intro />);
    expect(screen.queryByTestId('intro')).not.toBeInTheDocument();
  });
});