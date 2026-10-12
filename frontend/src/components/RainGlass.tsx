import { useEffect, useRef, useState } from 'react';
import { RainGlassRenderer, type RainGlassOptions } from '../gl/RainGlassRenderer';
import styles from './RainGlass.module.css';

export interface RainGlassProps extends RainGlassOptions {
  className?: string;
  /** Rendered above the water. Kept out of the GL layer so text stays crisp. */
  children?: React.ReactNode;
  /** Fires when the renderer could not start (no WebGL, context lost, etc). */
  onUnsupported?: () => void;
}

/**
 * The rain-on-glass surface.
 *
 * Water is rendered by WebGL into its own layer; page content sits above it in
 * normal DOM. That split is deliberate -- the water must refract and sparkle,
 * but text must stay selectable, screen-reader visible and pin-sharp.
 *
 * The canvas element is created inside the effect rather than declared in JSX
 * on purpose: a canvas can only ever have one context, so a declarative canvas
 * would be permanently poisoned by the `loseContext()` that teardown performs.
 * React's StrictMode mounts, unmounts and remounts effects, and that sequence
 * would otherwise leave the surface permanently blank.
 *
 * If WebGL is unavailable the canvas is left empty and the CSS supplies a static
 * condensation gradient, so the page still reads as glass rather than breaking.
 */
export function RainGlass({ className, children, onUnsupported, ...options }: RainGlassProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const canvas = document.createElement('canvas');
    canvas.className = styles.canvas;
    canvas.setAttribute('aria-hidden', 'true');
    host.appendChild(canvas);

    let renderer: RainGlassRenderer | null = null;
    try {
      renderer = new RainGlassRenderer(canvas, options);
      renderer.start();
      setReady(true);
    } catch (error) {
      console.warn('[RainGlass] falling back to a static pane:', error);
      onUnsupported?.();
    }

    return () => {
      renderer?.destroy();
      canvas.remove();
    };
    // Options are read once at mount; changing them mid-life is not a use case
    // for this surface and would otherwise tear down and rebuild the GL context.
  }, []);

  return (
    <div className={[styles.root, ready ? styles.live : '', className].filter(Boolean).join(' ')}>
      <div ref={hostRef} className={styles.host} aria-hidden="true" />
      <div className={styles.content}>{children}</div>
    </div>
  );
}