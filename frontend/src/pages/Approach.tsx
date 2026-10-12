import { useEffect } from 'react';
import { AnchorButton, ButtonLink } from '../components/Button';
import { HeroLeaf, LeafField, PlateMark } from '../components/Botanical';
import { Reveal } from '../components/Reveal';
import layout from '../components/layout.module.css';
import { CONTACT, EDUCATION, PRINCIPLES, SITE } from '../config/site';
import styles from './page.module.css';

function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} — ${SITE.name}`;
  }, [title]);
}

const STEPS = [
  {
    title: 'We look at the whole picture',
    body: 'Not just what you eat, but your routine, your work, your sleep, what you are managing medically and what you actually enjoy. A plan that ignores your life is not a plan.',
  },
  {
    title: 'We build it around you',
    body: 'Your preferences, your budget, your household, your appetite. Nobody is asked to eat food they hate or to spend money they do not have.',
  },
  {
    title: 'We adjust as you go',
    body: 'Plans meet real weeks — the ones that go badly included. The review is where the work actually happens.',
  },
];

/**
 * A gyroscope, standing in for the section's argument.
 *
 * The band says this practice is the opposite of restriction and guilt — no
 * extreme changes, no pressure, one day at a time. A gyroscope is the physical
 * version of that: three rings on different axes, each spinning, and the whole
 * assembly staying upright. Nudge it and it leans, then settles back rather
 * than toppling.
 *
 * One ring per principle. Each ring's bead travels the circuit at an ordinary
 * pace, which is the "one day at a time" line said without words.
 *
 * Genuinely open 3D — rings on three different axes under a shared perspective —
 * rather than the flat disc used on the home page, so the two never read as
 * the same object twice. Reduced motion keeps the form and stops it moving.
 */
function StanceGyroscope() {
  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * 2 - 1;
    const py = ((e.clientY - r.top) / r.height) * 2 - 1;
    el.style.setProperty('--gx', `${(14 - py * 16).toFixed(1)}deg`);
    el.style.setProperty('--gy', `${(-20 + px * 22).toFixed(1)}deg`);
  };

  const settle = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--gx', '14deg');
    e.currentTarget.style.setProperty('--gy', '-20deg');
  };

  return (
    <div
      className={styles.gyro}
      onPointerMove={tilt}
      onPointerLeave={settle}
      aria-hidden="true"
    >
      <div className={styles.gyroRotor}>
        <span className={`${styles.gyroRing} ${styles.gyroRingA}`}>
          <span className={styles.gyroBead} />
        </span>
        <span className={`${styles.gyroRing} ${styles.gyroRingB}`}>
          <span className={styles.gyroBead} />
        </span>
        <span className={`${styles.gyroRing} ${styles.gyroRingC}`}>
          <span className={styles.gyroBead} />
        </span>
        <span className={styles.gyroCore} />
      </div>
    </div>
  );
}

export default function Approach() {
  usePageTitle('Approach');

  return (
    <>
      {/* Airy light herbal hero — deliberately the opposite of the home glass */}
      <section className={styles.heroLight}>
        <HeroLeaf className={styles.heroLightArt} rotate={12} />
        <div className={layout.container}>
          <div className={styles.heroLightInner}>
            <Reveal>
              <p className={layout.kicker}>The approach</p>
              <h1 className={styles.pageTitle}>A plan that survives an ordinary week.</h1>
            </Reveal>
            <Reveal delay={80}>
              <p className={styles.pageIntro}>
                The difference between advice that works and advice that does not is almost
                never knowledge. It is whether the plan fits the person it was made for.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The three questions, on plain sage */}
      <section className={`${layout.section} ${layout.surfaceSage}`} aria-labelledby="steps-title">
        <div className={layout.container}>
          <Reveal className={layout.split}>
            <div>
              <p className={layout.kicker}>How a plan takes shape</p>
              <h2 id="steps-title" className={layout.sectionTitle}>
                Three questions before any food advice
              </h2>
            </div>
            <p className={layout.lede}>
              Nothing here is a technique or a protocol. It is the order in which the
              questions get asked.
            </p>
          </Reveal>

          <div className={layout.grid2} style={{ marginTop: 'var(--space-xl)' }}>
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                {/* The sequence is real here, so the index is information, not
                    decoration: 01/02/03 track a genuine order. */}
                <PlateMark
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    color: 'var(--botanic-600)',
                    opacity: 0.55,
                    marginBottom: 'var(--space-s)',
                  }}
                />
                <p
                  style={{
                    fontSize: 'var(--step--1)',
                    fontWeight: 600,
                    color: 'var(--botanic-700)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 style={{ fontSize: 'var(--step-2)', margin: '0.2rem 0 var(--space-2xs)' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--text-muted)' }}>{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The stance, inverted onto deep green */}
      <section
        className={`${layout.section} ${layout.surfaceDeep}`}
        aria-labelledby="stance-title"
      >
        <LeafField className={layout.leafTexture} />
        <div className={layout.container}>
          {/* Heading and gyroscope share the top row. Everything below is
              untouched — the gyroscope sits only in the space that was empty. */}
          <div className={styles.stanceTop}>
            <Reveal>
              <p className={layout.kicker}>The stance</p>
              <h2 id="stance-title" style={{ fontSize: 'var(--step-3)', maxWidth: '20ch' }}>
                There is a version of nutrition advice built on restriction and guilt.
              </h2>
              <p style={{ marginTop: 'var(--space-s)', maxWidth: '46ch', color: 'var(--sage-300)' }}>
                It produces short bursts of change and a lot of people deciding it was never
                for them. Here is what this practice does instead.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <StanceGyroscope />
            </Reveal>
          </div>

          <div className={layout.grid2} style={{ marginTop: 'var(--space-xl)' }}>
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <hr className={layout.rule} style={{ marginBottom: 'var(--space-s)' }} />
                <h3 style={{ fontSize: 'var(--step-2)', marginBottom: 'var(--space-2xs)' }}>
                  {p.title}
                </h3>
                <p style={{ color: 'var(--sage-300)' }}>{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Nutrition literacy, back to light */}
      <section className={`${layout.section} ${layout.surfaceCream}`} aria-labelledby="approach-edu">
        <div className={layout.container}>
          <Reveal>
            <p className={layout.kicker}>Nutrition literacy</p>
            <h2 id="approach-edu" style={{ fontSize: 'var(--step-3)', maxWidth: '20ch' }}>
              Before you buy it, read it.
            </h2>
          </Reveal>
          <div className={layout.grid2} style={{ marginTop: 'var(--space-xl)' }}>
            {EDUCATION.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <hr className={layout.rule} style={{ marginBottom: 'var(--space-s)' }} />
                <h3 style={{ fontSize: 'var(--step-2)', marginBottom: 'var(--space-2xs)' }}>
                  {item.title}
                </h3>
                <p style={{ color: 'var(--text-muted)' }}>{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={`${layout.section} ${layout.surface}`} aria-labelledby="approach-cta">
        <div className={layout.container}>
          <Reveal className={layout.split}>
            <div>
              <p className={layout.kicker}>Next</p>
              <h2 id="approach-cta" className={layout.sectionTitle}>
                See where a plan might start
              </h2>
            </div>
            <div className={layout.stack}>
              <p className={layout.lede}>
                The areas this practice works with, and what each one actually involves.
              </p>
              <div className={layout.row}>
                <ButtonLink to="/care">Areas of care</ButtonLink>
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