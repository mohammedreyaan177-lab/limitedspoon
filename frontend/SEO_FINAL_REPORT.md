# SEO implementation report

## 1. Project understanding

Limited Spoon Wellness is a founder-led nutrition practice offering personalised nutrition care across seven areas: weight management, PCOS, diabetes, pre- and post-natal nutrition, geriatric nutrition, cardiopulmonary care, and everyday wellness. The public site introduces the practice and its approach, describes the care areas, introduces founder Shalini Selvakumar, and invites enquiries through Instagram. No location, prices, clinical outcomes, testimonials, or credentials beyond the published role are asserted.

The copy suggests an English-speaking audience and the project declares `en_IN`, but the actual service geography is unverified. The production origin is `https://www.limitedspoon.online`; its `www` DNS record resolves to Vercel.

## 2. Technical SEO

- Added a single route metadata registry for the five public routes and the not-found route.
- Added a route-aware head manager that updates title, description, canonical, robots, Open Graph, Twitter metadata, and JSON-LD on navigation.
- Added generic `Organization`, `WebSite`, and page-specific `WebPage` JSON-LD only when a production origin is configured. No LocalBusiness, ratings, FAQ, or unsupported credential claims are emitted.
- Added a build step that creates an allow-all `robots.txt` and an XML sitemap with the five canonical public routes on the confirmed `www` origin, plus a sitemap reference. No invented `lastmod` dates are included.
- Changed `/home`, `/home/*`, and `/index.html` Vercel redirects to permanent redirects.
- Marked unknown routes `noindex,follow` and excluded them from the sitemap.
- Added social metadata defaults to the HTML shell and a production logo image reference to route metadata when the origin is known.
- Added lazy loading for non-priority logo instances while keeping the intro and header logo eager. Existing image dimensions and descriptive logo alt text remain in place.
- Existing internal navigation exposes all core pages; the care hub links to each of its seven section anchors. No broken-link crawler or live HTTP status audit was available.

**Production origin:** `https://www.limitedspoon.online` is configured in `.env.production` and used as the only production base. The Vite config and SEO asset generator reject production builds when `VITE_SITE_URL` is unset or overridden with a different host, preventing preview-domain or apex-domain URLs from being emitted. The older `https://limitedspoon.wellness` value has been removed. The local production build generated five sitemap URLs, all on the `www` host, plus a robots sitemap reference. DNS resolves the `www` host to Vercel, but live requests to `/robots.txt` and `/sitemap.xml` returned 404 at audit time; serving this build in production remains unverified.

**SPA limitation:** route metadata is set client-side after React loads. Vite currently serves one HTML shell for deep links and does not pre-render route body content or route-specific metadata in the initial response. Google can render JavaScript, but other crawlers and link preview bots may not. Static pre-rendering or SSR is a future architecture option; it was not introduced without evaluating the existing Vite SPA constraints.

The Vercel catch-all serves the SPA shell for unknown paths, so this static setup does not independently guarantee an HTTP 404 response for unknown routes. The client marks the styled 404 page `noindex`.

## 3. On-page SEO

Unique titles and descriptions are mapped for Home, Approach, Areas of Care, About, and Contact in `src/config/site.ts`. Existing readable headings and page content were retained rather than forcing keywords into copy. The 404 has a distinct title and noindex directive. The title and description strategy is documented page by page in `SEO_PROJECT_ANALYSIS.md`.

Existing internal links connect the home page to care, about, approach, and contact content. No blog or additional service pages were created because the project has no separate article content and the practice's verified detail supports one consolidated care hub.

## 4. Keyword strategy

Intent-based themes are mapped in `SEO_KEYWORD_MAP.md`. Examples include personalised nutrition care for the home page, personalised nutrition approach for `/approach`, nutrition care areas and condition-specific support for `/care`, branded/founder terms for `/about`, and enquiry/contact terms for `/contact`.

No search volumes, ranking difficulty, or competition values are claimed. Google Search Console, Keyword Planner, and Trends data were unavailable. Geography is unconfirmed, so no city or “near me” keyword map was created.

## 5. Structured data

Shared `Organization` and `WebSite` entities plus a route-specific `WebPage` entity are prepared in JSON-LD. They include only the practice name, verified description, website origin, logo, and published Instagram profile. Structured data uses the confirmed `www` origin in the production build; it has not been checked with Google's Rich Results Test or Schema.org Validator because the live deployment did not serve `/robots.txt` at audit time.

## 6. Performance

No Lighthouse, PageSpeed Insights, or field Core Web Vitals measurements were collected in this implementation, so no performance improvement is claimed. Existing safeguards include locally hosted fonts, route splitting, no analytics or third-party embeds, and lazy loading below-fold logo images. INP, LCP, CLS, server response time, and production caching still require measurement after deployment.

## 7. Google Search Console

The OpenSEO project was created for the site, but no Google account with Search Console access is connected. The property list, indexing reports, sitemap submission, and search performance data could not be read. Connect an authorized account at [OpenSEO Search Performance](https://app.openseo.so/p/103588e8-a4f5-49a2-854c-652587cd223a/search-performance), then continue with the verified property. No submission or indexing request is claimed.

## 8. Files changed

- `SEO_PROJECT_ANALYSIS.md` — project/route audit, existing SEO, risks, and recommended architecture.
- `SEO_KEYWORD_MAP.md` — intent-based keyword and page mapping with research limits.
- `SEO_FINAL_REPORT.md` — implementation summary, validation, pending actions, and scorecard.
- `src/config/site.ts` — environment-based site origin and per-route titles/descriptions.
- `src/components/SEOHead.tsx` — route-level metadata, canonicals, robots directives, social tags, and JSON-LD.
- `src/components/Layout.tsx` — mounts the shared route metadata manager.
- `src/pages/{Approach,Care,About,Contact,NotFound}.tsx` — removes competing title effects so centralized metadata controls each route.
- `src/components/Logo.tsx`, `src/components/Header.tsx`, `src/components/Intro.tsx` — priority-aware logo loading.
- `index.html` — homepage social metadata defaults.
- `scripts/generate-seo-assets.mjs` — build-time robots and sitemap generator.
- `.env.production` — exact production origin used by local and Vercel production builds.
- `vite.config.ts` — rejects builds that attempt to use an unset or different production origin.
- `package.json` — runs the SEO asset generator after the production build.
- `vercel.json` — makes the legacy home aliases permanent redirects.

## 9. Pending user actions

1. Connect Vercel or complete GitHub authentication so the local production commit on `master` can be pushed. Git Credential Manager waited for sign-in and the connected GitHub integration rejected the tree write with HTTP 403. No deployment was created.
2. After deployment, verify HTTPS, the `www` host, redirects, `/robots.txt`, and `/sitemap.xml`. Both live SEO file URLs currently return 404.
3. Connect a Google account with Search Console access through [OpenSEO Search Performance](https://app.openseo.so/p/103588e8-a4f5-49a2-854c-652587cd223a/search-performance), confirm the exact `https://www.limitedspoon.online/` property, then submit `/sitemap.xml` and inspect key URLs.
4. Share authorized Search Console access if performance and indexing analysis is wanted. Google Analytics is not configured; add it only if the practice chooses an analytics property and consent approach.
5. Confirm service geography and online/in-person availability before adding local targeting or local business structured data.
6. Confirm contact details, service formats, prices, founder credentials, whether privacy/terms pages are required, and the approved strapline as listed in `docs/brand-research.md`.
7. Consider supplying a dedicated social-sharing image with an appropriate landscape aspect ratio; current metadata uses the verified logo asset.
8. Pursue legitimate outreach to relevant nutrition/health publications and professional directories after credentials and geography are confirmed. No external links or listings have been submitted.

## 10. Remaining issues

- Deployment is blocked until Vercel/GitHub write access is connected; the local commit has not reached the remote branch.
- The live Vercel deployment returned 404 for `/robots.txt` and `/sitemap.xml`; confirm that a deployment containing this build is serving the files.
- Route-specific head tags are client-rendered; no static prerender/SSR is configured.
- 404 HTTP status is not guaranteed by the static SPA rewrite.
- No live production crawl, broken external link crawl, redirect-chain check, structured-data validator run, social image fetch check, or field/lab performance measurement was available.
- Search Console and Analytics status are unknown.
- There is no blog/resource section, so informational keyword expansion would need new practice-reviewed content.

## 11. SEO completion scorecard

| Task | Status | Evidence / next step |
|---|---|---|
| Project and route discovery | Completed and verified | Source, route, content, and deployment files inspected; see project analysis. |
| Page inventory and intent mapping | Completed and verified | `SEO_PROJECT_ANALYSIS.md` and `SEO_KEYWORD_MAP.md`. |
| Unique route titles/descriptions | Implemented but not independently verified in a live crawl | Central route registry; client-side route head updates. |
| Canonical URLs and absolute social URLs | Completed and verified in local production build | All SEO URLs use `https://www.limitedspoon.online`; conflicting production overrides fail the build. |
| robots.txt | Implemented and locally verified; live serving unverified | `dist/robots.txt` allows crawling and references the exact sitemap; live endpoint returned 404. |
| XML sitemap | Completed and verified in local production build | Valid XML contains five public routes, all on the exact `www` host. |
| 404 noindex and sitemap exclusion | Implemented but not independently verified in production | Unknown routes receive `noindex,follow`; not in route list. HTTP 404 status remains a hosting limitation. |
| Structured data | Implemented but not independently verified | JSON-LD generated at runtime only with origin; external validator pending deployment. |
| Mobile/accessibility foundations | Previously verified by project QA; not re-audited on live deployment | Existing responsive and accessibility implementation preserved; 33 automated tests passed. |
| Performance/CWV | Pending measurement | No Lighthouse or field data available. |
| Google Search Console | Pending user action | No Google account is connected to the OpenSEO project; connect the verified property, then inspect URLs and submit the sitemap. |
| Production deployment | Pending user action | Local commit is ready; Git credential flow awaited sign-in and GitHub tree write returned 403. Connect Vercel or GitHub write access. |
| Local SEO | Not applicable pending geography confirmation | Do not infer a city, address, or service area. |
| Off-page outreach | Pending user action | No backlinks or external submissions claimed. |
| Build, lint, tests | Completed and verified | Build passed; ESLint passed; 33 tests passed. Existing jsdom canvas warnings appeared during tests. |
