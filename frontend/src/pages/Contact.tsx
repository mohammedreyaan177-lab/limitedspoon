import { useEffect, useRef, useState } from 'react';
import { AnchorButton, Button } from '../components/Button';
import { GrowthRings } from '../components/Botanical';
import { Reveal } from '../components/Reveal';
import layout from '../components/layout.module.css';
import { CARE_AREAS, CONTACT, SITE } from '../config/site';
import styles from './Contact.module.css';
import page from './page.module.css';

function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} — ${SITE.name}`;
  }, [title]);
}

type FieldName = 'name' | 'email' | 'phone' | 'topic' | 'message' | 'consent';

interface Values {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
  consent: boolean;
}

type Errors = Partial<Record<FieldName, string>>;

const EMPTY: Values = { name: '', email: '', phone: '', topic: '', message: '', consent: false };

/* Deliberately permissive: it rejects the obvious typos without pretending to
   implement RFC 5322, which would reject valid addresses. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Values): Errors {
  const errors: Errors = {};

  if (!values.name.trim()) errors.name = 'Please tell us your name.';
  if (!values.email.trim()) {
    errors.email = 'Please add an email address so we can reply.';
  } else if (!EMAIL_RE.test(values.email.trim())) {
    errors.email = 'That email address does not look quite right.';
  }
  if (values.message.trim().length < 12) {
    errors.message = 'A sentence or two about what you are managing helps us reply properly.';
  }
  if (!values.consent) errors.consent = 'Please confirm we may use your details to reply.';

  return errors;
}

function composeBody(v: Values): string {
  const topic = v.topic || 'Not sure yet';
  return [
    `Name: ${v.name.trim()}`,
    `Email: ${v.email.trim()}`,
    v.phone.trim() ? `Phone: ${v.phone.trim()}` : '',
    `Area of care: ${topic}`,
    '',
    v.message.trim(),
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Enquiry form.
 *
 * Submission path is honest about what actually exists. There is no backend
 * and none was invented, so:
 *   - if the practice publishes an enquiry address, the form composes a
 *     fully-formed `mailto:` and hands it to the visitor's mail client;
 *   - if it does not, the form copies the composed message to the clipboard
 *     and opens the Instagram thread, telling the visitor exactly that.
 * Either way the visitor leaves with their message intact.
 */
export default function Contact() {
  usePageTitle('Contact');

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<{ kind: 'email' | 'instagram'; text: string } | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const update = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear a field's error as soon as the visitor edits it, so the form does
    // not shout at someone mid-correction.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);

    const next = validate(values);
    setErrors(next);

    if (Object.keys(next).length > 0) {
      // Move focus to the summary so the failure is announced, not just painted.
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    const body = composeBody(values);
    const subject = `Nutrition enquiry — ${values.name.trim()}`;

    if (CONTACT.email) {
      window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;
      setStatus({
        kind: 'email',
        text: 'Your email app should now be open with the enquiry ready to send. If nothing happened, write to us on Instagram instead.',
      });
      return;
    }

    // No published address — hand the message over via the clipboard so
    // nothing the visitor typed is lost.
    void navigator.clipboard?.writeText(`${subject}\n\n${body}`).catch(() => undefined);
    window.open(CONTACT.instagram, '_blank', 'noopener,noreferrer');
    setStatus({
      kind: 'instagram',
      text: `We have copied your enquiry to your clipboard — paste it into the message box on Instagram. This practice does not yet publish an email address, so Instagram is the direct route.`,
    });
  };

  const err = (name: FieldName) => (submitted ? errors[name] : undefined);
  const describedBy = (name: FieldName, hint?: string) =>
    [err(name) ? `${name}-error` : '', hint ? `${name}-hint` : ''].filter(Boolean).join(' ') ||
    undefined;

  return (
    <>
      {/* Deepest ground on the site, with a light sage form panel dropped onto
          it. The inversion is the point: an enquiry form on a dark botanical
          page reads as a distinct, deliberate surface. */}
      <section className={page.contactWrap}>
        <div className={layout.container} style={{ paddingBlock: 'var(--space-2xl)' }}>
          <div className={page.contactInner}>
            <Reveal className={page.contactForm}>
              <p className={layout.kicker}>Enquiries</p>
              <h1 style={{ fontSize: 'var(--step-3)', marginBottom: 'var(--space-s)' }}>
                Start a conversation
              </h1>
              <p
                style={{
                  color: 'var(--text-muted)',
                  marginBottom: 'var(--space-l)',
                  maxWidth: '44ch',
                }}
              >
                Tell us a little about what you are managing. You do not need a diagnosis or
                a goal in mind &mdash; that part is the work.
              </p>

              {status && (
                <div className={styles.status} role="status" aria-live="polite">
                  <p className={styles.statusTitle}>
                    {status.kind === 'email' ? 'Almost sent' : 'Your enquiry is ready'}
                  </p>
                  <p>{status.text}</p>
                </div>
              )}

              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                {submitted && Object.keys(errors).length > 0 && (
                  <div
                    className={styles.summary}
                    role="alert"
                    tabIndex={-1}
                    ref={summaryRef}
                  >
                    <p className={styles.summaryTitle}>
                      There {Object.keys(errors).length === 1 ? 'is 1 thing' : `are ${Object.keys(errors).length} things`} to check
                    </p>
                    <ul className={styles.summaryList}>
                      {Object.entries(errors).map(([key, message]) => (
                        <li key={key}>{message}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="name">
                      Your name
                    </label>
                    <input
                      id="name"
                      name="name"
                      className={`${styles.control} ${err('name') ? styles.invalid : ''}`}
                      value={values.name}
                      onChange={(e) => update('name', e.target.value)}
                      aria-invalid={err('name') ? true : undefined}
                      aria-describedby={describedBy('name')}
                      autoComplete="name"
                      required
                    />
                    {err('name') && (
                      <p className={styles.error} id="name-error">
                        <span aria-hidden="true">⚠</span> {err('name')}
                      </p>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="email">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      inputMode="email"
                      className={`${styles.control} ${err('email') ? styles.invalid : ''}`}
                      value={values.email}
                      onChange={(e) => update('email', e.target.value)}
                      aria-invalid={err('email') ? true : undefined}
                      aria-describedby={describedBy('email')}
                      autoComplete="email"
                      required
                    />
                    {err('email') && (
                      <p className={styles.error} id="email-error">
                        <span aria-hidden="true">⚠</span> {err('email')}
                      </p>
                    )}
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="phone">
                      Phone <span className={styles.optional}>(optional)</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      className={styles.control}
                      value={values.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      aria-describedby="phone-hint"
                      autoComplete="tel"
                    />
                    <p className={styles.hint} id="phone-hint">
                      Only if you would rather be called than emailed.
                    </p>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="topic">
                      Area of care <span className={styles.optional}>(optional)</span>
                    </label>
                    <select
                      id="topic"
                      name="topic"
                      className={styles.control}
                      value={values.topic}
                      onChange={(e) => update('topic', e.target.value)}
                    >
                      <option value="">Not sure yet</option>
                      {CARE_AREAS.map((area) => (
                        <option key={area.id} value={area.title}>
                          {area.title}
                        </option>
                      ))}
                      <option value="Something else">Something else</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="message">
                    What would you like help with?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className={`${styles.control} ${err('message') ? styles.invalid : ''}`}
                    value={values.message}
                    onChange={(e) => update('message', e.target.value)}
                    aria-invalid={err('message') ? true : undefined}
                    aria-describedby={describedBy('message')}
                    rows={5}
                    required
                  />
                  {err('message') ? (
                    <p className={styles.error} id="message-error">
                      <span aria-hidden="true">⚠</span> {err('message')}
                    </p>
                  ) : (
                    <p className={styles.hint} id="message-hint">
                      A few lines is plenty.
                    </p>
                  )}
                </div>

                <div className={styles.field}>
                  <div className={styles.consentRow}>
                    <input
                      id="consent"
                      name="consent"
                      type="checkbox"
                      className={`${styles.checkbox} ${err('consent') ? styles.invalid : ''}`}
                      checked={values.consent}
                      onChange={(e) => update('consent', e.target.checked)}
                      aria-invalid={err('consent') ? true : undefined}
                      aria-describedby={describedBy('consent')}
                    />
                    <div>
                      <label className={styles.label} htmlFor="consent">
                        You may use these details to reply to my enquiry.
                      </label>
                      {err('consent') && (
                        <p className={styles.error} id="consent-error">
                          <span aria-hidden="true">⚠</span> {err('consent')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.actions}>
                  <Button type="submit" size="lg">
                    Send enquiry
                  </Button>
                  <AnchorButton href={CONTACT.instagram} variant="outline">
                    {CONTACT.instagramHandle}
                  </AnchorButton>
                </div>
              </form>

              {/* The one place this route deviates from every other: a note
                  explaining why there is no address to call or email. */}
              <div className={styles.contactNote}>
                <p>
                  This practice has not yet published an email address or phone number, so
                  enquiries are handled on Instagram. That is the only contact channel the
                  centre publishes &mdash; it is not a placeholder on this site.
                </p>
              </div>
            </Reveal>

            {/* ------------------------------------------------- info panel */}
            <Reveal delay={90} as="aside" className={page.info} aria-label="Contact details">
              <GrowthRings className={page.infoRings} />
              <div className={page.infoBlock}>
                <h2 className={page.infoLabel}>Direct</h2>
                <p className={page.infoValue}>
                  <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">
                    {CONTACT.instagramHandle}
                  </a>
                </p>
                <p className={page.infoNote}>
                  The practice&rsquo;s published contact channel. Messages here are read
                  directly.
                </p>
              </div>

              <div className={page.infoBlock}>
                <h2 className={page.infoLabel}>What to include</h2>
                <p className={page.infoValue}>Your goal, and anything in the way.</p>
                <p className={page.infoNote}>
                  If you are already under medical care, mentioning that helps.
                </p>
              </div>

              <div className={page.infoBlock}>
                <h2 className={page.infoLabel}>Before you write</h2>
                <p className={page.infoNote} style={{ marginTop: 0 }}>
                  <a href="/approach">The approach</a> &middot;{' '}
                  <a href="/care">areas of care</a>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}