# Brand research — Limited Spoon Wellness

Compiled 10 Oct 2026. Every claim below is tagged:

- **[OBSERVED]** — read directly off the live Instagram profile or a post.
- **[ASSET]** — read off a supplied project file.
- **[INTERPRETATION]** — a design judgement drawn from the observations.
- **[UNVERIFIED]** — plausible but not confirmed. Never used as website copy.

---

## 1. What was actually inspected

The official profile <https://www.instagram.com/limitedspoon.wellness/> was opened in a
real browser and read directly. No login wall was bypassed.

Inspected:

| Item | How |
| --- | --- |
| Profile header, name, follower count, bio | Rendered page, read via DOM |
| Bio "more" expansion | Clicked the `more` control |
| Contact link in bio | Read from the anchor `href` |
| 9 story highlights (titles only) | Rendered page |
| Full grid, 15 posts + reels | Full-page screenshot |
| 9 individual post captions | `og:description` meta on each permalink |

**Not inspected:** story highlight *contents* (they require login), reel *video* frames,
comment threads beyond the two visible on one post, follower identities, or any
off-Instagram page. Those remain **[UNVERIFIED]**.

---

## 2. The single most important finding

**Limited Spoon Wellness is not a packaged-food or supplement brand. It is a
founder-led clinical nutrition practice.**

**[OBSERVED]** — post `DdrF4hPtWlW`, 24 Sep 2026:

> "At Limited Spoon, personalized nutrition is built around your needs — from weight
> management and PCOS to diabetes, pre & post-natal nutrition, geriatric nutrition,
> cardiopulmonary care, and everyday wellness."

This single sentence supplies the entire service architecture and is the backbone of
the site's information architecture. Everything the site offers is derived from this list
and nothing has been added to it.

**[INTERPRETATION]** — building the site around a *service* rather than a *product*
changes everything downstream: there is no product grid, no pricing table, no cart, and
no 3D product model. The 3D budget goes to the rain-glass surface instead.

---

## 3. Identity

### 3.1 Who

- **[OBSERVED]** Profile name: **Shalini Selvakumar**
- **[OBSERVED]** Bio: `🌿 Nourish. Transform. Thrive.`
- **[OBSERVED]** Bio: `👩‍⚕️ Clinical & Wellness Nutritionist`
- **[OBSERVED]** Bio: `🥗 Founder | Limited Spoon Wellness`
- **[OBSERVED]** 528 followers, 9 following (as at 10 Oct 2026)
- **[OBSERVED]** A real comment from a client (`umeshkhanna_m`): *"It's amazing really
  wanted to disconnect from swiggy or zomato."* — first-hand evidence that clients are
  coached on home cooking and eating habits, not sold products.

### 3.2 Logo

- **[OBSERVED]** Wordmark: **LIMITED SPOON**, two lines, heavy condensed sans, deep green.
- **[OBSERVED]** Mark: a stylised apple whose crown is a leaf, in mid green.
- **[OBSERVED]** Tagline beneath the wordmark: **NUTRITIONAL & DIETETIC CENTRE**.
- **[OBSERVED]** The profile photo is the logo inside a thin ring that runs
  magenta → amber → green.
- **[ASSET]** No logo file was supplied in `data/` — only `Glass.jpg`. The site therefore
  ships a **hand-built SVG wordmark** that reproduces the observed lockup. **The company
  should supply the official vector file**; see open questions.

### 3.3 Colour

Sampled from the profile grid screenshot, not guessed:

| Role | Hex | Where it appears |
| --- | --- | --- |
| Deep leaf green | `#1F5F2E` | Logo wordmark, poster headlines |
| Fresh green | `#7CB342` | Apple mark, highlight rings, rule lines |
| Cream | `#F7F2E6` | Poster backgrounds |
| Amber | `#E39A16` | Highlight rings, accent numerals |
| Terracotta | `#C1440E` | Autumn poster accents |
| Maroon | `#7B1E3A` | "BEFORE YOU BUY IT, READ IT." headline |

The brand runs **warm**: cream ground, deep green ink, amber as the single accent.
The supplied glass reference is **cool**: navy → teal → ice blue.

**[INTERPRETATION]** — the two are deliberately opposed. The site keeps the brand warm
and uses the cool glass as the dark counterpoint it wants to be read against. That
contrast is the art direction, not a compromise between two palettes.

### 3.4 Typography

- **[OBSERVED]** Posters use a heavy condensed grotesque for headlines
  ("BEFORE YOU BUY IT, READ IT.", "EAT YOUR GREENS", "CONGRATULATIONS").
- **[OBSERVED]** A hand-written script is used as a secondary voice
  ("A Nutritionist's Perspective", "Your Healthy Little Secret", "Chef Shalini's Favourite").
- **[OBSERVED]** Body copy is a plain neutral sans.

**[INTERPRETATION]** — condensed-grotesque display + neutral sans body carries the brand
across to the web directly. The script is dropped: it is fragile at small sizes, and
the site's premium register comes better from restraint. Site pairing is **Fraunces**
(editorial serif, for the long-form voice) against **Archivo** (the brand's own
condensed-grotesque lineage, for headings, wordmark and UI).

---

## 4. Voice

**[OBSERVED]** — sampled across nine posts:

> "No extreme changes. No unnecessary pressure. Just consistency, one day at a time."

> "Small habits. A healthier tomorrow."

> "Small choices. Better-balanced plates."

> "The front of a package tells you what the brand wants you to notice. The nutrition
> label tells you what you actually need to know."

**[INTERPRETATION]** — the voice is: warm, unhurried, non-judgemental, evidence-literate,
and allergic to hype. It never promises outcomes; it describes habits. The site's copy
holds that register and drops every emoji-heavy, exclamation-marked register the feed
uses socially.

---

## 5. Verified service areas

**[OBSERVED]** — taken verbatim from the `DdrF4hPtWlW` caption. The website presents
exactly these seven, with no additions:

1. Weight management
2. PCOS
3. Diabetes
4. Pre & post-natal nutrition
5. Geriatric nutrition
6. Cardiopulmonary care
7. Everyday wellness

**[OBSERVED]** — secondary themes evidenced across the feed and highlights
(`nutritional info`, `recipes`, `Quiz`, `clientfoodplate`, `review`, `fitness`,
`gardening`, `wellness event`): nutrition label literacy, seasonal produce,
public-health awareness, client food plates, and events. The site treats these as
*editorial* content, not as extra services.

---

## 6. Explicitly NOT claimed on the website

Because none of it was verifiable, the site states none of it:

- **[UNVERIFIED]** No phone number. The bio's only contact link redirects to a
  `gmail.com` address with the local part redacted by Instagram's link wrapper, so the
  real address was never exposed. **No address has been invented.**
- **[UNVERIFIED]** No prices, no session fees, no package names.
- **[UNVERIFIED]** No clinic address, opening hours, or booking system.
- **[UNVERIFIED]** No qualifications beyond "Clinical & Wellness Nutritionist" — no
  degree, college, registration body or certificate is named anywhere on the account.
- **[UNVERIFIED]** No product line. Nothing in the feed is sold.
- **[UNVERIFIED]** No testimonials on the website. There is a `review` highlight and one
  visible client comment, but a single comment is not a testimonial and is not used.
- **[UNVERIFIED]** No outcomes, statistics, awards or medical claims of any kind.

---

## 7. Recommendations carried into the build

1. **Lead with the service, not the product.** Hero states personalised nutrition care.
2. **Warm ground, cool glass.** Cream/green brand palette; the rain-glass hero is the
   one dark, cold, photographic moment on the site.
3. **No poster galleries.** The feed's poster style is translated into native layout —
   a strong type scale, a rules-and-labels system, generous cream space — not reproduced
   as images. This is an explicit requirement, and it is also the better design.
4. **Educational voice.** The site explains, it does not sell.
5. **One immersive moment, not five.** The rain glass is the site's 3D budget.
6. **Instagram is the contact channel**, because it is the only verified one.

---

## 8. Open questions for the company owner

These block nothing in the build but must be answered before launch:

1. What is the enquiry email address? (`gmail.com` local part is hidden behind
   Instagram's redirect.)
2. Is there a phone number or WhatsApp?
3. Is there a physical clinic address, and opening hours?
4. What are the session formats, durations and fees?
5. What are the founder's exact qualifications and any professional registration?
6. Can the official logo be supplied as an SVG/PNG? The site currently uses a
   hand-built SVG that reproduces the observed lockup.
7. Any pages that must exist for compliance (privacy, terms) — none were found and
   none were invented.
8. Is the seven-item care list complete and current?