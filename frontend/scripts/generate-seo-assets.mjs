import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';

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

const routes = ['/', '/approach', '/care', '/about', '/contact'];
const outputDirectory = resolve(process.cwd(), 'dist');
await mkdir(outputDirectory, { recursive: true });

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
