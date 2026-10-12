import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { AnchorButton, ButtonLink } from '../components/Button';
import { HeroLeaf, LeafField, LeafSprig } from '../components/Botanical';
import { Logo } from '../components/Logo';
import { Produce, ProduceCluster, type ProduceKind } from '../components/Produce';
import { RainGlass } from '../components/RainGlass';
import { Reveal } from '../components/Reveal';
import layout from '../components/layout.module.css';
import { CARE_AREAS, CONTACT, EDUCATION, FOUNDER, PRINCIPLES, SITE } from '../config/site';
import styles from './Home.module.css';

/**
 * A small beveled tile carrying the mark for each of the three principles.
 *
 * Same dimensional language as the logo plate on the literacy band — lit edge,
 * shaded underside, icon floating above the face — but square, much smaller,
 * and built from strokes rather than an image. Three of them in a column read
 * as a set, so the section gains rhythm instead of one more floating object.
 */
function PrincipleTile({ index }: { index: number }) {
  return (
    <span className={styles.tile} aria-hidden="true">
      <span className={styles.tileSheen} />
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" focusable="false">
        {index === 0 && (
          // A sprout: nothing extreme, it just grows.
          <>
            <path d="M12 21v-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path
              d="M12 14c0-3.3-2.2-5.6-5.5-5.9C6.1 11.3 8.3 13.6 12 14Z"
              fill="currentColor"
            />
            <path
              d="M12 14c0-3.3 2.2-5.6 5.5-5.9.4 3.2-1.8 5.5-5.5 5.9Z"
              fill="currentColor"
              opacity="0.62"
            />
          </>
        )}
        {index === 1 && (
          // A clock, echoing the face inside the logo's apple.
          <>
            <circle cx="12" cy="13" r="7.4" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 9.4V13l2.6 1.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M9.6 3.6h4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.62" />
          </>
        )}
        {index === 2 && (
          // Three ascending steps: one day, then the next.
          <>
            <rect x="3.2" y="15.4" width="4.4" height="5" rx="1.4" fill="currentColor" opacity="0.5" />
            <rect x="9.8" y="11" width="4.4" height="9.4" rx="1.4" fill="currentColor" opacity="0.78" />
            <rect x="16.4" y="6.4" width="4.4" height="14" rx="1.4" fill="currentColor" />
          </>
        )}
      </svg>
    </span>
  );
}

/**
 * The practice's clock-in-apple, rebuilt.
 *
 * The logo puts a clock face inside the apple because the practice is about
 * *when* you eat, not only what. This takes that motif and runs it as a real
 * dial: a beveled bezel, hour ticks, eight produce marks set where the hours
 * would be, and a hub with a hand. It is the one object on the page that is
 * purely the brand's own idea rather than decoration — and it gives the left
 * column something to hold.
 *
 * Entirely CSS and the existing Produce marks: no image, no model, no extra
 * request, and it stays crisp at any size.
 */
function NutritionClock() {
  const marks: ProduceKind[] = [
    'citrus', 'greens', 'apple', 'berries',
    'avocado', 'root', 'grain', 'citrus',
  ];
  const n = marks.length;

  return (
    <span className={styles.clock} aria-hidden="true">
      <span className={styles.clockBezel} />
      <span className={styles.clockTicks} />
      <span className={styles.clockDial}>
        {marks.map((kind, i) => (
          <span
            key={i}
            className={styles.clockMark}
            style={{ '--i': i, '--n': n } as CSSProperties}
          >
            <Produce kind={kind} />
          </span>
        ))}
      </span>
      <span className={styles.clockFace} />
      <span className={styles.clockHand} />
      <span className={styles.clockHub} />
    </span>
  );
}

/** Small leaf used as the hover affordance on the care index rows. */
function RowLeaf() {
  return (
    <svg
      className={styles.careLeaf}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 20C4 12 4 8 4 4c8 0 14 4 15 12-6 4-11 5-15 4Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path d="M4 20C6 13 10 8 16 6" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      {/* ---------------------------------------------- 1. glass hero */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <RainGlass speed={1} intensity={1}>
          <div className={styles.scrim} aria-hidden="true" />
        </RainGlass>

        <div className={`${layout.container} ${styles.heroInner}`}>
          <h1 id="hero-title" className={styles.heroTitle}>
            Nourish. <em>Transform.</em> Thrive.
          </h1>
          <p className={styles.heroSub}>
            Personalised nutrition care from a clinical &amp; wellness nutritionist — a
            plan built around your body, your routine and your life.
          </p>
          <div className={styles.heroActions}>
            <ButtonLink to="/contact" variant="leaf" size="lg">
              Start an enquiry
            </ButtonLink>
            <ButtonLink to="/care" variant="outlineLight" size="lg">
              Areas of care
            </ButtonLink>
          </div>
        </div>

        <p className={styles.scrollHint} aria-hidden="true">
          <span className={styles.scrollHintLine} />
          Scroll
        </p>
      </section>

      {/* ------------------------------------------- 2. light herbal */}
      <section className={`${layout.section} ${layout.surface}`} aria-labelledby="promise-title">
        <div className={layout.container}>
          <div className={styles.argument}>
            <Reveal className={styles.promiseStage}>
              <h2 id="promise-title" className={styles.promiseStack}>
                <span>Nourish.</span>
                <span>Transform.</span>
                <span>Thrive.</span>
              </h2>
              <NutritionClock />
            </Reveal>
            <Reveal delay={90} className={styles.argumentBody}>
              <div className={layout.prose}>
                <p>
                  Most nutrition advice fails for a simple reason: it is not specific to
                  the person receiving it. A plan that worked for one person is handed to
                  another, and it quietly stops making sense.
                </p>
                <p>
                  At {SITE.shortName} every plan is built from where you actually are —
                  your routine, your preferences, your constraints, and what you are
                  already managing alongside it. It is adjusted as those things move.
                </p>
                <p>
                  The aim is not a perfect plate. It is a set of habits that keeps working
                  on an ordinary Tuesday, when nobody is motivated.
                </p>
              </div>
              <p className={styles.signature}>
                {FOUNDER.name}
                <span>
                  {FOUNDER.role} &middot; Founder, {SITE.shortName}
                </span>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------ 3. deep botanical */}
      <section
        className={`${layout.section} ${layout.surfaceDeep}`}
        aria-labelledby="stance-title"
      >
        <LeafField className={layout.leafTexture} />
        <div className={layout.container}>
          <div className={styles.stance}>
            <Reveal>
              <p className={layout.kicker}>What this practice will not do</p>
              <h2 id="stance-title" className={styles.stanceLead}>
                Three things we will never ask of you.
              </h2>
            </Reveal>

            <Reveal delay={90} className={styles.stanceArt}>
              <HeroLeaf className={styles.stanceLeaf} />
              <LeafSprig className={styles.stanceSprig} rotate={-8} />
              <ul className={styles.stanceList}>
                {PRINCIPLES.map((p, i) => (
                  <li key={p.title} className={styles.stanceItem}>
                    <PrincipleTile index={i} />
                    <span className={styles.stanceItemText}>
                      <span className={styles.stanceItemTitle}>{p.title}</span>
                      <span className={styles.stanceItemBody}>{p.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- 4. soft sage */}
      <section className={`${layout.section} ${layout.surfaceSage}`} aria-labelledby="care-title">
        <div className={layout.container}>
          <Reveal className={layout.split}>
            <div>
              <p className={layout.kicker}>Areas of care</p>
              <h2 id="care-title" className={layout.sectionTitle}>
                What we work with
              </h2>
            </div>
            <p className={layout.lede}>
              Nutrition care is not one thing. Here is where a plan might start — and where
              it usually ends up being different from everyone else&rsquo;s.
            </p>
          </Reveal>

          <ul className={styles.careList} style={{ marginTop: 'var(--space-xl)' }}>
            {CARE_AREAS.map((area, i) => (
              <li key={area.id} className={styles.careItem}>
                <Reveal as="div" delay={Math.min(i, 4) * 60}>
                  <Link className={styles.careLink} to={`/care#${area.id}`}>
                    <span className={styles.careTitle}>{area.title}</span>
                    <span className={styles.careSummary}>{area.summary}</span>
                    <RowLeaf />
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------ 5. deeper green */}
      <section
        className={`${layout.section} ${styles.literacy}`}
        aria-labelledby="education-title"
      >
        <LeafField className={`${layout.leafTexture} ${styles.literacyLeaves}`} />
        <div className={layout.container}>
          <div className={styles.literacyHead}>
            <Reveal>
              <p className={layout.kicker}>Nutrition literacy</p>
              <h2 id="education-title" style={{ fontSize: 'var(--step-3)', maxWidth: '18ch' }}>
                What actually makes a plate work.
              </h2>

              {/* The mark, given volume: a beveled plate with a specular
                  sweep and the logo sitting proud of it. Built from gradients
                  and shadows rather than a rendered 3D asset, so it stays crisp
                  at any size and costs one image request. */}
              <div className={styles.plate} aria-hidden="true">
                <span className={styles.plateSheen} />
                <Logo width={132} tone="light" className={styles.plateLogo} />
              </div>
            </Reveal>

            {/* Produce, because this band is about reading food labels — a
                shelf of fruit and greens is the argument the four notes below
                are making, said once instead of four times. */}
            <Reveal delay={80} className={styles.literacyArt} aria-hidden="true">
              <ProduceCluster kinds={['greens', 'citrus', 'apple']} />
            </Reveal>
          </div>

          <div className={`${layout.grid2} ${styles.literacyNotes}`}>
            {EDUCATION.map((item, i) => (
              <Reveal key={item.title} delay={i * 90}>
                <hr className={layout.rule} style={{ marginBottom: 'var(--space-s)' }} />
                <h3 style={{ fontSize: 'var(--step-2)', marginBottom: 'var(--space-2xs)' }}>
                  {item.title}
                </h3>
                <p className={styles.literacyBody}>{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------- 6. founder + leaf */}
      <section className={`${layout.section} ${layout.surface}`} aria-labelledby="founder-title">
        <div className={layout.container}>
          <div className={styles.founder}>
            <Reveal className={styles.founderMedallion}>
              <LeafSprig className={styles.founderSprig} rotate={-14} />
              <Logo tone="dark" width={120} />
            </Reveal>
            <Reveal delay={90}>
              <p className={layout.kicker}>The practice</p>
              <h2 id="founder-title" className={styles.founderName}>
                {FOUNDER.name}
              </h2>
              <p className={styles.founderRole}>{FOUNDER.role}</p>
              <p className={styles.founderBody}>{FOUNDER.intro}</p>
              <div style={{ marginTop: 'var(--space-m)' }}>
                <ButtonLink to="/about" variant="outline">
                  Read the approach
                </ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- 7. closing band */}
      <section className={layout.surfaceGlass} aria-labelledby="cta-title">
        <RainGlass speed={0.7} intensity={0.55}>
          <div className={styles.scrim} aria-hidden="true" />
        </RainGlass>
        <div className={layout.container}>
          <div className={styles.ctaInner}>
            <p className={layout.kicker}>Enquiries</p>
            <h2 id="cta-title" className={styles.ctaTitle}>
              Small habits. A healthier tomorrow.
            </h2>
            <p className={styles.ctaBody}>
              Tell us a little about what you are managing, and we will come back to you
              with how a plan here would begin.
            </p>
            <div className={styles.ctaActions}>
              <ButtonLink to="/contact" variant="leaf" size="lg">
                Start an enquiry
              </ButtonLink>
              <AnchorButton href={CONTACT.instagram} variant="outlineLight" size="lg">
                Message us on Instagram
              </AnchorButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}