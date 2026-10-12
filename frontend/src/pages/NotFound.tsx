import { useEffect } from 'react';
import { ButtonLink } from '../components/Button';
import layout from '../components/layout.module.css';
import { SITE } from '../config/site';

export default function NotFound() {
  useEffect(() => {
    document.title = `Page not found — ${SITE.name}`;
  }, []);

  return (
    <section className={`${layout.section} ${layout.surfaceDeep}`}>
      <div className={layout.container}>
        <div className={layout.split}>
          <div>
            <p className={layout.kicker}>Error 404</p>
            <h1 style={{ fontSize: 'var(--step-4)', maxWidth: '14ch' }}>
              This page has drained away.
            </h1>
          </div>
          <div className={layout.stack}>
            <p className={layout.lede}>
              The link you followed does not lead anywhere on this site. The pages below do.
            </p>
            <div className={layout.row}>
              <ButtonLink to="/" variant="leaf">
                Back to the home page
              </ButtonLink>
              <ButtonLink to="/care" variant="outlineLight">
                Areas of care
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}