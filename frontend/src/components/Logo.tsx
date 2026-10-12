import styles from './Logo.module.css';

export interface LogoProps {
  /** `light` renders a white knockout for dark backgrounds, `dark` the brand green. */
  tone?: 'dark' | 'light';
  /** Approx rendered width in px. The asset is 765x677, so anything at or
   *  below ~382px stays crisp on a 2x display. */
  width?: number;
  className?: string;
}

/**
 * The company's own logo, from the master artwork in `data/logo.jpg`.
 *
 * The source is a 1280x2800 JPEG — the lockup centred on white between two
 * black letterbox bars. The bars were trimmed, and the lockup was then cut from
 * white to a real alpha channel: coverage is taken from each pixel's distance
 * to white, then the white is divided back out of the partially covered edge
 * pixels, so the anti-aliased edges keep their own colour instead of carrying
 * a white fringe.
 *
 * This replaced two earlier cuts, both visibly soft at size: one derived from
 * the Instagram profile picture (145x123, and a different rendering of the
 * mark), and one lifted from a brand post (278x233, on a mottled ground that
 * left a cream cast along the edges). At 765px wide this holds up at 2x
 * everywhere the site actually uses it.
 *
 * `tone="light"` uses a filter knockout rather than a second asset: one file,
 * one HTTP request, and the mark stays a single source of truth. The apple's
 * interior is genuinely transparent, so on a dark ground the knockout reads as
 * a white outline rather than a solid blob.
 */
export function Logo({ tone = 'dark', width = 54, className }: LogoProps) {
  return (
    <img
      src="/brand/logo.png"
      alt="Limited Spoon Wellness — Nutritional & Dietetic Centre"
      width={765}
      height={677}
      className={[styles.logo, tone === 'light' ? styles.light : '', className].filter(Boolean).join(' ')}
      style={{ width: `${width}px` }}
      decoding="async"
    />
  );
}