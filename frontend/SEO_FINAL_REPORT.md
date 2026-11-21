# SEO verification report — 21 November 2026

## Project overview

Limited Spoon Wellness is a founder-led nutrition practice led by Shalini Selvakumar, described as a Clinical & Wellness Nutritionist. The practice's site covers weight management, PCOS, diabetes, pre- and post-natal nutrition, geriatric nutrition, cardiopulmonary care, and everyday wellness. India is the owner-confirmed target market; a city, service area, online/in-person format, fees, and additional qualifications remain unconfirmed. The only verified public contact channel is Instagram.

## Verdict

The production domain is live and its five public routes, robots file, and sitemap are crawlable. The five-page live crawl found no SEO crawler issues. However, live deep-route responses still expose homepage-only metadata before JavaScript runs, and no Search Console data is accessible. A local implementation now pre-renders route-specific metadata and body content, fixes a dark-hero contrast issue, and emits a proper noindex 404 document. These changes passed a production build and 33 tests but are not deployed yet.

## Live verification

- Live HTTP checks returned 200 for `/`, `/approach`, `/care`, `/about`, `/contact`, `/robots.txt`, `/sitemap.xml`, and `/brand/logo.png` on `https://www.limitedspoon.online`.
- `robots.txt` allows crawling and points to `https://www.limitedspoon.online/sitemap.xml`.
- The XML sitemap contains exactly five public canonical URLs on the `www` hostname. It contains no invented `lastmod` values.
- The JavaScript-rendered OpenSEO crawl completed 5/5 pages with 0 issues. All pages returned 200, were indexable, had unique titles/descriptions, one H1, and zero images missing alt text.
- Raw live HTML for secondary routes still showed the homepage title and `og:url`, without a route-specific canonical. Hydration corrects the page head, but link preview bots and crawlers that do not run the app see the generic shell.

## Search visibility and keyword findings

The India domain overview and domain-level ranked-keyword sample returned no measurable organic traffic or ranked keywords. The provider found no referring domains. These third-party estimates may miss a new or low-volume site; they are not Search Console data.

Same-day India SERP reads did not show Limited Spoon in the first 20 results for the sampled queries: `PCOS nutritionist India`, `online dietitian India`, `nutritionist for diabetes India`, and `prenatal nutritionist India`. On the PCOS query, pcosdietician.in appeared at #6 (page 1) on all three reads. On online dietitian India, medindia.net appeared at #2 on all three reads. On prenatal nutritionist India, momkidcare.com appeared at #1 on all three reads. Results are automated snapshots, not historical positions.

| India query | Estimated monthly volume | Intent | Difficulty | Interpretation |
|---|---:|---|---:|---|
| `dietitian online India` | 50 | Commercial | 50 | Best measured commercial query in this limited batch. Do not target until the owner confirms online care is offered. |
| `PCOS nutritionist India` | 10 | Informational | Unavailable | Low measured demand; `/care` can continue to cover PCOS without a thin duplicate page. |
| `pregnancy nutritionist India` | 10 | Commercial | Unavailable | Supports pregnancy/postpartum coverage on `/care`; do not promise services or outcomes beyond verified copy. |
| `nutritionist for diabetes India` | Unavailable | Unavailable | Unavailable | Live result page is crowded with directories and individual practices; volume was not measurable in the source. |

No volumes are added across related terms. Search volume is an estimate, not expected clicks. Search Console queries and landing pages are unavailable until the correct Google property is connected.

## Technical SEO implementation and findings

The project already configures `VITE_SITE_URL=https://www.limitedspoon.online`, rejects a mismatched production host, and generates robots and sitemap assets from the production origin. Its live robots and sitemap endpoints work and use only the exact production `www` host.

The live JavaScript crawl saw correct page-specific titles and descriptions, but initial HTML on secondary routes remained the homepage shell. The local implementation now:

- Stores titles/descriptions in a shared JSON registry consumed by React and build generation.
- Builds static HTML for each route with its own rendered page body, title, description, canonical, robots, OG/Twitter tags, and Organization/WebSite/WebPage JSON-LD.
- Hydrates those pre-rendered pages in the browser.
- Emits a styled `404.html` with `noindex,follow`, no canonical, and no structured data.
- Sets Vercel `cleanUrls` and removes the catch-all rewrite so emitted static pages can serve their extensionless routes and unknown paths can use the 404 document.
- Leaves the sitemap at five routes; legacy `/home`, `/home/*`, and `/index.html` redirects remain permanent.

Structured data contains only verified organization/site/page facts and the published Instagram profile. No LocalBusiness, reviews, ratings, FAQs, credentials, or unsupported health outcomes are asserted. The new pre-rendered JSON-LD is not yet production-validated through Schema.org or Google's Rich Results Test.

## On-page and mobile

Each of the five public pages has a unique title and description, one H1 in the live crawl, five internal links, and no missing image alt text. `/care` remains one hub for its seven verified service areas to avoid thin or overlapping pages. On mobile, Lighthouse gave Accessibility 100 for `/approach`, `/about`, and `/contact`, and 96 for `/care` because the dark hero kicker failed contrast. A local light-text CSS override addresses that finding; a production retest is pending.

## Performance results (live build before local changes)

Lighthouse returned 8 of 10 page/device results; both homepage requests timed out. It reported SEO score 100 on the returned pages and best-practices scores 100. Mobile performance scores were 78–83. Mobile LCP was about 3.17 seconds for `/approach` and `/care`, and about 2.14 seconds for `/about` and `/contact`. Mobile CLS was about 0.296 on all four returned pages; desktop CLS was about 0.145–0.294. This is lab data from the audit run, not field Core Web Vitals. INP was not returned. The local static-render change is intended to improve early content availability and layout stability, but performance improvement is not claimed until a deployed retest.

## Google Search Console

No Google account with Search Console access is connected to the OpenSEO workspace. Therefore the property list, ownership/permissions, clicks, impressions, CTR, average position, index coverage, URL inspection, and existing sitemap submissions could not be checked. No sitemap submission or indexing request is claimed.

Connect the authorized Google account through [OpenSEO Search Performance](https://app.openseo.so/p/103588e8-a4f5-49a2-854c-652587cd223a/search-performance). Then select the verified `https://www.limitedspoon.online/` URL-prefix property or matching verified domain property. Inspect existing sitemap status before submitting `https://www.limitedspoon.online/sitemap.xml`; inspect the homepage, `/care`, `/approach`, and `/contact` before requesting indexing.

## Files changed for this follow-up

- `src/config/page-seo.json` — shared route title/description source.
- `src/config/site.ts` — imports shared route metadata.
- `src/App.tsx` — shared direct route tree for browser use and static rendering.
- `src/main.tsx` — hydrates static HTML and retains client-render fallback for development.
- `src/pages/page.module.css` — improves kicker contrast on the dark care hero.
- `scripts/generate-seo-assets.mjs` — pre-renders public route HTML and a noindex 404 alongside robots and sitemap generation.
- `vercel.json` — clean URLs and no catch-all rewrite.
- `SEO_PROJECT_ANALYSIS.md`, `SEO_KEYWORD_MAP.md`, `SEO_FINAL_REPORT.md` — updated analysis and dated evidence.

## Status scorecard

| Task | Status | Evidence / next step |
|---|---|---|
| Exact production origin | COMPLETED AND VERIFIED | Build configuration is locked to `https://www.limitedspoon.online`; live robots and sitemap use `www`. |
| Live routes, robots, sitemap | COMPLETED AND VERIFIED | 7 public route/asset endpoint checks returned HTTP 200; sitemap has 5 canonical URLs. |
| Five-page technical crawl | COMPLETED AND VERIFIED | OpenSEO JavaScript crawl: 5/5 pages, 0 issues. |
| Route-specific raw HTML metadata and content | IMPLEMENTED BUT NOT VERIFIED | Local production build generates route HTML and JSON-LD; deploy then verify raw production responses. |
| Noindex 404 behavior | IMPLEMENTED BUT NOT VERIFIED | `dist/404.html` generated; verify Vercel returns it with HTTP 404 after deployment. |
| Contrast correction | IMPLEMENTED BUT NOT VERIFIED | Local `.careHero .kicker` contrast override; production Lighthouse retest pending. |
| Local production build | COMPLETED AND VERIFIED | `npm run build` passed and generated five route pages, sitemap, robots, and 404. |
| Existing automated tests | COMPLETED AND VERIFIED | 33 tests passed. |
| Vercel deployment of latest changes | PENDING USER ACTION | The route pre-render/contrast changes are local and not yet deployed. |
| Lighthouse / field Core Web Vitals | IMPLEMENTED BUT NOT VERIFIED | Live lab results captured; rerun after deployment. No field INP or CrUX data. |
| Search Console property, performance, indexing, sitemap submission | PENDING USER ACTION | Connect an authorized Google account through OpenSEO, then inspect the correct property. |
| Schema validator / Rich Results Test | PENDING USER ACTION | Run against the deployed route HTML; valid JSON-LD does not guarantee rich-result eligibility. |
| GA4 and conversion tracking | PENDING USER ACTION | No measurement ID or consent approach supplied; do not invent one. |
| Local SEO | NOT APPLICABLE pending location details | India is confirmed as market, but no city, address, service area, or appointment format is verified. |
| Off-page outreach | NOT APPLICABLE for this verification pass | No external submissions or outreach performed. |

## Next actions

1. Deploy the current repository changes, then recheck raw HTML and HTTP status on all routes, particularly `/approach`, `/care`, and a nonexistent path.
2. Connect Search Console through the OpenSEO OAuth flow, confirm the exact production property, inspect coverage and performance, and review the sitemap before submitting it.
3. Confirm online/in-person availability and the city or service area, then refine the commercial page map without creating unsupported location claims.
4. Rerun Lighthouse and validate JSON-LD on the deployed pre-rendered pages. Do not treat a sitemap submission as confirmation of indexing or a ranking guarantee.
