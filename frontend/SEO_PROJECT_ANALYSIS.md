# SEO project analysis

## Project overview

Limited Spoon Wellness is a founder-led nutritional and dietetic practice. The website explains personalised nutrition care, the practice's approach and seven observed areas of care, introduces founder Shalini Selvakumar, and directs enquiries to the published Instagram account. It is a marketing site, not an ecommerce or packaged-food site.

## Technology and architecture

- Frontend: React 19, TypeScript 5.9, Vite 7, React Router 7.
- Rendering and deployment: client-rendered SPA, Vercel static build (`dist`); secondary pages use `React.lazy`.
- Backend/database/API/authentication: none found. No private application routes.
- Content: centralized in `src/config/site.ts`, with source notes in `docs/brand-research.md`.
- Assets: self-hosted Archivo and Fraunces fonts, SVG favicon, PNG brand logo, procedural SVG illustrations, and a WebGL rain-glass hero. No blog, product catalogue, service detail routes, or real photography.
- Existing deployment behavior: Vercel redirects `/home` and `/index.html`; unknown paths are rewritten to the SPA. No current robots file, sitemap, manifest, canonical, structured data, or social metadata was found.

## Business, audience, and intent

The verified proposition is individualised nutrition guidance across weight management, PCOS, diabetes, pre- and post-natal nutrition, geriatric nutrition, cardiopulmonary care, and everyday wellness. The intended next action is to start an enquiry or message the practice on Instagram.

The site copy and locale (`en_IN`) suggest English-speaking visitors in India, but no city, service area, clinic address, phone, hours, fees, session format, or professional credentials beyond “Clinical & Wellness Nutritionist” are verified. Do not add local business markup or location keywords until the owner confirms these facts. The owner confirmed the production origin as `https://www.limitedspoon.online`. DNS resolves the `www` host to Vercel; the live `/robots.txt` and `/sitemap.xml` endpoints returned 404 when checked, so serving the new SEO assets on the live deployment remains unverified. The older `https://limitedspoon.wellness` value has been removed.

Differentiators supported by the content: plans are adapted to a person's routine and preferences; the tone avoids extreme changes and pressure; nutrition support is positioned alongside medical care, not as a replacement. No outcomes, guarantees, testimonials, certifications, or statistics are claimed.

## Route inventory

Metadata below is proposed. Canonicals and sitemap entries use `https://www.limitedspoon.online`. All listed public routes have one visible H1. No page-specific structured data beyond shared `Organization` and `WebSite` entities is justified by current verified information.

| Route | Purpose and audience | Search intent / keyword theme | Proposed title | Proposed description | H1 | Indexability / canonical |
|---|---|---|---|---|---|---|
| `/` | Introduce the practice and lead to care areas or enquiry | Commercial / personalised nutrition care; nutritionist | Personalised Nutrition Care — Limited Spoon Wellness | Explore personalised nutrition care for weight management, PCOS, diabetes, pregnancy, older adults and everyday wellness. Enquire with Limited Spoon Wellness. | Nourish. Transform. Thrive. | Index; canonical `https://www.limitedspoon.online/` |
| `/approach` | Explain how nutrition plans are tailored | Informational / personalised nutrition plan; sustainable nutrition guidance | A Personalised Nutrition Approach — Limited Spoon Wellness | See how Limited Spoon Wellness shapes nutrition guidance around your routine, preferences and medical context, with adjustments for real life. | A plan that survives an ordinary week. | Index; canonical `https://www.limitedspoon.online/approach` |
| `/care` | Describe the seven verified areas of care | Commercial / nutrition support for each listed care area | Nutrition Care Areas — Limited Spoon Wellness | Explore nutrition support for weight management, PCOS, diabetes, pre- and post-natal needs, older adults, cardiopulmonary care and everyday wellness. | What we work with | Index; canonical `https://www.limitedspoon.online/care` |
| `/about` | Introduce the centre and its founder | Navigational / Limited Spoon Wellness; Shalini Selvakumar nutritionist | About Limited Spoon Wellness and Shalini Selvakumar | Meet Shalini Selvakumar, Clinical & Wellness Nutritionist and founder of Limited Spoon Wellness, and learn about the practice. | Limited Spoon, and the person behind it. | Index; canonical `https://www.limitedspoon.online/about` |
| `/contact` | Help visitors begin an enquiry | Transactional / contact nutritionist; nutrition enquiry | Contact Limited Spoon Wellness — Start an Enquiry | Start a nutrition enquiry with Limited Spoon Wellness. The practice's published contact channel is Instagram. | Start a conversation | Index; canonical `https://www.limitedspoon.online/contact` |
| `*` | Helpful not-found page | None | Page not found — Limited Spoon Wellness | No search snippet target. | This page has drained away. | Noindex; no canonical or sitemap entry |
| `/home`, `/home/*`, `/index.html` | Legacy aliases for home | None | N/A | N/A | N/A | Redirect to `/`; exclude from sitemap |

## Existing SEO implementation

- `index.html` includes a useful homepage title, description, viewport, theme colour, favicon, and font preloads.
- Other route titles are changed client-side with `document.title`; descriptions, canonicals, Open Graph, and Twitter metadata are absent.
- Navigation is crawlable anchor-based routing, but the site is client-rendered, so initial HTML for deep links does not include route content or route metadata.
- No `robots.txt`, XML sitemap, web manifest, or JSON-LD exists.
- The homepage and footer provide contextual links to the core routes. The care page has in-page anchors for all seven areas. No editorial/blog routes exist.
- Images are mostly local SVG/PNG and decorative SVG. Logo has descriptive alt text; the rain canvas is hidden from assistive technology. Hero uses CSS/WebGL rather than an `<img>` LCP candidate.
- Existing route split, locally hosted fonts, and no analytics/third-party embeds support a small initial payload. No Lighthouse/field CWV measurements are included in the repository.

## SEO issues found in the original implementation

1. Client-only route metadata means deep routes share the same initial HTML shell.
2. No canonical URLs or share metadata.
3. No sitemap/robots files were present; the sitemap host was unknown during the initial audit. The confirmed production origin is now configured.
4. SPA catch-all renders a styled 404 but does not inherently send an HTTP 404 from static Vercel hosting.
5. Alias redirects were configured as temporary and have been changed to permanent redirects.
6. Production host is `https://www.limitedspoon.online`; confirm the live deployment serves the generated files.
7. Page-specific titles/descriptions need central management and more useful snippets.

## Missing information and research limits

- City/service area, online versus in-person availability, and launch status.
- City/service area and whether care is online, in-person, or both.
- Approved business contact details, service formats/prices and founder qualifications.
- Google Search Console and Analytics access/data.
- No authenticated Keyword Planner, Search Console, or Trends data was available. Keyword recommendations are intent-based themes derived from the actual page content; search volumes and difficulty are deliberately not claimed. General web search did not surface a reliable official domain or measurable keyword data.
- Live DNS resolves to Vercel, but `/robots.txt` returned 404; a production crawl and route checks remain unavailable until the updated deployment serves the files.

## Recommended SEO architecture

- Keep route metadata in one typed registry and update title, description, canonical, Open Graph, Twitter card, and robots directives on navigation.
- Use the confirmed origin from `.env.production` as `VITE_SITE_URL`, with a build guard against Vercel preview or apex overrides.
- Generate sitemap XML from the indexable route registry during build, and a permissive robots file with a sitemap reference when the origin is present.
- Add shared `Organization` and `WebSite` JSON-LD using only verified entity data; omit `LocalBusiness`, ratings, FAQs, and health-outcome claims.
- Mark the 404 `noindex`; keep the contact route indexable because it is a public enquiry page.
- Consider static pre-rendering for the five marketing routes in a later architecture change. Current implementation is Vite SPA and has no SSR/prerender setup; don't add a second rendering stack blindly.
- Revisit regional targeting only after confirming the service geography. Do not add city pages or local schema without evidence.
