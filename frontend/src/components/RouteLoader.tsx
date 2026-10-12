import styles from './RouteLoader.module.css';

/**
 * Suspense fallback. Reserves a screen-height block so a lazy route does not
 * collapse the scrollbar and then push the page down when it arrives.
 */
export function RouteLoader() {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>
    </div>
  );
}