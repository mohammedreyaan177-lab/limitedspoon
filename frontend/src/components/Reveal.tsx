import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import styles from './Reveal.module.css';

export interface RevealProps {
  children: ReactNode;
  /** Stagger in ms, applied as a transition delay. */
  delay?: number;
  as?: ElementType;
  className?: string;
}

/**
 * Fades content up as it enters the viewport.
 *
 * Uses IntersectionObserver and disconnects after the first reveal — these
 * sections do not animate back out, and keeping the observer alive on a long
 * page costs more than it returns.
 *
 * Robustness, in order of importance:
 *   1. `prefers-reduced-motion` renders the content visible on first paint,
 *      with no observer attached, so nothing ever waits on a scroll that will
 *      not animate.
 *   2. No IntersectionObserver support also renders immediately.
 *   3. A failsafe timer reveals the content regardless. Content that is
 *      permanently invisible is a far worse failure than content that fades
 *      in slightly later than intended, so the animation is never allowed to
 *      be the reason a visitor cannot read the page.
 */
export function Reveal({ children, delay = 0, as: Tag = 'div', className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    const reveal = () => setShown(true);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    observer.observe(el);

    // Failsafe: never let an animation gate readability.
    const failsafe = window.setTimeout(() => {
      reveal();
      observer.disconnect();
    }, 4000);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={[styles.reveal, shown ? styles.shown : '', className].filter(Boolean).join(' ')}
      style={delay ? ({ transitionDelay: `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}