# SEO verification report — 21 November 2026

## Project and business

Limited Spoon Wellness is a founder-led nutrition practice led by Shalini Selvakumar, whose website identifies her as a Clinical & Wellness Nutritionist. Public copy covers weight management, PCOS, diabetes, pre- and post-natal nutrition, geriatric nutrition, cardiopulmonary care, and everyday wellness. The owner confirmed India as the target market. City, service area, appointment format, fees, phone, hours, and credentials beyond the published role remain unconfirmed. Instagram is the only verified public contact channel.

## Verdict

The deployed production site has five crawlable pages, route-specific pre-rendered page content and SEO metadata, working robots and sitemap files, and a real HTTP 404 for unknown paths. The post-deploy crawl found 0 crawler issues. SEO Lighthouse scores were 100 for all eight successful route/device samples, and CLS was effectively zero. Search performance and indexing cannot yet be assessed because an authorized Search Console account is not connected. One contact-page mobile lab result remains slower (LCP 3.42s, performance 90); a logo optimization and care-page contrast fix are prepared locally and await the next deployment and retest.

## Route inventory and indexation

| Route | Purpose | Status |
|---|---|---|
| / | Practice overview and broad personalized nutrition intent | Index; self-canonical |
| /approach | Explain the care approach | Index; self-canonical |
| /care | Single hub for seven verified care areas | Index; self-canonical |
| /about | Practice and founder | Index; self-canonical |
| /contact | Enquiry and Instagram contact path | Index; self-canonical |
| Unknown path | Styled not-found page | HTTP 404; noindex,follow; excluded from sitemap |
| /home, /home/*, /index.html | Legacy home aliases | Permanent redirect to /; excluded from sitemap |

No authentication, private dashboard, API, pagination, product, article, or location routes were found.

## Search visibility and keyword strategy

The India domain overview and ranked-keyword sample returned no measurable organic traffic or ranked keywords; the backlink provider found no referring domains. These are third-party estimates and may miss a new or low-volume site. Four Google India SERP snapshots did not show Limited Spoon in the first 20 results for PCOS nutritionist India, online dietitian India, nutritionist for diabetes India, and prenatal nutritionist India. Sampled competitors included pcosdietician.in (#6 for PCOS), medindia.net (#2 for online dietitian), and momkidcare.com (#1 for prenatal nutrition). These are snapshots, not Search Console positions.

| India query | Est. monthly volume | Intent | Page mapping |
|---|---:|---|---|
| dietitian online India | 50 | Commercial | Do not target until online availability is confirmed |
| PCOS nutritionist India | 10 | Informational | /care |
| pregnancy nutritionist India | 10 | Commercial | /care, within verified scope |
| nutritionist for diabetes India | Unavailable | Unavailable | /care |

Metrics are provider estimates, not expected traffic. No search volumes are invented or summed. Use first-party query and landing-page data after Search Console is connected. Keep care areas on the /care hub until verified service details and distinct useful content justify separate pages.

## Technical and on-page implementation

- Production origin is exactly https://www.limitedspoon.online; the production build rejects an absent or mismatched VITE_SITE_URL.
- Five public route HTML files are pre-rendered. Each has unique title, description, self-canonical, robots policy, Open Graph/Twitter URLs, and matching Organization, WebSite, and WebPage JSON-LD where applicable.
- React hydrates the pre-rendered markup; unknown routes use a generated noindex,follow 404 document.
- /robots.txt returns 200 and references https://www.limitedspoon.online/sitemap.xml.
- /sitemap.xml returns 200 and contains exactly the five canonical www URLs; no speculative lastmod values are included.
- Live direct-response checks confirmed each route's canonical, og:url, twitter:url, and WebPage JSON-LD use its exact www URL. No localhost, Vercel preview, or apex URL is used.
- The deployed 404 check returned HTTP 404. Permanent legacy homepage redirects remain configured.
- OpenSEO's deployed JavaScript crawl covered 5/5 routes with 0 issues; routes were HTTP 200 and indexable, each had unique title/description and one H1, and none had missing image alt text.
- Structured data uses only published, verifiable information; no LocalBusiness address, reviews, ratings, FAQ, unsupported qualifications, or health outcomes are asserted.
- The existing layout provides mobile rendering and the site self-hosts its fonts. No field Core Web Vitals data is available.

## Performance and accessibility

Post-deployment Lighthouse audit 247d018c-8995-4683-85f8-a03de0cf2878 returned 8 of 10 route/device samples; both homepage requests timed out.

| Page/device | Performance | Accessibility | SEO | LCP | CLS |
|---|---:|---:|---:|---:|---:|
| /about desktop | 100 | 100 | 100 | 0.61s | 0.000006 |
| /about mobile | 97 | 100 | 100 | 2.41s | 0.000006 |
| /approach desktop | 100 | 100 | 100 | 0.57s | 0.000006 |
| /approach mobile | 97 | 100 | 100 | 2.41s | 0.000006 |
| /care desktop | 100 | 95 | 100 | 0.58s | 0.000006 |
| /care mobile | 98 | 96 | 100 | 2.31s | 0.000006 |
| /contact desktop | 100 | 100 | 100 | 0.52s | 0.000006 |
| /contact mobile | 90 | 100 | 100 | 3.42s | 0.000006 |

These are lab results, not field Core Web Vitals. INP was not returned; the homepage Lighthouse requests timed out. Lighthouse flagged the care hero's low-contrast kicker, the 192 KB logo's image delivery and caching, about 55 KiB of unused JavaScript, and a render-blocking stylesheet estimated at 150 ms. The repository now corrects the kicker selector and supplies responsive, content-hashed WebP logo variants while preserving the PNG social image. Those final local refinements still need a Vercel deployment and production retest. No performance result is claimed for them yet.

## Google Search Console

PENDING USER ACTION: OpenSEO has no connected Google account with Search Console access. Property ownership, clicks, impressions, CTR, position, indexing coverage, URL inspections, and existing sitemap submission status therefore remain unknown. No sitemap submission or indexing request is claimed.

Connect Google through the official OAuth flow in [OpenSEO Search Performance](https://app.openseo.so/p/103588e8-a4f5-49a2-854c-652587cd223a/search-performance). Do not send credentials in chat. Once connected, select the confirmed https://www.limitedspoon.online/ URL-prefix property or verified domain property; review the existing sitemap before submitting https://www.limitedspoon.online/sitemap.xml, then inspect the homepage, /care, /approach, and /contact.

## Analytics, local, and off-page SEO

- GA4 and conversion measurement — PENDING USER ACTION: No measurement ID or consent approach is available. The contact flow can be instrumented once the user supplies an authorized property and consent requirements.
- Local SEO — NOT APPLICABLE until more facts are confirmed: India is confirmed; no city, address, service area, or appointment format is public/confirmed. No LocalBusiness schema or city claims were added.
- External outreach — NOT APPLICABLE in this pass: No directory submissions or outreach were made.
- Schema validators — PENDING USER ACTION: JSON-LD is present in production HTML but has not been submitted to Schema.org Validator or Rich Results Test. Valid markup would not guarantee a rich result.
- Rankings — NOT GUARANTEED: No SEO change can guarantee top placement or indexing.

## Verification scorecard

| Task | Status | Evidence |
|---|---|---|
| Exact production URL base and Vercel build generation | COMPLETED AND VERIFIED | Build uses https://www.limitedspoon.online; sitemap and robots live on the matching origin |
| Production route metadata, canonicals, social URLs, and JSON-LD | COMPLETED AND VERIFIED | Five raw route responses checked; values match each route on www |
| Sitemap and robots | COMPLETED AND VERIFIED | Both return 200; sitemap contains five canonical URLs |
| Unknown URL response | COMPLETED AND VERIFIED | Returns HTTP 404 with noindex,follow |
| Five-page technical crawl | COMPLETED AND VERIFIED | 5/5 pages, zero crawler issues |
| Post-deployment Lighthouse | COMPLETED AND VERIFIED | Eight route/device samples; SEO 100, near-zero CLS; homepage timed out |
| Responsive optimized logo and care contrast correction | IMPLEMENTED BUT NOT VERIFIED | Local sources and image variants build successfully; production retest pending |
| Current local production build, lint, and tests | COMPLETED AND VERIFIED | Build and lint passed; 33 existing tests passed |
| Search Console connection, indexing, performance, sitemap submission | PENDING USER ACTION | Authorized OAuth account must be connected first |
| Schema validator and Rich Results Test | PENDING USER ACTION | External validation not run |
| GA4 / conversion events | PENDING USER ACTION | Need authorized measurement property and consent details |

## Changed files in this follow-up

- src/pages/Care.tsx, src/pages/page.module.css — attach the contrast rule to the shared kicker class.
- src/components/Logo.tsx — responsive WebP source set with PNG fallback and alt text.
- public/brand/logo-*.webp — content-versioned responsive logo derivatives.
- vercel.json — long-lived immutable caching for fingerprinted WebP assets.
- SEO_PROJECT_ANALYSIS.md, SEO_FINAL_REPORT.md — verified deployment findings and updated Lighthouse evidence.

## Next actions

1. Deploy these validated refinements and rerun the Lighthouse audit to check the logo savings and care contrast result.
2. Connect Search Console using OpenSEO OAuth; inspect exact property, sitemap, URL indexing, and query/page performance.
3. Confirm appointment format and service area before adding commercial/local landing pages or LocalBusiness data.
4. Supply the GA4 property and consent requirements if conversion measurement is wanted.
