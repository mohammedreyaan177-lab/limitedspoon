import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { Intro } from './Intro';

/**
 * Puts the viewport at the top, on a fresh load and on every route change.
 *
 * Two separate problems, and the second was the one that bit:
 *
 *  1. Browsers restore scroll position on refresh by default, so a visitor
 *     reloading landed halfway down whichever page they left. `index.html` sets
 *     `scrollRestoration = 'manual'` and zeroes the offset before first paint —
 *     this component is the backstop, not the primary mechanism.
 *
 *  2. SPA navigation never reset at all. This originally depended on `[]`, so
 *     it fired once per mount — but `Layout` is shared by every route below the
 *     home hero, so moving between `/care` and `/about` reused the same
 *     instance and the effect never re-ran. Clicking a header link from 1,600px
 *     down landed you 1,600px down on the next page. Keying the effect to
 *     `pathname` is what actually fixes it.
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export interface LayoutProps {
  /** Only the home route opens on a full-bleed glass hero, so only it asks
   *  for the transparent header treatment. */
  heroHeader?: boolean;
}

export function Layout({ heroHeader = false }: LayoutProps) {
  const { pathname } = useLocation();

  // Set as early as possible so the browser does not restore a stale offset.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <>
      <Intro />
      <a href="#main" className="sr-only">
        Skip to content
      </a>
      <ScrollToTop />
      <Header hero={heroHeader} />
      <main id="main" tabIndex={-1} key={pathname}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}