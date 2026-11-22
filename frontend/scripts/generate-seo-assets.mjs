import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';
import { createElement } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import { StaticRouter } from 'react-router-dom';

const env = { ...loadEnv('production', process.cwd(), ''), ...process.env };
const configuredUrl = env.VITE_SITE_URL?.trim();
const productionUrl = 'https://www.limitedspoon.online';
let origin = '';

if (configuredUrl !== productionUrl) {
  throw new Error(`Production VITE_SITE_URL must be exactly ${productionUrl}; received ${configuredUrl || '(unset)'}.`);
}

if (configuredUrl) {
  let parsed;
  try {
    parsed = new URL(configuredUrl);
  } catch {
    throw new Error('VITE_SITE_URL must be an absolute production URL, for example https://example.online');
  }
  if (!['https:', 'http:'].includes(parsed.protocol) || parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('VITE_SITE_URL must contain only the production origin, with no path, query, or hash.');
  }
  origin = parsed.origin;
}

const outputDirectory = resolve(process.cwd(), 'dist');
await mkdir(outputDirectory, { recursive: true });

const pageSeo = JSON.parse(await readFile(resolve(process.cwd(), 'src/config/page-seo.json'), 'utf8'));
const routes = Object.keys(pageSeo).filter((route) => route !== '*');
const vite = await (await import('vite')).createServer({
  configFile: resolve(process.cwd(), 'vite.config.ts'),
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true },
});
const { AppRoutes } = await vite.ssrLoadModule('/src/App.tsx');
const renderToString = (element) => new Promise((resolveRender, rejectRender) => {
  const output = new PassThrough();
  let markup = '';
  let renderError;
  output.setEncoding('utf8');
  output.on('data', (chunk) => { markup += chunk; });
  output.on('end', () => {
    if (renderError) rejectRender(renderError);
    else resolveRender(markup);
  });
  output.on('error', rejectRender);

  const stream = renderToPipeableStream(element, {
    onAllReady() {
      stream.pipe(output);
    },
    onShellError(error) {
      rejectRender(error);
    },
    onError(error) {
      renderError ??= error;
    },
  });
});
const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');
const replaceOrInsert = (html, pattern, tag) => pattern.test(html)
  ? html.replace(pattern, tag)
  : html.replace('</head>', `    ${tag}\n  </head>`);
const setMeta = (html, attribute, key, value) => {
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=["']${key}["'])[^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
  return replaceOrInsert(html, pattern, tag);
};
const baseHtml = await readFile(resolve(outputDirectory, 'index.html'), 'utf8');
for (const route of routes) {
  const page = pageSeo[route];
  const canonical = `${origin}${route}`;
  const image = `${origin}/brand/logo.png`;
  let html = baseHtml.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  const renderedPage = await renderToString(createElement(StaticRouter, { location: route }, createElement(AppRoutes)));
  html = html.replace('<div id="root"></div>', `<div id="root">${renderedPage}</div>`);
  html = setMeta(html, 'name', 'description', page.description);
  html = setMeta(html, 'name', 'robots', 'index,follow');
  html = replaceOrInsert(html, /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i,
    `<link rel="canonical" href="${canonical}" />`);
  html = setMeta(html, 'property', 'og:title', page.title);
  html = setMeta(html, 'property', 'og:description', page.description);
  html = setMeta(html, 'property', 'og:type', 'website');
  html = setMeta(html, 'property', 'og:site_name', 'Limited Spoon Wellness');
  html = setMeta(html, 'property', 'og:locale', 'en_IN');
  html = setMeta(html, 'property', 'og:url', canonical);
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'property', 'og:image:alt', 'Limited Spoon Wellness logo');
  html = setMeta(html, 'name', 'twitter:card', 'summary');
  html = setMeta(html, 'name', 'twitter:title', page.title);
  html = setMeta(html, 'name', 'twitter:description', page.description);
  html = setMeta(html, 'name', 'twitter:url', canonical);
  html = setMeta(html, 'name', 'twitter:image', image);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${origin}/#organization`,
        name: 'Limited Spoon Wellness',
        alternateName: 'LimitedSpoon',
        url: origin,
        description: 'Limited Spoon Wellness is a nutritional and dietetic centre offering personalised nutrition care — from weight management and PCOS to diabetes, pre & post-natal, geriatric and cardiopulmonary nutrition.',
        logo: image,
        sameAs: ['https://www.instagram.com/limitedspoon.wellness/'],
      },
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: origin,
        name: 'Limited Spoon Wellness',
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
  };
  const schemaScript = `<script id="site-structured-data" type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<', '\\u003c')}</script>`;
  html = replaceOrInsert(html, /<script\b[^>]*id=["']site-structured-data["'][^>]*>[\s\S]*?<\/script>/i, schemaScript);

  if (route === '/') {
    await writeFile(resolve(outputDirectory, 'index.html'), html, 'utf8');
  } else {
    await writeFile(resolve(outputDirectory, `${route.slice(1)}.html`), html, 'utf8');
  }
}

let notFoundHtml = baseHtml.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(pageSeo['*'].title)}</title>`);
const renderedNotFound = await renderToString(createElement(StaticRouter, { location: '/__not_found__' }, createElement(AppRoutes)));
notFoundHtml = notFoundHtml.replace('<div id="root"></div>', `<div id="root">${renderedNotFound}</div>`);
notFoundHtml = setMeta(notFoundHtml, 'name', 'description', 'The page you requested could not be found.');
notFoundHtml = setMeta(notFoundHtml, 'name', 'robots', 'noindex,follow');
notFoundHtml = setMeta(notFoundHtml, 'property', 'og:title', pageSeo['*'].title);
notFoundHtml = setMeta(notFoundHtml, 'property', 'og:description', 'The page you requested could not be found.');
notFoundHtml = setMeta(notFoundHtml, 'name', 'twitter:title', pageSeo['*'].title);
notFoundHtml = setMeta(notFoundHtml, 'name', 'twitter:description', 'The page you requested could not be found.');
notFoundHtml = notFoundHtml.replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i, '');
notFoundHtml = notFoundHtml.replace(/<meta\b(?=[^>]*\b(?:property=["']og:url["']|name=["']twitter:url["']))[^>]*>/gi, '');
notFoundHtml = notFoundHtml.replace(/<script\b[^>]*id=["']site-structured-data["'][^>]*>[\s\S]*?<\/script>/i, '');
await writeFile(resolve(outputDirectory, '404.html'), notFoundHtml, 'utf8');
await vite.close();

const robots = [
  'User-agent: *',
  'Allow: /',
  ...(origin ? [`Sitemap: ${origin}/sitemap.xml`] : []),
  '',
].join('\n');
await writeFile(resolve(outputDirectory, 'robots.txt'), robots, 'utf8');

if (!origin) {
  console.warn('VITE_SITE_URL is not set; generated robots.txt without a sitemap reference and skipped sitemap.xml.');
  process.exit(0);
}

const entries = routes
  .map((route) => `  <url><loc>${origin}${route}</loc></url>`)
  .join('\n');
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  entries,
  '</urlset>',
  '',
].join('\n');
await writeFile(resolve(outputDirectory, 'sitemap.xml'), sitemap, 'utf8');
console.log(`Generated robots.txt and sitemap.xml for ${origin}`);
console.log(`Generated pre-rendered route HTML for ${routes.length} public pages`);
console.log('Generated a noindex 404 page');
