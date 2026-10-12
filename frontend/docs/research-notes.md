# Research notes — what was actually consulted

Everything below was opened or executed during this build. Where a source was
unavailable or its output was rejected, that is recorded rather than glossed
over.

---

## 1. Company source material

| Source | What was read |
| --- | --- |
| `instagram.com/limitedspoon.wellness` | Profile header, expanded bio, follower counts, 9 highlight titles, 15 grid items, full-page screenshot of the grid |
| 9 post permalinks | `og:description` on each — the actual caption text |
| Profile picture | Downloaded at 150×150, converted to transparent PNG (see §5) |
| `data/Glass.jpg` | 733×418 rain-on-glass photo — the sole supplied asset |

Findings and their consequences are in `brand-research.md`. The single most
consequential one: **this is a clinical nutrition practice, not a product
brand**, which removed the product grid, pricing table, cart and 3D product
model from scope before any of them were built.

---

## 2. Design skills actually used

All three were loaded and applied, not merely cited.

### `frontend-design`
Loaded and read in full. Its most useful contribution was negative: it lists
the traits that mark a page as machine-generated — cream ground + high-contrast
serif + terracotta accent, tracked ALL-CAPS eyebrows above every heading,
`01/02/03` on non-sequences, a trailing `→` on every button, the rounded-card
SaaS kit. **The first version of this site committed all of them.** The redesign
removed every one: the ground is green, labels are sentence case with a leaf
rule, numbering survives only on the three genuinely-ordered steps, and no
button carries an arrow.

### `apple-design`
Applied to: material layering (header as a translucent frosted layer, not an
opaque bar), size-specific type tracking (`--tracking-display` −0.025em on
display, ~0 on body), focus visible in amber on deep grounds and leaf on light
grounds, and reduced-motion handled as a first-class state rather than a
global transition-kill.

One rule was deliberately **not** followed: it warns against full-viewport
moving backgrounds. The glass hero is one. It is kept because it is the brief's
central requirement and it is paused to a single static frame under
`prefers-reduced-motion` — the exact mitigation the skill asks for elsewhere.

### `ui-ux-pro-max`
The bundled Python engine was executed (Python 3.14.6), not just described.

```
python search.py "nutrition wellness dietitian service botanical natural" --design-system
python search.py "botanical green organic natural wellness" --domain color
python search.py "organic editorial botanical premium" --domain typography
```

**Result 1 — the whole-site design system** returned a *pink + lavender*
palette (`#EC4899` / `#8B5CF6`, "Soft pink + lavender luxury"). **Rejected.**
It is wrong for a green brand, and the brief requires the logo's own colours.
Its structural advice was kept: pattern ordering, the contrast floor, the
reduced-motion and focus checklist, and its anti-pattern list.

**Result 2 — colour domain.** The "Florist / Plant Shop" entry was the useful
one: primary `#15803D`, background `#F0FDF4`, foreground `#14532D`, border
`#BBF7D0`. This confirmed a nine-step botanical ramp with light herbal reading
surfaces is a sound structure for this category, and it agreed closely with the
greens sampled from the logo. Adopted as the structural model; the actual hexes
came from the brand, not from this table.

**Result 3 — typography** returned Playfair Display + Inter ("Classic
Elegant") and Lora + Raleway ("Wellness Calm"). Both rejected: Playfair + Inter
is close to the default pairing the `frontend-design` skill explicitly warns
about, and neither matches the condensed-grotesque lineage of the brand's own
posters. Kept Fraunces + Archivo, which pairs an organic display serif against
the brand's own sans, and self-hosts at 154 KB for both families.

**Documented limitation:** the skill's colour and typography tables skew toward
generic wellness brands and produced no palette that matched this logo. The
decision path above is recorded so the rejection is auditable rather than
invisible.

---

## 3. Visual references

| Reference | Taken from it |
| --- | --- |
| `99designs.com/inspiration/websites/nutrition` | Green-dominant wellness palettes (ARGA, UCI-II); editorial hero with a single strong statement; the "What is / Who do / What do / When" numbered-column device; card-less flat sections separated by hairlines |
| The live Instagram grid | The brand's own poster language: condensed display, rules, cream ground |
| `data/Glass.jpg` | The whole water treatment |

No reference was copied. No competitor's layout, copy or identity was taken.

---

## 4. Technical research

| Question | Source | Outcome |
| --- | --- | --- |
| Which renderer for the water? | Manual comparison | Raw WebGL, ~300 lines of GLSL, no dependency. Three.js would have added ~600 KB for one fullscreen quad and made the shader harder to tune, not easier. |
| GLSL version | GLSL ES 1.00 written against both WebGL1 and WebGL2 | Older mobile browsers keep the effect |
| Droplet simulation | Spherical-cap height fields with **analytic** gradients | Normals are exact, not finite-differenced. Costs one evaluation per layer per pixel instead of three. |
| Why the beads fall unevenly | Per-column hashed fall speed | A single global rate reads as a sliding sheet; per-column rivulets read as rain. Verified by block-shift correlation: no single global shift aligns the frames, which is the stagger working. |
| Resolution independence | Lattice measured in **device pixels**, not normalised coords | In normalised space a wider viewport makes every droplet larger — at 1440px the pane became a handful of giant bubbles. `uCellPx` derives from CSS width, clamped 68–148px. |
| No WebGL | `getContext` returns null → caught → CSS gradient fallback | Content is never hidden; `onUnsupported` fires |
| Reduced motion | `matchMedia` checked at construction and on change | Renders one settled frame, no RAF loop |
| Tab hidden / offscreen | `visibilitychange` + `IntersectionObserver` | Loop stops; GL resources released on unmount via `loseContext()` |
| Route-level contrast over canvas | axe cannot measure it | Measured manually by screenshotting and computing WCAG relative luminance — **14.9:1**, see `qa-report.md` |

Framework choice (Vite + React 19 + TS, React Router 7) and its rationale are
in `architecture.md`.

---

## 5. Logo provenance

The profile picture was fetched through the browser's request context (the
Instagram CDN rejects unsigned and CORS requests), then processed **in-browser
via canvas** and posted back to disk, so no image library was installed for a
one-off task.

The alpha is derived from **each pixel's distance to white**, not a hard
threshold. A hard cut leaves JPEG mosquito noise as opaque specks inside the
apple — that was visible in the first attempt and is why the first render had
dark blotches in the mark. The distance ramp dissolves the noise and
anti-aliases the edges. The result was auto-cropped to its 145×123 content box.

The raw 150×150 is the largest rendition Instagram serves for a profile
picture, so **~96px is the practical ceiling** before the mark softens. It is
used at 54–78px in chrome and 104–120px in the medallions, all inside that.
Supplying the official vector would remove the ceiling.

---

## 6. Tools actually used

- **Playwright** (MCP) — navigation, screenshots, DOM inspection, request
  interception, clipboard read, in-browser canvas processing
- **axe-core** — WCAG 2.0/2.1/2.2 A + AA + best-practice, live and in Vitest
- **Vitest + Testing Library + jsdom** — 26 tests
- **ESLint 9 + typescript-eslint** — lint
- **tsc -b** — typecheck
- **Vite** — dev server and production build
- **Python 3.14.6** — the `ui-ux-pro-max` engine only

No skill, MCP server or tool is claimed in this report that was not invoked.