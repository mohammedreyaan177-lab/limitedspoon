import { useEffect } from 'react';
import { AnchorButton, ButtonLink } from '../components/Button';
import { LeafField } from '../components/Botanical';
import { Produce, ProduceCluster } from '../components/Produce';
import { Reveal } from '../components/Reveal';
import layout from '../components/layout.module.css';
import { CARE_AREAS, CARE_ART, CONTACT, SITE } from '../config/site';
import styles from './page.module.css';

function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} — ${SITE.name}`;
  }, [title]);
}

export default function Care() {
  usePageTitle('Areas of care');

  return (
    <>
      {/* Deep-green index hero — the darkest header band on the site */}
      <section className={styles.careHero}>
        <LeafField className={layout.leafTexture} />
        <div className={layout.container}>
          <div className={styles.careHeroInner}>
            <Reveal>
              <p className={layout.kicker}>Areas of care</p>
              <h1 style={{ fontSize: 'var(--step-4)', maxWidth: '16ch' }}>
                What we work with
              </h1>
            </Reveal>
            <Reveal delay={80}>
              <p className={styles.careIntro}>
                Personalised nutrition is built around your needs. These are the areas that
                plan tends to start in &mdash; and each of them turns out to be a different
                conversation.
              </p>
              <p className={styles.careIntro}>
                If your situation is not listed, it is still worth asking. The starting point
                is nearly always the same: what your week actually looks like.
              </p>

              <nav className={styles.jumpNav} aria-label="Jump to an area of care">
                {CARE_AREAS.map((area) => (
                  <a key={area.id} className={styles.jumpItem} href={`#${area.id}`}>
                    {area.title}
                  </a>
                ))}
              </nav>
            </Reveal>
          </div>
        </div>
      </section>

      {/* A full-width illustrated produce band. The route previously opened on
          a large dark block with nothing in it; this gives the page a visual
          subject immediately and leads the eye into the list below. */}
      <section className={styles.produceBand} aria-hidden="true">
        <div className={styles.produceStrip}>
          <Produce kind="greens" scale={1.5} />
          <Produce kind="apple" scale={1.25} />
          <Produce kind="citrus" scale={1.35} />
          <Produce kind="root" scale={1.2} />
          <Produce kind="berries" scale={1.3} />
          <Produce kind="avocado" scale={1.25} />
          <Produce kind="grain" scale={1.4} />
          <Produce kind="citrus" scale={1.2} />
        </div>
      </section>

      {/* Alternating rows across two greens give the list rhythm */}
      <section className={layout.surface} aria-labelledby="care-details">
        <div className={layout.container}>
          <h2 id="care-details" className="sr-only">
            Areas of care in detail
          </h2>

          {CARE_AREAS.map((area, i) => (
            <Reveal
              key={area.id}
              className={`${styles.detail} ${i % 2 === 1 ? styles.detailAlt : ''}`}
            >
              <div className={styles.detailHead}>
                <div className={styles.artWell}>
                  <ProduceCluster
                    kinds={CARE_ART[area.id] ?? ['greens']}
                    className={styles.artCluster}
                  />
                </div>
                <h3 id={area.id} className={styles.detailTitle}>
                  {area.title}
                </h3>
              </div>
              <div>
                <p className={styles.detailSummary}>{area.summary}</p>
                <ul className={styles.focus}>
                  {area.focus.map((f) => (
                    <li key={f} className={styles.focusItem}>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={layout.surfaceCream} aria-labelledby="care-note-title">
        <div className={layout.container}>
          <h2 id="care-note-title" className="sr-only">
            A note on scope
          </h2>
          <Reveal>
            <div className={styles.note}>
              <p>
                <strong>Nutrition work here runs alongside the medical care you already
                have</strong> &mdash; it does not replace it. If you are managing diabetes,
                PCOS, heart or lung conditions, or are pregnant or postpartum, your doctor
                or midwife should be aware of any changes to your eating. Nothing on this
                site is medical advice or a diagnosis.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={`${layout.section} ${layout.surfaceDeep}`} aria-labelledby="care-cta">
        <LeafField className={layout.leafTexture} />
        <div className={layout.container}>
          <Reveal className={layout.split}>
            <div>
              <p className={layout.kicker}>Enquiries</p>
              <h2 id="care-cta" style={{ fontSize: 'var(--step-3)' }}>
                Not sure which one applies?
              </h2>
            </div>
            <div className={layout.stack}>
              <p className={layout.lede}>
                Start with what you are managing. The rest can be worked out together.
              </p>
              <div className={layout.row}>
                <ButtonLink to="/contact" variant="leaf">
                  Start an enquiry
                </ButtonLink>
                <AnchorButton href={CONTACT.instagram} variant="outlineLight">
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