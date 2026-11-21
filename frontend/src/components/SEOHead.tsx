import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PAGE_SEO, SITE } from '../config/site';

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!content) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(url?: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!url) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = url;
}

export function SEOHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    const isKnown = Object.prototype.hasOwnProperty.call(PAGE_SEO, normalized);
    const page = isKnown ? PAGE_SEO[normalized as keyof typeof PAGE_SEO] : PAGE_SEO['*'];
    const origin = SITE.url;
    const canonical = isKnown && origin ? `${origin}${normalized}` : undefined;
    const image = origin ? `${origin}/brand/logo.png` : '';

    document.title = page.title;
    setMeta('name', 'description', page.description);
    setMeta('name', 'robots', isKnown ? 'index,follow' : 'noindex,follow');
    setCanonical(canonical);

    setMeta('property', 'og:title', page.title);
    setMeta('property', 'og:description', page.description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', canonical ?? '');
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:image:alt', `${SITE.name} logo`);
    setMeta('property', 'og:site_name', SITE.name);
    setMeta('property', 'og:locale', SITE.locale);
    // The verified share asset is the square brand logo, not a landscape card.
    setMeta('name', 'twitter:card', 'summary');
    setMeta('name', 'twitter:title', page.title);
    setMeta('name', 'twitter:description', page.description);
    setMeta('name', 'twitter:image', image);
    setMeta('name', 'twitter:url', canonical ?? '');

    let schema = document.getElementById('site-structured-data') as HTMLScriptElement | null;
    if (!isKnown || !origin) {
      schema?.remove();
      return;
    }
    if (!schema) {
      schema = document.createElement('script');
      schema.id = 'site-structured-data';
      schema.type = 'application/ld+json';
      document.head.appendChild(schema);
    }
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${origin}/#organization`,
          name: SITE.name,
          url: origin,
          description: SITE.description,
          logo: `${origin}/brand/logo.png`,
          sameAs: ['https://www.instagram.com/limitedspoon.wellness/'],
        },
        {
          '@type': 'WebSite',
          '@id': `${origin}/#website`,
          url: origin,
          name: SITE.name,
          inLanguage: 'en-IN',
          publisher: { '@id': `${origin}/#organization` },
        },
        {
          '@type': 'WebPage',
          '@id': `${canonical}#webpage`,
          url: canonical,
          name: page.title,
          description: page.description,
          isPartOf: { '@id': `${origin}/#website` },
          inLanguage: 'en-IN',
        },
      ],
    });
  }, [pathname]);

  return null;
}
