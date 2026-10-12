import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { AnchorButton, ButtonLink } from '../components/Button';
import { HeroLeaf, LeafField, LeafSprig } from '../components/Botanical';
import { Logo } from '../components/Logo';
import { Reveal } from '../components/Reveal';
import layout from '../components/layout.module.css';
import { CARE_AREAS, CONTACT, FOUNDER, SITE } from '../config/site';
import styles from './page.module.css';

function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} — ${SITE.name}`;
  }, [title]);
}

/**
 * One fact, as a panel that tips toward the pointer.
 *
 * The four facts are the substance of this band, so rather than putting a
 * separate object underneath them — which left a second block of empty green —
 * each row *is* the 3D. Every panel is the same markup it was before: same
 * label, same value, same order. All that changes is that it now has a face,
 * an edge and a shadow, and leans a few degrees toward wherever the cursor is,
 * so the list reads as a small stack of cards rather than a wall of text.
 *
 * The tilt is written to CSS custom properties rather than to `style.transform`
 * directly, so the resting transform stays in the stylesheet and cannot be
 * clobbered by a re-render.
 *
 * Reduced motion keeps the face and the shadow — depth without movement — and
 * drops the pointer tracking entirely.
 */
function FactPanel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const track = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    // -1..1 across the panel, so the far edge lifts and the near edge dips.
    const px = ((e.clientX - r.left) / r.width) * 2 - 1;
    const py = ((e.clientY - r.top) / r.height) * 2 - 1;
    el.style.setProperty('--tilt-x', `${(-py * 5).toFixed(2)}deg`);
    el.style.setProperty('--tilt-y', `${(px * 7).toFixed(2)}deg`);
    el.style.setProperty('--gloss-x', `${((px + 1) / 2) * 100}%`);
    el.style.setProperty('--gloss-y', `${((py + 1) / 2) * 100}%`);
    el.style.setProperty('--lift', '1');
  };

  const settle = (el: HTMLDivElement | null) => {
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
    el.style.setProperty('--lift', '0');
  };

  return (
    <div
      ref={ref}
      className={styles.factRow}
      onPointerMove={track}
      onPointerLeave={(e) => settle(e.currentTarget)}
    >
      {/* Specular highlight that follows the pointer across the face. */}
      <span className={styles.factGloss} aria-hidden="true" />
      <dt className={styles.factLabel}>{label}</dt>
      <dd className={styles.factValue}>{children}</dd>
    </div>
  );
}

export default function About() {
  usePageTitle('About');

  return (
    <>
      {/* Cream editorial hero with a leaf medallion — the warmest route */}
      <section className={styles.aboutHero}>
        <div className={layout.container}>
          <div className={styles.aboutHeroInner}>
            <Reveal>
              <p className={layout.kicker}>The practice</p>
              <h1 style={{ fontSize: 'var(--step-4)', maxWidth: '14ch' }}>
                {SITE.shortName}, and the person behind it.
              </h1>
              <p className={styles.pageIntroStrong}>{SITE.stance}</p>
              <p className={styles.pageIntro}>
                A nutritional &amp; dietetic centre built around one idea: that specific,
                unhurried guidance beats general advice almost every time.
              </p>
            </Reveal>

            <Reveal delay={90} className={styles.aboutMedallion}>
              <HeroLeaf className={styles.aboutMedallionLeaf} rotate={-8} />
              <LeafSprig className={styles.aboutMedallionSprig} rotate={-16} />
              <Logo tone="dark" width={104} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* The founder, on plain light herbal */}
      <section className={`${layout.section} ${layout.surface}`} aria-labelledby="founder-title">
        <div className={layout.container}>
          <div className={layout.split}>
            <Reveal>
              <p className={layout.kicker}>Founder</p>
              <h2 id="founder-title" className={layout.sectionTitle}>
                {FOUNDER.name}
              </h2>
              <p
                style={{
                  marginTop: '0.4rem',
                  fontWeight: 600,
                  color: 'var(--botanic-600)',
                }}
              >
                {FOUNDER.role}
              </p>
            </Reveal>

            <Reveal delay={80} className={layout.prose}>
              <p style={{ fontSize: 'var(--step-1)', color: 'var(--botanic-900)' }}>
                {FOUNDER.intro}
              </p>
              <p>
                {SITE.shortName} grew out of repeated versions of the same problem: a
                person is told to eat differently, does it for ten days, and then meets a
                life that was never going to allow it. The plan was not wrong. It was not
                theirs.
              </p>
              <p>
                So the work here starts earlier than food. It starts with the week you
                actually have &mdash; the commute, the shift pattern, the family meals, the
                budget, the things you already enjoy eating &mdash; and builds from there.
              </p>
              <p>
                The account also carries a good deal of general nutrition education,
                because a person who understands why a change is being asked for will stick
                to it far more often than one who is simply told to.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The facts, on the deepest non-glass green */}
      <section className={styles.storyBand} aria-labelledby="about-facts">
        <LeafField className={layout.leafTexture} />
        <div className={layout.container}>
          <div className={styles.storyGrid}>
            <Reveal>
              <p className={`${layout.kicker} ${styles.kickerWhite}`}>The centre</p>
              <h2 id="about-facts" style={{ fontSize: 'var(--step-3)', maxWidth: '16ch' }}>
                {SITE.tagline}
              </h2>
              <p style={{ marginTop: 'var(--space-s)', color: 'var(--sage-300)', maxWidth: '44ch' }}>
                {SITE.description}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <dl style={{ display: 'grid', gap: 'var(--space-s)' }}>
                <FactPanel label="Practice">{SITE.name}</FactPanel>
                <FactPanel label="Focus">Personalised nutrition</FactPanel>
                <FactPanel label="Areas covered">
                  {CARE_AREAS.length} &mdash; from weight management and PCOS to
                  cardiopulmonary and geriatric nutrition
                </FactPanel>
                <FactPanel label="Contact">
                  <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">
                    {CONTACT.instagramHandle}
                  </a>
                </FactPanel>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={`${layout.section} ${layout.surfaceSage}`} aria-labelledby="about-cta">
        <div className={layout.container}>
          <Reveal className={layout.split}>
            <div>
              <p className={layout.kicker}>Enquiries</p>
              <h2 id="about-cta" className={layout.sectionTitle}>
                Start where you are
              </h2>
            </div>
            <div className={layout.stack}>
              <p className={layout.lede}>
                You do not need to arrive with a diagnosis, a plan or a clear goal.
              </p>
              <div className={layout.row}>
                <ButtonLink to="/contact">Start an enquiry</ButtonLink>
                <AnchorButton href={CONTACT.instagram} variant="outline">
                  {CONTACT.instagramHandle}
                </AnchorButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
