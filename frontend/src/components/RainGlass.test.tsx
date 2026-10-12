import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RainGlass } from './RainGlass';

/**
 * jsdom has no WebGL, so `getContext('webgl')` returns null and the renderer
 * throws. That is exactly the unsupported-browser path, which is the one most
 * worth having a regression test on: a visitor with WebGL disabled must still
 * get readable page content.
 */
describe('RainGlass — unsupported environment', () => {
  it('reports that the water surface could not start', () => {
    const onUnsupported = vi.fn();
    render(
      <RainGlass onUnsupported={onUnsupported}>
        <p>Page copy</p>
      </RainGlass>,
    );
    expect(onUnsupported).toHaveBeenCalledTimes(1);
  });

  it('still renders its children so content is never lost', () => {
    render(
      <RainGlass>
        <p>Page copy</p>
      </RainGlass>,
    );
    expect(screen.getByText('Page copy')).toBeInTheDocument();
  });

  it('keeps the canvas hidden from assistive technology', () => {
    const { container } = render(
      <RainGlass>
        <p>Copy</p>
      </RainGlass>,
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
  });

  it('removes its canvas on unmount rather than leaking it', () => {
    const { container, unmount } = render(
      <RainGlass>
        <p>Copy</p>
      </RainGlass>,
    );
    expect(container.querySelector('canvas')).not.toBeNull();
    unmount();
    expect(container.querySelector('canvas')).toBeNull();
  });
});