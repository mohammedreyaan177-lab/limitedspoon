# SEO verification report — 21 November 2026

## Project and business

Limited Spoon Wellness is a founder-led nutrition practice led by Shalini Selvakumar, whose website identifies her as a Clinical & Wellness Nutritionist. Public copy covers weight management, PCOS, diabetes, pre- and post-natal nutrition, geriatric nutrition, cardiopulmonary care, and everyday wellness. The owner confirmed India as the target market. City, service area, appointment format, fees, phone, hours, and credentials beyond the published role remain unconfirmed. Instagram is the only verified public contact channel.

## Verdict

The deployed production site has five crawlable pages, route-specific pre-rendered content and SEO metadata, split page bundles, working robots and sitemap files, and a real HTTP 404 for unknown paths. The latest post-deploy crawl found 0 crawler issues. A successful Lighthouse run after the logo and contrast changes reported SEO 100 and accessibility 100 for every returned secondary-page sample, with effectively zero CLS. The further bundle-splitting change is deployed, but its Lighthouse rerun could not complete because OpenSEO reported insufficient provider credits. Search performance and indexing cannot yet be assessed because no authorized Search Console account is connected.

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

The successful post-logo/contrast Lighthouse audit ccd8c7c5-ed98-4d09-8244-e9724a0ad9ee returned eight of ten samples; the homepage desktop timed out and homepage mobile reported insufficient provider credits. This run preceded the final route-bundle split.

| Page/device | Performance | Accessibility | SEO | LCP | CLS |
|---|---:|---:|---:|---:|---:|
| /about desktop | 100 | 100 | 100 | 0.57s | 0.000007 |
| /about mobile | 95 | 100 | 100 | 2.87s | 0.000006 |
| /approach desktop | 100 | 100 | 100 | 0.67s | 0.000007 |
| /approach mobile | 95 | 100 | 100 | 2.85s | 0.000006 |
| /care desktop | 100 | 100 | 100 | 0.56s | 0.000006 |
| /care mobile | 96 | 100 | 100 | 2.73s | 0.000006 |
| /contact desktop | 100 | 100 | 100 | 0.55s | 0.000007 |
| /contact mobile | 96 | 100 | 100 | 2.70s | 0.000006 |

These are lab results, not field Core Web Vitals. INP was not returned. After the contrast change, the care route reached accessibility 100. The new responsive WebP logo and one-year immutable cache policy are live; a mobile logo variant returned 200 at 10.4 KB. Before route splitting, Lighthouse still estimated 55 KiB of unused JavaScript and 150 ms for render-blocking CSS, with mobile LCP at 2.70–2.87 seconds on secondary routes. A subsequent bundle-splitting implementation is live: the production build reduced the entry bundle from 343.87 KB raw / 108.60 KB gzip to 284.53 KB raw / 91.28 KB gzip and split page chunks by route. The Lighthouse rerun after this last change could not measure performance: all 10 samples failed, nine for INSUFFICIENT_CREDITS and one timed out. No post-split performance improvement is claimed. Field Core Web Vitals remain unavailable.

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
| Responsive WebP logo, immutable cache, and care contrast correction | COMPLETED AND VERIFIED | Production image request returns 200, image/webp, 1-year immutable cache; Lighthouse care accessibility 100 |
| Per-route JavaScript code splitting | COMPLETED AND VERIFIED | Vercel deployed the split build; production crawl remains clean; local build shows smaller entry bundle and page chunks |
| Lighthouse after final bundle split | BLOCKED | OpenSEO/DataForSEO returned INSUFFICIENT_CREDITS for 9 samples and timeout for 1; earlier Lighthouse run is reported above |
| Current local production build, lint, and tests | COMPLETED AND VERIFIED | Build and lint passed; 33 existing tests passed |
| Search Console connection, indexing, performance, sitemap submission | PENDING USER ACTION | Authorized OAuth account must be connected first |
| Schema validator and Rich Results Test | PENDING USER ACTION | External validation not run |
| GA4 / conversion events | PENDING USER ACTION | Need authorized measurement property and consent details |

## Changed files in this follow-up

- src/pages/Care.tsx, src/pages/page.module.css — attach the contrast rule to the shared kicker class.
- src/components/Logo.tsx — responsive WebP source set with PNG fallback and alt text.
- public/brand/logo-*.webp — content-versioned responsive logo derivatives.
- vercel.json — long-lived immutable caching for brand assets.
- src/App.tsx, scripts/generate-seo-assets.mjs — split browser route bundles while preserving streamed static prerendering.
- SEO_PROJECT_ANALYSIS.md, SEO_FINAL_REPORT.md — verified deployment findings and updated Lighthouse evidence.

## Next actions

1. Re-run Lighthouse when the OpenSEO/DataForSEO provider has credits available; use field data in Search Console/CrUX when it becomes available.
2. Connect Search Console using OpenSEO OAuth; inspect exact property, sitemap, URL indexing, and query/page performance.
3. Confirm appointment format and service area before adding commercial/local landing pages or LocalBusiness data.
4. Supply the GA4 property and consent requirements if conversion measurement is wanted.
