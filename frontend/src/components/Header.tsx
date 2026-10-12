import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnchorButton, ButtonLink } from './Button';
import { Logo } from './Logo';
import { CONTACT, NAV, SITE } from '../config/site';
import layout from './layout.module.css';
import styles from './Header.module.css';

/**
 * Sticky site header.
 *
 * The bar is transparent over the glass hero and settles to frosted sage once
 * scrolled, so the water reads uninterrupted at rest. Routes without a glass
 * hero opt out via `hero={false}` and start in the light chrome.
 *
 * Mobile menu behaviour is explicit rather than library-driven: the drawer is a
 * real `<nav>`, the toggle carries aria-expanded/aria-controls, Escape closes
 * it, focus returns to the toggle, the page behind it cannot scroll, and
 * closing on route change is handled here rather than left to the router.
 */
export function Header({ hero = false }: { hero?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const headerClass = [
    styles.header,
    hero && !scrolled ? styles.overHero : '',
    scrolled ? (hero ? styles.overHeroScrolled : styles.scrolled) : '',
  ]
    .filter(Boolean)
    .join(' ');

  // Close on navigation.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock the page behind the drawer.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape closes and returns focus to the control that opened the drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Never leave a pending timer behind on unmount.
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <header className={headerClass} data-testid="site-header">
      <div className={`${layout.container} ${styles.inner}`}>
        <Link to="/" className={styles.homeLink} aria-label={`${SITE.name} — home`}>
          <Logo tone={hero && !scrolled ? 'light' : 'dark'} width={54} />
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <AnchorButton
            href={CONTACT.instagram}
            variant={hero && !scrolled ? 'outlineLight' : 'outline'}
          >
            Instagram
          </AnchorButton>
          <ButtonLink to="/contact" variant={hero && !scrolled ? 'leaf' : 'solid'}>
            Start an enquiry
          </ButtonLink>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
          data-testid="menu-toggle"
        >
          <span className={styles.bars} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {open && (
        <div className={styles.drawer} id="mobile-nav">
          <nav className={styles.drawerList} aria-label="Primary (mobile)">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={close}
                className={({ isActive }) =>
                  `${styles.drawerLink} ${isActive ? styles.drawerLinkActive : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.drawerCta}>
            <ButtonLink to="/contact" size="lg" fullWidth>
              Start an enquiry
            </ButtonLink>
            <AnchorButton href={CONTACT.instagram} variant="outline" fullWidth>
              {CONTACT.instagramHandle}
            </AnchorButton>
          </div>

          <p className={styles.drawerMeta}>{SITE.stance}</p>
        </div>
      )}
    </header>
  );
}