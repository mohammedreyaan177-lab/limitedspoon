# Architecture

## The decision

**Vite 7 + React 19 + TypeScript (strict) + React Router 7, no UI framework.**

### Why not Next.js
This is a five-route marketing site with no server rendering requirement and
no data layer. Next would have added a Node server runtime, a hydration model
and a substantially larger dependency tree to solve problems this site does
not have — while C: is at 0.2 GB free.

### Why no Tailwind / no component library
The brief calls for art direction, and this brand needs a real type scale, a
nine-step green ramp and deliberately different surfaces per route — the kind
of thing a utility framework has to be argued with rather than used. Hand-
written CSS Modules plus custom-property tokens produce **24 KB of CSS, 5.8 KB
gzipped**, with zero runtime.

### Why no Three.js for the water
Three.js is ~600 KB to draw one fullscreen quad. The entire rain surface is
~300 lines of GLSL against a ~15-line renderer class. Raw WebGL was both
smaller and easier to tune — and tuning was most of the work.

### Why no animation library
`requestAnimationFrame`, `IntersectionObserver` and CSS transitions cover
everything here. The only loop is the glass, and it is a single RAF with
explicit start/stop.

---

## Structure

```
src/
  config/site.ts          All company content, single source of truth
  gl/
    shaders.ts            Vertex + fragment GLSL (ES 1.00)
    RainGlassRenderer.ts  Context, RAF, resize, visibility, teardown
  components/
    RainGlass.tsx         React wrapper for the water surface
    Botanical.tsx         Purpose-built SVG artwork (5 marks)
    Header / Footer / Layout / Reveal / Logo / Button / RouteLoader
    layout.module.css     Surfaces, containers, splits, kicker
  pages/                  Home, Approach, Care, About, Contact, NotFound
  styles/                 tokens.css, global.css
  test/setup.ts           jsdom stubs for IO / matchMedia / ResizeObserver
public/
  brand/logo.png          Transparent logo derived from the Instagram profile
  fonts/                  Self-hosted variable fonts (154 KB total)
```

### Content boundary
Every string in `src/config/site.ts` traces to `brand-research.md`, which tags
each fact `[OBSERVED]` or `[UNVERIFIED]`. Unverifiable values are empty
strings, and the UI degrades honestly around them rather than rendering a
placeholder. This is why `CONTACT.email` is `''`: the Instagram bio links to
`https://gmail.com/` with **no local part**, so no address exists to publish.

---

## The glass surface

### Rendering model
A sum of **spherical-cap height fields**. Each bead contributes both its height
*and its analytic gradient*, so the surface normal is exact rather than
finite-differenced — one evaluation per layer instead of three.

Three falling layers (cell sizes 0.70×, 0.40×, 0.21× of the base) plus a static
condensation layer. Beads sit on a square lattice measured in **device
pixels**, so a droplet is the same physical size from a 320px phone to a 4K
monitor.

### Why droplets look like water
- **Ball lens, not paint.** A drop flips and shrinks its sample point about its
  own centre, producing the inverted sliver of background a real drop shows.
  The dominant bead is tracked in pixel space so it survives per-layer cell sizes.
- **One specular, not a rim.** A uniform bright ring is the tell of fake rain.
- **A caustic** on the lower inner wall, opposite the highlight.
- **An edge darkening** term: the steepest part of a bead bends light through
  the dark room, which is what makes drops sit *in* the glass rather than on it.
- **Fine mist shaded as scatter.** Micro-condensation is too small for a
  specular lobe to catch, so its height drives a haze term instead.
- **Per-column hashed fall speed** — the single biggest difference between
  "rivulets" and "a sliding sheet".

### Lifecycle
`destroy()` is idempotent and cancels the RAF, unhooks every listener, deletes
the program/buffer/shaders and calls `loseContext()` so the driver reclaims GPU
memory immediately rather than waiting on GC.

The canvas element is created **inside the effect**, not declared in JSX. A
canvas can only ever have one context, so a declarative canvas is permanently
poisoned by the `loseContext()` that teardown performs — React StrictMode's
mount/unmount/remount sequence would otherwise leave the surface blank. This
was a real bug, caught by screenshotting and fixed.

### Degradation
| Condition | Behaviour |
| --- | --- |
| No WebGL | Canvas left empty; CSS gradient supplies a static wet pane; `onUnsupported` fires; **content always renders** |
| `prefers-reduced-motion` | One settled frame drawn, no RAF loop |
| Tab hidden | Loop stopped via `visibilitychange` |
| Scrolled offscreen | Loop stopped via `IntersectionObserver` |
| Route change | Teardown releases every GL resource |

Text is never inside the canvas. Water renders into its own layer; copy sits
above it in normal DOM, so it stays selectable, screen-reader visible and
pin-sharp regardless of the shader.

---

## Routing & code splitting

`/` is bundled eagerly (first paint ships the hero and the glass). The other
five routes are `React.lazy`, each in its own chunk (~1–3 KB gzipped). Only the
home route receives the transparent header treatment, via a dedicated `<Layout
heroHeader />` route branch.

---

## Accessibility architecture

- One `<h1>` per route, verified by test
- Skip link, and `scrollTo` on navigation
- Mobile drawer is a real `<nav>` with `aria-expanded` / `aria-controls`;
  Escape closes and returns focus; body scroll locks and releases
- Form: labels on every control, error summary focused on submit, inline errors
  wired via `aria-describedby`, `aria-invalid` on failures
- `Reveal` has three independent layers of protection (reduced-motion, missing
  IntersectionObserver, 4s failsafe) so an animation can never gate readability
- `prefers-reduced-transparency` collapses the frosted header to solid

---

## Testing

26 tests across 5 files:

| File | Covers |
| --- | --- |
| `a11y.test.tsx` | axe on Home / Care / Contact; one-h1 assertions |
| `Contact.test.tsx` | Empty submit, focus move, email validation, min-length, error clearing, clipboard hand-off, labelling |
| `Header.test.tsx` | Toggle state + accessible name, drawer landmark, Escape + focus return, scroll lock, active-route state |
| `RainGlass.test.tsx` | No-WebGL fallback, children always render, canvas hidden from AT, canvas removed on unmount |
| `Reveal.test.tsx` | Children always in DOM, reduced-motion, missing IO, failsafe timer |

---

## What is deliberately absent

No backend, no database, no API, no analytics, no cookie banner, no chat
widget. The enquiry form hands the message to the visitor's clipboard and opens
Instagram, because no email address is published and inventing an endpoint would
mean inventing infrastructure the company has not asked for.