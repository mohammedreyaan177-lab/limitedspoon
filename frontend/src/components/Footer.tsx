import { Link } from 'react-router-dom';
import { LeafField } from './Botanical';
import { CONTACT, NAV, SITE } from '../config/site';
import { Logo } from './Logo';
import layout from './layout.module.css';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <LeafField className={styles.texture} />
      <div className={layout.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Logo tone="light" width={78} />
            <p className={styles.blurb}>{SITE.description}</p>
          </div>

          <nav aria-label="Footer">
            <h2 className={styles.heading}>Explore</h2>
            <ul className={styles.list}>
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link className={styles.link} to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={styles.heading}>Get in touch</h2>
            <ul className={styles.list}>
              <li>
                <a
                  className={styles.link}
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {CONTACT.instagramHandle}
                </a>
              </li>
              <li>
                <Link className={styles.link} to="/contact">
                  Start an enquiry
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.base}>
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p>{SITE.stance}</p>
        </div>

        <p className={styles.disclaimer}>
          The content on this site is general nutrition information, not medical advice,
          diagnosis or treatment, and is not a substitute for consultation with a
          qualified healthcare professional. Please seek advice from your doctor or other
          qualified health provider about any medical condition.
        </p>
      </div>
    </footer>
  );
}