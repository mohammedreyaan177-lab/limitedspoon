# QA report

Every number below was produced by a command or a browser measurement during
this build. Nothing is estimated.

---

## 1. Engineering commands

Run from the project root, Node v24.18.0.

| Command | Result |
| --- | --- |
| `npx tsc -b` | **PASS** — 0 errors |
| `npx eslint .` | **PASS** — 0 errors, 0 warnings |
| `npx vitest run` | **PASS** — 31 tests / 6 files, all green |
| `npm run build` | **PASS** — 74 modules, built in 4.99s |

Production bundle:

```
dist/index.html                 1.66 kB │ gzip   0.83 kB
dist/assets/index-*.css        26.67 kB │ gzip   6.38 kB
dist/assets/index-*.js        307.42 kB │ gzip  99.30 kB
dist/assets/page-*.css          8.38 kB │ gzip   2.12 kB
dist/assets/Care-*.js           9.22 kB │ gzip   3.14 kB
dist/assets/Contact-*.js        8.55 kB │ gzip   2.97 kB
dist/assets/Approach-*.js       4.95 kB │ gzip   1.62 kB
dist/assets/About-*.js          4.49 kB │ gzip   1.59 kB
dist/assets/NotFound-*.js       0.87 kB │ gzip   0.47 kB
dist/brand/logo.png           188.00 kB │ (uncompressed)
```

Route splitting is working — no single secondary route exceeds 3.2 KB gzipped.

---

## 2. Routes

| Route | Title | Height @1440 | Status |
| --- | --- | --- | --- |
| `/` | Nourish. Transform. Thrive. — Limited Spoon Wellness | 5,502px | OK |
| `/approach` | Approach — Limited Spoon Wellness | 3,541px | OK |
| `/care` | Areas of care — Limited Spoon Wellness | 3,626px | OK |
| `/about` | About — Limited Spoon Wellness | 3,116px | OK |
| `/contact` | Contact — Limited Spoon Wellness | 1,959px | OK |
| `*` | Page not found — Limited Spoon Wellness | 1,070px | OK |

All six set a distinct document title.

> `/care` previously measured 7,612px. The produce band and the produce-filled
> care rows replaced what was largely empty space, bringing it to 3,626px.

### Opening the site always lands on home

The bare domain already resolved to `/`, but that was the *only* entry point
that did. Anything a visitor types, shares or has bookmarked landed on the 404.

| Requested | Landed on | Result |
| --- | --- | --- |
| `/` | `/` | Home |
| *(no path)* | `/` | Home |
| `/index.html` | `/` | Home — **was 404** |
| `/home` | `/` | Home — **was 404** |
| `/Home` · `/HOME` | `/` | Home — **was 404** |
| `/home/` · `/home/care` | `/` | Home — **was 404** |

Fixed twice over: `redirects` in `vercel.json` so these never reach the app on
Vercel, and `<Navigate replace>` routes in `App.tsx` for any other host.
`replace` matters — a push would let Back bounce the visitor between the alias
and the real page.

Verified with **0 console warnings**. Deep links (`/care`, `/approach`, `/about`,
`/contact`) and the genuine 404 page are unaffected.

---

## 3. Responsive

Tested at **320, 375, 390, 430, 768, 820, 1024, 1280, 1440, 1920 and 2560**,
plus landscape phone (844×390). That is 11 viewports × 5 routes = **55 checks**.

| Viewport | Overflow across all 5 routes | `scrollY` on load |
| --- | --- | --- |
| 320 (iPhone SE 1st gen) | 0 | 0 |
| 375 (iPhone SE 2/3) | 0 | 0 |
| 390 (iPhone 13/14) | 0 | 0 |
| 430 (iPhone Pro Max) | 0 | 0 |
| 768 (iPad portrait) | 0 | 0 |
| 820 (iPad Air) | 0 | 0 |
| 1024 (iPad landscape) | 0 | 0 |
| 1280 (laptop) | 0 | 0 |
| 1440 (desktop) | 0 | 0 |
| 1920 (large) | 0 | 0 |
| 2560 (ultrawide) | 0 | 0 |

**Defects found and fixed in this pass:**

1. **`/contact` horizontal overflow at every mobile width** — the decorative
   `GrowthRings` SVG is deliberately positioned outside its panel
   (`right:-18%; bottom:-22%`) and nothing clipped it. Fixed by adding
   `overflow:hidden` to both `.contactWrap` and `.info`. Re-measured to 0.
2. **Produce band orphaned one mark** — below 48rem the eight produce marks
   wrapped to seven plus a single orphan on the second row, which read as an
   accident. Replaced with a balanced 4×2 grid, verified 4/4/2 rows at 320, 390
   and 768.
3. **Scroll hint could collide with the hero buttons** — reserved its own lane
   by adding `2.5rem` of bottom padding to `.heroInner` at ≥64rem.

Touch targets: footer links were 24–40px tall, below comfortable size. Fixed by
converting margin spacing to `padding-block: 0.6rem`, which brings them to
~44px while keeping the visual rhythm.

---

## 4. Accessibility

### Automated — axe-core, WCAG 2.0/2.1/2.2 A + AA + best-practice

Live run against the dev server at 1440×900:

| Route | Violations | Passes |
| --- | --- | --- |
| `/` | **0** | 36 |
| `/approach` | **0** | 37 |
| `/care` | **0** | 37 |
| `/about` | **0** | 39 |
| `/contact` | **0** | 43 |
| `/nope` | **0** | 36 |

**Defects found and fixed during this work:**

1. `--text-soft` (`#7d8a80`) on cream measured **~3.4:1**, failing AA for body
   text. Replaced `--text-muted` / `--text-soft` with `#4f5d54` / `#5d6a60`.
2. The `.kicker` label used `--botanic-600` on the sage band — **3.9:1**, a fail.
   Darkened to `--botanic-700` (**5.7:1**).
3. `/care` carried `aria-labelledby="care-note-title"` pointing at an **id that
   did not exist**. Added the visually-hidden `<h2>` it referenced.
4. Form error text used a ⚠ glyph as the only visual cue alongside colour.
   Retained as `aria-hidden` decoration with the text carrying the meaning.

### Manual — contrast the tool cannot measure

axe cannot judge text over a WebGL canvas. Measured directly: the hero was
screenshotted, the heading's pixel band sampled, and WCAG relative luminance
computed against the background percentile.

- Hero heading `#f6fbff` vs **median background luminance 0.0164**
- → **contrast ratio 14.93:1** (p75: 13.99:1)

Well clear of the 3:1 large-text and 4.5:1 body-text thresholds.

### Keyboard & assistive tech

- Skip link is the first tab stop
- Mobile drawer: `aria-expanded` flips, Escape closes and **returns focus to
  the toggle**, body scroll locks then releases, focus is moved to the error
  summary on failed submit
- All form controls labelled; errors wired via `aria-describedby`
- Exactly one `<h1>` per route (asserted in `a11y.test.tsx`)
- Focus ring is amber on deep grounds and leaf-green on light grounds, so it
  never disappears into the palette

---

## 5. The water

### Motion is verified, not asserted

| Gap | Method | Result |
| --- | --- | --- |
| 3s | two full-viewport screenshots, downsampled, pixel-diffed | 13.0% of pixels changed |
| 6s | same | **8.5%** of pixels changed, mean abs diff 1.75 |
| 12s | block-wise vertical cross-correlation | mean **downward** block shift 0.87px @480px scale |

The 12s correlation returning **no single global vertical shift** is itself the
evidence that per-column fall speeds are working: if the whole pane were sliding
as one sheet, a global shift would have aligned the frames. It doesn't, because
each column falls at its own hashed rate.

### Reduced motion

`prefers-reduced-motion: reduce` emulated, two captures 4s apart:

- **0.00%** of pixels changed — the loop is genuinely stopped
- Hero copy still present, `opacity: 1`, `color: rgb(246,251,255)`
- Canvas still painted at `opacity: 1` — the visitor gets a **static** pane of
  water, not an empty one

### Fidelity

Compared side by side against `data/Glass.jpg` at its native 733×418, through
nine iterations. Defects found and fixed in the process:

1. Lattice was ~1 cell across the viewport — beads rendered as giant bubbles
2. Cell lookup and bead evaluation ran in inconsistent coordinate spaces
3. Backticks inside GLSL comments broke the JS template literal (twice)
4. Beads read as soap bubbles — uniform rim, no lens inversion, no caustic
5. Trails were straight, equal-length and attached to every bead → "field of pins"
6. Teardrop stretch overshot to 1.70 → "tadpoles"
7. Slope-smoothing threshold of 0.02 was also suppressing the micro-condensation,
   so the dense fine mist the reference is full of was invisible
8. Micro-condensation produces almost no specular (normals barely tilt), so it
   rendered as nothing — now shaded as a scatter term

Current state: round beads with a single dominant highlight, darker lower rims,
irregular faint trails, broad vertical light bands in the interior, and dense
fine grain. **Closer to the reference than the previous version, still not
photographic** — see §8.

### Glass preserved through the redesign

The shader, renderer and `RainGlass` component were **not modified** during the
green redesign. Only the surrounding scrim, type colour and header treatment
changed. Verified by screenshot at 1440 and 733 wide after the redesign.

---

## 6. Privacy & external requests

Request interception across `/care`, `/contact` and `/`:

**External requests: 0.**

- Fonts are self-hosted (`public/fonts`, 154 KB for two variable families)
- Logo is a local PNG derived from the Instagram profile picture
- No analytics, no tag manager, no chat widget, no CDN, no social embed
- Instagram is linked but never embedded or fetched

---

## 7. Storage — a real problem, reported honestly

| Volume | Free at start | Free now |
| --- | --- | --- |
| C: | **0.20 GB** | **≈ 0 GB** |
| D: | 892 GB | 899 GB |

**C: fell below the 500 MB threshold and then to zero.** It is now effectively
full and non-essential disk-intensive work should not be scheduled on it.

### What was done

Mitigated at the start, so this build added almost nothing to C::

- `npm config set cache` → `D:\_opencode_tmp\npm-cache` (370 MB)
- `TEMP` / `TMP` → `D:\...\LIMITEDSPOON WELLNESS\.cache\tmp`
- Playwright browser cache scoped to `D:\_opencode_tmp\ms-playwright`
- `node_modules` (116 MB) lives on D: with the project
- Screenshots and QA artefacts (30 MB) written inside the project, on D:
- Vite's watcher excludes `public/fonts`, `.playwright-mcp`, `docs` — a
  transient EBUSY lock on a font file was crashing the dev server

### What was found on C:, and why nothing was deleted

| Path | Size | Disposition |
| --- | --- | --- |
| `AppData\Local\ms-playwright` | **720 MB** | **Left alone.** This is Chromium + headless shell + ffmpeg. It was already installed before this session began (verified at kick-off: `chromium-1247` 437 MB, `chromium_headless_shell-1247` 280 MB). It is a tool install, not a cache this project created, and re-downloading it needs network and disk this machine does not have. Deleting it would risk breaking browser tooling for a gain the machine could not sustain. |
| `AppData\Local\Temp` | 21 MB | Cleared — genuinely disposable |
| `AppData\Roaming\Code\Cache` | 6 MB | Left — belongs to the user's editor |
| `opencode\tool-output` | 2.4 MB | Cleared — harness scratch, recreated on demand |

Clearing the disposable items recovered ~23 MB and Windows re-consumed it
immediately. **The only material way to reclaim C: is removing the Playwright
browsers, which is the user's call, not this project's.**

No destructive command was run against any unknown directory, and nothing the
user owns was deleted.

---

## 7a. Brand intro

| Property | Value | How verified |
| --- | --- | --- |
| Plays on hard refresh | Yes | Sampled the DOM every 150ms across a real reload |
| Phase sequence | `in` 488ms → `out` 2062ms → unmounted | Same sampling run |
| Plays on SPA navigation | No | Mounted by `Layout`, which survives route changes |
| Mark hold before exit | **1.5s** settled | `POP_DELAY + POP_DUR + HOLD_AFTER_POP` |
| Total sequence | 3.01s | `EXIT_AT + FADE_DUR` |
| Mark centred on viewport | **offBy 0px** at 390 / 1440 / 1920 | Measured `logoCentreY − innerHeight/2` |
| Mark width | 300px desktop · 180px at 390 | Computed style |
| `aria-hidden` | `true` | Asserted in test |
| Focusable content inside | 0 | Asserted in test |
| `prefers-reduced-motion` | No animation, page usable immediately | CSS + early unmount |
| Scroll restored after intro | `body.overflow` back to previous value | Asserted in test, and by wheel-scrolling each route |

**Defect found and fixed during this pass — the page could not scroll at all.**
The splash set `document.body.style.overflow = 'hidden'` and released it from an
effect cleanup. But the component renders `null` when it finishes rather than
unmounting, so that cleanup never fired and the lock stayed on permanently. The
fix separates the two concerns: a timer effect for the sequence, and a scroll
lock keyed to whether the splash is currently visible. `Intro.test.tsx` (5 tests)
guards it.

**Refresh lands at the top.** `history.scrollRestoration = 'manual'` plus a
zeroed offset run inline in `<head>`, before first paint — later than that and
the browser's own restoration wins the race. The hash is dropped on load so a
refreshed `/care#pcos` does not jump back to the anchor.

---

## 7b. Logo asset

| Source | Size | Outcome |
| --- | --- | --- |
| Instagram profile picture | 145×123 | **Rejected** — softens past ~96px |
| Lifted from a brand post | 278×233 | **Rejected** — mottled ground left a cream cast on the edges |
| **`data/logo.jpg` (supplied)** | 1280×2800 | **Used** |

The supplied file is the lockup centred on white between two black letterbox
bars. The bars were detected and trimmed, and the lockup was cut from white to a
real alpha channel: coverage comes from each pixel's distance to white, then the
white is divided back out of partially covered edge pixels so the anti-aliasing
keeps its own colour instead of carrying a white fringe.

Result: **765×677, 188 KB, 32-bit ARGB.** Verified crisp at 300px in the intro
and at 54px in the header, in both the natural and white-knockout treatments.

The white knockout is worth noting: the apple's interior is genuinely
transparent, so on a dark ground `brightness(0) invert(1)` reads as a white
outline rather than a solid blob. A drop-shadow behind the intro mark was also
removed — on a fine line drawing it read as dirt.

`data/logo.jpg` and `data/Glass.jpg` are both left byte-for-byte untouched.

---

## 8. Known limitations

Stated plainly rather than buried:

1. **The logo is a 765px raster.** Resolved from the 150px profile-picture
   derivation: the company supplied `data/logo.jpg` (1280×2800), which was
   trimmed and cut to a real alpha channel, giving a 765×677 asset that is crisp
   to ~382px on a 2x screen. It is still a raster, so a vector would remove the
   ceiling entirely. **Worth asking for.**
2. **The water is good, not photographic.** It is a physically-motivated
   approximation. A true drop lens needs per-bead inverse refraction through a
   real backdrop texture; the current ball-lens term is an approximation of
   that and cannot reproduce a true inverted image of complex scenery.
3. **The backdrop is procedural.** The interior view is derived from the
   reference's palette rather than sampled from it — deliberately, so no static
   streak in the photo can be mistaken for moving water. The consequence is that
   refraction distorts a stylised gradient, not real content.
4. **No published email.** Verified exhaustively: the bio's only contact link
   resolves to `https://gmail.com/` with no local part, and following it
   returns 302 to Instagram. No phone, address or hours are published either.
   The form therefore hands off to the clipboard + Instagram.
5. **No real photography.** All imagery is purpose-built SVG. It is licence-
   clean and claim-safe, but it is illustration, not photography. Genuine
   photography would need the company's own images or a licensed stock budget.
6. **axe cannot measure text over the canvas.** Only the hero was measured
   manually. Any future glass-backed page needs the same manual check.
7. **The hero is `100dvh`.** On mobile it resizes as browser chrome collapses.
   That is the intent — a hero that fills the screen the visitor is actually
   looking at. `100svh` is the alternative if that resize is unwanted.
8. **`SITE.stance` reads "Wellness > quick fixes".** It is now set under the
   logo on every page load. It reads like a code fragment and, for a clinical
   nutrition practice, argues against the proposition. It needs replacing with
   approved copy — not something to invent here.

---

## 9. Open questions for the company

Carried from `brand-research.md §8`:

1. Enquiry email address, and any phone / WhatsApp
2. Clinic address and opening hours
3. Session formats, durations and fees
4. Founder's exact qualifications and any professional registration
5. ~~The official logo as SVG or high-resolution PNG~~ — **answered**: master
   artwork supplied as `data/logo.jpg`. A vector would still be an improvement.
6. Whether privacy/terms pages are required for compliance
7. Whether the seven-item care list is complete and current
8. Approved brand strapline, to replace "Wellness > quick fixes"

None of these block the site. None were invented to fill a gap.