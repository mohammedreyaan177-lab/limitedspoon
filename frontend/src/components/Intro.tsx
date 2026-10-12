import { useEffect, useState } from 'react';
import { LeafField } from './Botanical';
import { Logo } from './Logo';
import { SITE } from '../config/site';
import styles from './Intro.module.css';

/**
 * Timing, in ms from mount.
 *
 * The mark's pop runs `POP_DELAY + POP_DUR` (see Intro.module.css), so that is
 * the moment it has finished arriving. The hold then keeps it on screen, settled
 * and fully legible, for a full second and a half before anything moves — long
 * enough to actually register as the brand rather than as a flash.
 * `EXIT_AT + FADE_DUR` is when the node finally unmounts.
 */
const POP_DELAY = 90;
const POP_DUR = 780;
const HOLD_AFTER_POP = 1500;
const FADE_DUR = 640;

const EXIT_AT = POP_DELAY + POP_DUR + HOLD_AFTER_POP; // 2370ms
const DONE_AT = EXIT_AT + FADE_DUR; // 3010ms

export interface IntroProps {
  /**
   * Exit immediately. Used by tests and by anything that needs to assert on the
   * page underneath without waiting out the sequence.
   */
  disabled?: boolean;
}

/**
 * Full-bleed brand intro.
 *
 * Plays once per **page load**, not once per route change: the component is
 * mounted by the shared Layout, which survives client-side navigation, so only a
 * hard refresh (or a cold open) replays it.
 *
 * Accessibility contract:
 *  - The overlay is aria-hidden and holds no focusable content, so it cannot
 *    trap a screen-reader or keyboard user.
 *  - Under `prefers-reduced-motion` the sequence is suppressed in CSS and this
 *    component unmounts almost immediately.
 *  - The page behind is scroll-locked while it is up, and released on the way
 *    out, so content is never revealed mid-scroll.
 */
export function Intro({ disabled = false }: IntroProps) {
  const reduced =
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [phase, setPhase] = useState<'in' | 'out' | 'gone'>('in');
  const show = !disabled && !reduced;
  const up = show && phase !== 'gone';

  // Timers only. Deliberately separate from the scroll lock below, because the
  // component renders `null` rather than unmounting when the intro finishes —
  // a cleanup tied to the timer effect would therefore never run at the exact
  // moment the page most needs to be scrollable again.
  useEffect(() => {
    if (!show) {
      setPhase('gone');
      return;
    }
    const exit = window.setTimeout(() => setPhase('out'), EXIT_AT);
    const done = window.setTimeout(() => setPhase('gone'), DONE_AT);
    return () => {
      window.clearTimeout(exit);
      window.clearTimeout(done);
    };
  }, [show]);

  // Lock the page only while the splash is genuinely on screen. Keyed to `up`,
  // so the moment the intro ends the cleanup fires and scrolling returns.
  useEffect(() => {
    if (!up) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [up]);

  if (phase === 'gone') return null;

  return (
    <div
      className={`${styles.overlay} ${phase === 'out' ? styles.overlayFading : ''}`}
      aria-hidden="true"
      data-testid="intro"
      data-phase={phase}
    >
      <LeafField className={styles.texture} />
      <div className={styles.glow} />

      <div className={`${styles.stage} ${phase === 'out' ? styles.lifting : ''}`}>
        {/* The company's real mark — apple, wordmark and strapline in one asset,
            in its own colours. Nothing here redraws the logo.
            It sits on the exact centre of the viewport; the rule and strapline
            are lifted out and hung below it so they cannot pull the mark off
            centre. The CSS caps its width and scales it down on narrow
            viewports. */}
        <span className={styles.mark}>
          <Logo width={382} className={styles.markImg} />
        </span>

        <div className={styles.caption}>
          <span className={styles.rule} />
          <p className={styles.stance}>{SITE.stance}</p>
        </div>
      </div>
    </div>
  );
}