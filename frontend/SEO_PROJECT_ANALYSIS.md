# SEO project analysis

## Project and business

Limited Spoon Wellness is a founder-led nutrition practice led by Shalini Selvakumar, identified on the site as a Clinical & Wellness Nutritionist. The website describes personalised nutrition care for weight management, PCOS, diabetes, pre- and post-natal nutrition, geriatric nutrition, cardiopulmonary care, and everyday wellness. The intended conversion is an enquiry; Instagram is the only verified published contact channel. The owner confirmed India as the intended market. A city, service radius, online/in-person availability, clinic address, fees, hours, phone, credentials beyond the published role, and clinical outcomes remain unverified.

The practice's verified positioning adapts nutrition guidance to a person's routine, preferences, and medical context, avoids extreme changes, and complements rather than replaces medical care. The site is not a shop, food product catalogue, or editorial blog.

## Stack and architecture

- React 19, TypeScript 5.9, Vite 7, React Router 7; deployed as static files on Vercel.
- No backend, database, API, authentication, GA4, or private routes were found.
- Shared business facts and care-area copy are in `src/config/site.ts`; page metadata is in `src/config/page-seo.json`.
- Public layout uses self-hosted Archivo and Fraunces fonts, a transparent PNG logo, SVG favicon and illustrations, and a WebGL hero with a CSS fallback.
- Production `VITE_SITE_URL` is `https://www.limitedspoon.online`. The Vite config and asset generator reject any other or missing production value.
- The production build now statically renders each public route into its own HTML file, with route-specific body content, title, description, robots directive, canonical, Open Graph, Twitter, and JSON-LD before React hydrates. Vercel `cleanUrls` serves the extensionless routes; a generated `404.html` is `noindex,follow`. `robots.txt` and `sitemap.xml` are generated from the page registry.

## Route inventory

| Route | Purpose and intent | SEO decision |
|---|---|---|
| `/` | Introduce the practice; broad personalised nutrition and brand intent | Index; self-canonical; homepage title and description; `WebPage` schema |
| `/approach` | Explain how guidance is adapted to routine, preferences, and medical context | Index; self-canonical; unique title and description; `WebPage` schema |
| `/care` | One hub for all seven observed care areas | Index; self-canonical; unique title and description; `WebPage` schema; seven in-page anchors |
| `/about` | Practice and founder information | Index; self-canonical; verified founder role only; `WebPage` schema |
| `/contact` | Enquiry and verified Instagram contact path | Index; self-canonical; unique title and description; `WebPage` schema |
| `*` | Styled not-found page | Noindex; excluded from sitemap; generated `404.html` intended for HTTP 404 handling |
| `/home`, `/home/*`, `/index.html` | Legacy home aliases | Permanent redirect to `/`; excluded from sitemap |

No login, dashboard, API, or authenticated route was found. No pagination, product, location, article, or duplicate content families exist.

## Live SEO verification on 21 November 2026

The live `www` origin returned HTTP 200 for all five public routes, `/robots.txt`, `/sitemap.xml`, and the published logo. `robots.txt` allows crawling and references `https://www.limitedspoon.online/sitemap.xml`. The sitemap is valid XML with exactly the five intended `www` canonical URLs and no invented `lastmod` values. The five-page JavaScript-rendered OpenSEO crawl found 0 crawler issues: each page was indexable, returned 200, had a unique title and description, one H1, and no missing image alt text.

The deployed build now returns route-specific pre-rendered bodies and SEO metadata on direct requests. Live checks confirmed canonical, Open Graph URL, Twitter URL, and WebPage JSON-LD on each secondary page match its exact self URL. A nonexistent URL returns HTTP 404 with the generated noindex page. Legacy homepage aliases remain permanent redirects. The post-deploy audit completed on 21 November 2026.

## Current search visibility evidence

OpenSEO's India domain overview and domain-level ranked-keyword sample returned no measurable organic traffic or ranked keywords, and its backlink provider found no referring domains. These provider results are estimates and may miss a new or low-volume site. Four same-day Google India SERP samples did not include the domain in the first 20 results for `PCOS nutritionist India`, `online dietitian India`, `nutritionist for diabetes India`, or `prenatal nutritionist India`. Search Console is not connected, so there is no first-party clicks, impressions, query, or indexing evidence.

Keyword estimates fetched for India on 21 November 2026: `dietitian online India` — 50 estimated monthly searches, commercial intent, KD 50; `PCOS nutritionist India` — 10, informational intent, KD unavailable; `pregnancy nutritionist India` — 10, commercial intent, KD unavailable. Estimates are directional, not measured demand. Do not target online or city-based terms until the practice confirms those service details.

## Technical SEO implementation

- Central route metadata in `src/config/page-seo.json` is consumed by React and the build-time generator.
- `SEOHead` maintains metadata during client-side navigation, including self-referencing canonical URLs, `index,follow` for known routes and `noindex,follow` for unknown ones, social metadata, and JSON-LD.
- The production build statically renders each route and creates page-specific initial HTML for crawlers and social link unfurlers. The React app hydrates that HTML.
- Structured data is limited to `Organization`, `WebSite`, and route-specific `WebPage` entities with the canonical `www` URLs, published logo, description, and Instagram `sameAs`. No unsupported LocalBusiness, ratings, reviews, FAQ, credentials, or health outcome claims are used.
- The build creates five canonical sitemap entries and a permissive robots file with the sitemap reference. Legacy homepage aliases remain permanent redirects.
- `vercel.json` uses clean URLs and no catch-all rewrite, so emitted route files can be served directly and an unknown route can fall through to the not-found document.

## Performance, accessibility, and remaining evidence gaps

Post-deploy Lighthouse audit 247d018c-8995-4683-85f8-a03de0cf2878 returned 8 of 10 tests; the homepage desktop and mobile requests timed out. SEO scores were 100 on every returned route/device. Mobile performance ranged 90–98; CLS was about 0.000006 on each. LCP ranged from 2.31–3.42 seconds. The contact page's mobile LCP was 3.42s (performance 90); the care page mobile sample still reported contrast 96 because the prior selector did not match a class from the shared layout module. Lighthouse flagged about 177 KB of logo image savings, 55 KiB unused JavaScript, and a render-blocking stylesheet with an estimated 150 ms savings. A corrected care kicker class and responsive WebP logo sizes are now implemented locally; they require a deployment and retest. INP was not returned. These are lab results, not field Core Web Vitals.

Not measured: field Core Web Vitals, Google indexing status, submitted sitemap state, GA4 or conversion data, Schema.org / Rich Results Test results, and the post-change production crawl. No SEO change guarantees rankings or indexing.
