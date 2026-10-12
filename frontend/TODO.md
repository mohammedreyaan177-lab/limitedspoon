# LIMITED SPOON WELLNESS — Build Checklist

Legend: `[ ]` not started · `[x]` complete & verified · `[!]` blocked / needs the company

## Phase 1 — Environment & assets
- [x] 1. Environment inspection (Windows, Node v24.18.0, npm 11.16.0, git 2.55)
- [x] 2. Asset inventory — `data/Glass.jpg`, 733×418, the only supplied file
- [x] 3. Glass-reference identification & visual inspection
- [x] 4. Storage audit — C: at **0.20 GB**, below the 500 MB threshold
- [x] 5. Storage mitigation — npm cache, TEMP/TMP, Playwright cache all on D:
- [x] 6. Skill / MCP / tool discovery recorded

## Phase 2 — Brand research
- [x] 7. Instagram profile inspected (header, expanded bio, 9 highlights, 15 grid items)
- [x] 8. 9 post captions read from permalinks
- [x] 9. **Logo recovered** — profile picture fetched, background knocked out to transparent PNG
- [x] 10. Contact details audited exhaustively — none published beyond Instagram
- [x] 11. `docs/brand-research.md` written, every claim tagged

## Phase 3 — Research
- [x] 12. `frontend-design` skill read and applied; its "generic default" list used as a checklist
- [x] 13. `apple-design` skill read and applied
- [x] 14. `ui-ux-pro-max` engine executed; pink/lavender output **rejected** with reasons
- [x] 15. Visual reference research — 99designs nutrition gallery + the live grid
- [x] 16. `docs/research-notes.md` written

## Phase 4 — Architecture
- [x] 17. Architecture decision — Vite + React 19 + TS + Router, no UI framework
- [x] 18. Project init; 269 packages; npm cache on D:
- [x] 19. `docs/architecture.md` written

## Phase 5 — Glass effect
- [x] 20. Shader prototype vs `data/Glass.jpg`, nine iterations
- [x] 21. Analytic height + gradient spherical caps
- [x] 22. Ball-lens inversion, single specular, caustic, edge darkening
- [x] 23. Resolution-independent pixel-space lattice
- [x] 24. Per-column hashed fall speed (rivulets, not a sheet)
- [x] 25. Downward motion verified — 8.5% pixels changed over 6s, downward block shift over 12s
- [x] 26. Reduced motion verified — 0.00% change over 4s, content still visible
- [x] 27. StrictMode lost-context bug found and fixed
- [x] 28. Glass preserved unchanged through the redesign

## Phase 6 — Design system & site
- [x] 29. Nine-step botanical green ramp derived from the logo
- [x] 30. First design rejected — it matched the "generic AI page" trait list exactly
- [x] 31. Green-forward system: no default white canvas anywhere
- [x] 32. Distinct identity per route (glass / airy light / deep index / cream editorial / deep+light split)
- [x] 33. All 5 routes + 404 implemented
- [x] 34. Purpose-built SVG botanical artwork, 5 marks, licence-clean
- [x] 35. Self-hosted fonts — **0 external requests**
- [x] 36. Enquiry form: labels, error summary, focus management, clipboard hand-off
- [x] 37. 3D evaluated — rejected with reasons (no product to model; the water is the immersive moment)

## Phase 7 — Integration & responsive
- [x] 38. Responsive verified at 320 / 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920
- [x] 39. `/contact` horizontal overflow found and fixed at every mobile width
- [x] 40. Footer touch targets raised from 24–40px to ~44px
- [x] 41. Mobile drawer verified: state, Escape, focus return, scroll lock, navigation

## Phase 8 — QA
- [x] 42. axe-core live audit — **0 violations across all 6 routes**
- [x] 43. Contrast defects fixed (--text-soft ~3.4:1; kicker 3.9:1)
- [x] 44. Broken `aria-labelledby` on `/care` found and fixed
- [x] 45. Hero contrast measured manually over the canvas — **14.93:1**
- [x] 46. Screenshots captured and inspected on every route
- [x] 47. Console errors checked — none from the app
- [x] 48. External request audit — **0**
- [x] 49. `tsc -b` — PASS · `eslint` — PASS · `vitest` — 26/26 · `build` — PASS
- [x] 50. `docs/qa-report.md` written with actual measured results

## Phase 10 — Brand intro, logo, deployment
- [x] 53. Reference reviewed — `thawamart.vercel.app`, centred logo splash dissolving into the page
- [x] 54. `Intro.tsx` built: logo pops with overshoot, holds, then the curtain dissolves
- [x] 55. Plays once per **page load**, not per route change (mounted by the shared `Layout`)
- [x] 56. Scroll restoration forced to `manual` + offset zeroed **before first paint**, in `index.html`
- [x] 57. A refresh now always lands at the top of the route you were on
- [x] 58. Page scroll-locked only while the splash is genuinely on screen
- [x] 59. **Scroll-lock regression found and fixed** — the unlock lived in an effect cleanup that never fired, because the component returns `null` instead of unmounting. The page stayed unscrollable permanently. Keyed the lock to the visible state instead.
- [x] 60. `Intro.test.tsx` added (5 tests) to guard the lock, its restore, and the reduced-motion path
- [x] 61. Logo centred on the true viewport centre; rule + strapline hung below it so they cannot drag it off-centre (verified `offBy: 0` at 390 / 1440 / 1920)
- [x] 62. Hold lengthened so the mark sits settled and legible for **1.5s** before anything moves (total 3.01s)
- [x] 63. Intro mark reduced to 300px / 46vw — inside the logo's own clear space
- [x] 64. `aria-hidden`, no focusable content, scroll lock released on unmount
- [x] 65. `prefers-reduced-motion` — sequence suppressed, page usable immediately

## Phase 11 — Logo replacement
- [x] 66. Standard lockup identified from the brand posts (apple + clock, LIMITED SPOON, NUTRITIONAL ADVISORY CENTRE) — matches the version repeated across their templates
- [x] 67. **Master artwork supplied** as `data/logo.jpg`, 1280×2800 — supersedes the earlier derivations
- [x] 68. Black letterbox bars trimmed; lockup cut to a real alpha channel from white
- [x] 69. White divided back out of partially covered edge pixels — no white fringe on the anti-aliasing
- [x] 70. Installed at **765×677** (188 KB), replacing the 145×123 and 278×233 cuts
- [x] 71. `Logo.tsx` intrinsic dimensions, crispness ceiling and provenance updated
- [x] 72. Drop-shadow behind the intro mark removed — it was reading as dirt on a fine line drawing
- [x] 73. `data/logo.jpg` and `data/Glass.jpg` both left untouched

## Phase 12 — Viewport & deployment
- [x] 74. Hero set to exactly one viewport tall — `100vh` → `100svh` → `100dvh`
- [x] 75. Verified filling exactly: 900/900, 1080/1080, 1440/1440; grows rather than crushing on landscape phones
- [x] 76. Scroll hint given its own lane at ≥64rem so it cannot collide with the hero buttons
- [x] 77. `vercel.json` added — SPA rewrites, immutable asset caching, no-revalidate HTML, security headers
- [x] 78. `.gitignore` added (`dist`, `node_modules`, `.vercel`, env, logs)
- [x] 79. Responsive sweep — 11 viewports × 5 routes = **55 checks, 0 horizontal overflow**
- [x] 80. Produce band orphan fixed — was wrapping 7+1 below 48rem, now a balanced 4×2 grid
- [x] 81. Home added to `NAV` (desktop + drawer) as an explicit Home button
- [x] 82. `tsc -b` — PASS · `eslint` — PASS · `vitest` — **31/31** · `build` — PASS

## Phase 13 — Home entry points
- [x] 83. Opening the bare domain already resolved to home — confirmed, not assumed
- [x] 84. **Defect found and fixed:** `/home`, `/Home`, `/HOME`, `/home/`, `/home/care` and `/index.html` all fell through to the 404 page
- [x] 85. Server-side `redirects` added to `vercel.json` so these never reach the app on Vercel
- [x] 86. Matching client-side `<Navigate replace>` routes, so any other host behaves the same
- [x] 87. `replace` used so Back does not bounce a visitor between the alias and the real page
- [x] 88. React Router splat corrected to `home/*` — the `:path*` form emitted a console warning
- [x] 89. Verified 7 entry points land on `/` with **0 console warnings**; deep links and the 404 unaffected

## Phase 14 — Nutrition literacy band
- [x] 90. **Defect fixed:** the band was `surfaceDeeper` — a flat `#081c11` fill that read as a hole punched in the page
- [x] 91. Replaced with a self-contained ground that lifts to `--botanic-900` where it meets the sage band above, falls through the body, and carries a faint leaf-green pool behind the produce
- [x] 92. Produce added: apple + citrus + greens cluster, sized as a percentage of its box so it fills at any width
- [x] 93. Heading and shelf share the top row (7fr/5fr at ≥62rem); the four notes run full width beneath
- [x] 94. Art capped at 13.5rem desktop / 9rem narrow so it never pushes the notes down
- [x] 95. Verified 0 horizontal overflow at 320 / 390 / 768 / 1024 / 1440 / 2560
- [x] 96. Ground lifted again on request — from `#1d5334`/`--botanic-800`/`--botanic-700`, so it is unmistakably **green** and sits on the brand ramp rather than reading as black
- [x] 97. **3D logo plate added** — beveled chip carrying the mark, with a specular sweep and the logo sitting proud of it. Built from gradients and shadows, not a rendered 3D asset, so it stays crisp at any size and costs one image request
- [x] 98. Plate tilts in perspective and floats slowly; both suppressed under `prefers-reduced-motion`
- [x] 99. **Bug caught:** the plate's `drop-shadow` was silently overriding Logo.module.css's `brightness(0) invert(1)` knockout, dropping the mark back to dark green on a dark plate. Filter now written out in full, with a comment explaining why
- [x] 100. Kicker lifted to `--leaf-200` — against the lightest point of the new ground `#1d5334`, `--leaf-300` only reached 4.66:1; leaf-200 clears 5.7:1
- [x] 101. Re-verified 0 overflow and both the plate and the produce well in-bounds at 320 / 390 / 768 / 1024 / 1440 / 2560

## Phase 15 — Literacy band to white
- [x] 102. Band changed to white on request — but not a flat `#fff`: a whisper of the sage ramp at the foot plus the leaf-green pool, so it stays in the family instead of reading as the browser default
- [x] 103. All text inverted with the ground: headings → `--botanic-950`, kicker → `--botanic-700`, body → `--text-soft`, rules → `--line-strong`
- [x] 104. **Body copy was set inline to the on-dark sage** (`--sage-300`) — near-invisible on white. Moved to a `.literacyBody` class
- [x] 105. Leaf field opacity dropped to 0.13 as a watermark; at the old 0.55 it was a texture you could read on a white ground
- [x] 106. Watermark uses a two-class selector (`.literacy .literacyLeaves`) so it beats `layout.leafTexture` regardless of stylesheet order — `:global` would not, the emitted name is hashed
- [x] 107. The 3D plate now reads better than it did on green — a dark chip carrying a white mark against white
- [x] 108. Contrast re-verified against white: kicker **7.68:1**, body **5.90:1**, headings ~19:1. axe still reports **0 violations**

## Phase 16 — Principle tiles
- [x] 109. Confirmed by measurement that the "Three things" band is already `rgb(15,46,27)` = `--botanic-900`, exactly the colour in the reference screenshot — left untouched rather than assumed correct
- [x] 110. Confirmed the literacy band is the only light one, per the brief
- [x] 111. **3D tiles added**, one per principle — same bevel language as the logo plate, but square, 2.9rem, and built from strokes rather than an image
- [x] 112. Icons carry the meaning: a sprout (nothing extreme, it just grows), a clock echoing the face inside the logo's apple (no pressure), three ascending steps (consistency)
- [x] 113. Tile tips toward the reader on hover and settles; sheen sweeps, staggered 1.8s apart so the three never move in lockstep
- [x] 114. All motion suppressed under `prefers-reduced-motion`
- [x] 115. `.stanceItem` reflowed to `auto minmax(0,1fr)` so the tile and text sit on one row without the text column collapsing
- [x] 116. Verified 3 tiles render and 0 overflow at 320 / 390 / 768 / 1440 / 2560

## Phase 17 — The nutrition dial
- [x] 117. Left column of the promise band centred (`justify-items: center`) instead of hugging the left edge with dead space beneath
- [x] 118. **Produce dial built** — the brand's clock-in-apple motif run as a real dial: beveled bezel, hour ticks, eight produce marks at the hour positions, hub and hand
- [x] 119. Entirely CSS + the existing Produce marks. No image, no model, no extra request, crisp at any size
- [x] 120. Marks placed by inline `--i` / `--n` custom properties, so adding a mark needs no CSS
- [x] 121. Dial turns at 70s; suppressed under `prefers-reduced-motion`
- [x] 122. **Bug fixed — transform order.** `translate(-50%,-50%)` came last, so it was applied in the rotated frame; each mark walked off the centre line and parked on the bezel. Centring must come first
- [x] 123. **Bug fixed — paint order.** All layers are absolutely positioned siblings with no `z-index`, so the face — later in the markup — painted over the produce and the hand. Explicit z-index 0–5 now
- [x] 124. **Bug fixed — the hand was never in the markup.** The CSS existed but no element was rendered; it was invisible for that reason, not a styling fault
- [x] 125. Marks normalised to a fixed square box with the SVG fitted inside, so the ring is not lumpy. Percentage size attributes on `Produce` resolve inconsistently in a grid — driven from CSS instead
- [x] 126. Verified 0 overflow at 320 / 390 / 768 / 1440 / 2560; type and dial share one centre axis

## Phase 18 — About band
- [x] 127. "The centre" kicker set to pure white — the shared `--leaf-300` reads as dull olive on the deep story band. Verified `rgb(255,255,255)`
- [x] 128. **3D care carousel built** — the seven areas of care standing on a rotating cylinder. Genuinely different from the plate, tiles and dial, which are all flat single-sided objects
- [x] 129. Real depth: cards at `rotateY(k × 360/n) translateZ(265px)` on a `preserve-3d` rail under `perspective: 1500px`. Verified the computed transform is a `matrix3d`, not a flat rotate
- [x] 130. Interaction: pointer drag, prev/next buttons, and arrow keys all turn it. Auto-advance every 4.2s until a visitor touches any control
- [x] 131. Front card is ringed in leaf green at full opacity; the rest recede — the eye always knows what it is reading
- [x] 132. Accessible: `role="group"` + `aria-roledescription`, labelled buttons, `aria-live` announcing the front card, non-front cards `aria-hidden`
- [x] 133. `touch-action: pan-y` so dragging turns the rail without stealing vertical scroll
- [x] 134. Reduced motion drops the rotation and auto-advance and lays the cards out flat with scroll-snap — depth is dropped rather than faked
- [x] 135. Verified next/prev/keyboard all advance and wrap correctly (01→02, 02→01→07, 07→01); 0 overflow at 390

## Phase 19 — Reverted, then rebuilt properly
- [x] 136. **Carousel reverted.** It had been added as a second block under the facts, which changed a section the owner had explicitly marked as untouchable. Component, its CSS and its markup all removed — verified 0 carousel nodes remain
- [x] 137. PowerShell re-encode corrupted two em-dashes in `About.tsx` and added a BOM. Detected, reversed the double-encoding, BOM stripped; file now carries exactly 2 U+2014 and no BOM
- [x] 138. The facts list **is** the 3D now. Same four rows, same labels, same values, same order — each is a bevelled panel that leans toward the pointer
- [x] 139. Tilt written to CSS custom properties, not `style.transform`, so the resting transform stays in the stylesheet and cannot be clobbered
- [x] 140. Verified pointer response: top-left → `-6.70°/3.63°`, bottom-right → `6.46°/-3.93°`, settles to identity on leave. `<dl>/<dt>/<dd>` semantics kept
- [x] 141. Band back to 696px tall, with no dead space beneath
- [x] 142. `/care` note fixed — `max-width: none` meant ~104 characters per line. Now capped at 74ch (68ch on the paragraph)
- [x] 143. Refresh verified on `/`, `/care`, `/contact`: scrolled to 1500 then reloaded, each lands at `scrollY: 0` on its own path with `scrollRestoration: manual`
- [x] 144. **Intro centring diagnosed properly.** The `<img>` box was already dead-centre (0px, four viewports) and the artwork centred in the file to 1px — but the alpha-weighted centroid sits **41px right and 58px down** of the canvas centre, because the heavy dark "SPOON" and strapline pull the mass that way. Compensated with `translate: -5.37% -8.51%`; perceived centre now measures exactly on the viewport centre
- [x] 145. Caption anchor re-derived to `0.3672` so the gap holds after the shift

## Phase 20 — Stance gyroscope (Approach)
- [x] 146. Located the section: it is the **Approach** page's stance band, not Home — the copy in the reference screenshot is `There is a version of nutrition advice built on restriction and guilt`
- [x] 147. Confirmed the empty space is right of the heading block, above the three principles
- [x] 148. **Gyroscope built** there — three rings on three different axes around a bevelled core. Open 3D rather than the flat disc used on Home, so the two never read as the same object twice
- [x] 149. Concept: the section argues against restriction and guilt, and a gyroscope is the physical version of that — three rings spinning while the assembly stays upright. One ring per principle, one bead per ring riding at an ordinary pace
- [x] 150. Pointer tilt verified: top-left → `28.9°/-40.5°`, bottom-right → `-1.4°/0.5°`, settles to exactly `14°/-20°` on leave
- [x] 151. Rings spin on independent periods (19s / 26s / 34s), verified by changing `matrix3d` between samples
- [x] 152. **First attempt failed visually** — a border-box gradient with a mask composite left the rings nearly invisible on the dark ground, and under reduced motion all three collapsed onto the viewer's plane and read as one flat circle. Rebuilt as real borders at three sizes, with static axis transforms in the reduced-motion block
- [x] 153. Heading, paragraph and all three principles unchanged and in place — the gyroscope occupies only space that was empty
- [x] 154. Verified 0 overflow and in-bounds at 390 / 768 / 1440 / 2560; 3 principles still rendering at every width

## Phase 21 — Responsive sweep & navigation
- [x] 155. **Crowding fixed on phones.** The principle tile took 2.9rem + a gap out of a 268px column, leaving ~212px — about 28 characters a line. Tile now stacks above the text below 40rem: text column back to the full 268px and 4 lines became 3
- [x] 156. **Desktop untouched**, verified not assumed: grid columns stay `46.4px + rest` with the tile inline at 768 / 1280 / 1440 / 1920
- [x] 157. 36 mobile/tablet/desktop checks across 6 routes — **0 horizontal overflow**
- [x] 158. Audit for distortion and tap targets run. Every flagged "squashed" SVG is a decorative full-bleed texture or an art-directed leaf sprig; no content image is distorted
- [x] 159. The care-area items flagged as crowded were a false positive — the detector measured the whole row including the produce well. Measured directly they run ~40 chars/line
- [x] 160. **Real bug found and fixed: SPA navigation never reset scroll.** The reset depended on `[]`, so it fired once per mount — but `Layout` is shared by every route below the home hero, so `/care` → `/about` reused the instance. Clicking a header link from 1,600px down landed 1,600px down on the next page. Now keyed to `pathname`
- [x] 161. `Layout.test.tsx` added (2 tests) reproducing the shared-Layout condition so it cannot regress
- [x] 162. Navigation verified end to end: 5 header links + 3 deep refreshes + 2 hash URLs = **10/10 land at top**. Hash is stripped, route preserved
- [x] 163. Hard refresh verified on all 6 routes after scrolling to the very bottom (2,253–4,957px) — every one lands at 0
- [x] 164. 0 console errors, 0 external requests
- [x] 165. `tsc -b` PASS · `eslint` PASS · `vitest` **33/33** (7 files) · `build` PASS

## Phase 9 — Closeout
- [x] 51. `data/Glass.jpg` verified untouched
- [x] 52. Storage re-checked

## Blocked — needs the company owner
- [!] Enquiry email address (bio link resolves to bare `gmail.com`, no local part)
- [!] Phone / WhatsApp, clinic address, opening hours
- [!] Session formats, durations, fees
- [!] Founder's exact qualifications and registration
- [x] ~~Official logo~~ — **resolved**: master artwork supplied as `data/logo.jpg`, processed to a 765×677 transparent PNG. A vector (SVG/EPS/AI) would still remove the raster ceiling entirely and is worth requesting.
- [!] Whether privacy/terms pages are required
- [!] Confirmation the 7-item care list is current
- [!] **`SITE.stance` reads "Wellness > quick fixes"** — now shown under the logo on every page load. Reads like a code fragment and, on a clinical nutrition practice, argues against the whole proposition. Needs replacing with approved brand copy.

## Known limitations
- The water is a physically-motivated approximation, not photographic
- All imagery is illustrative SVG — no photography is in use
- The backdrop is procedural, so refraction bends a gradient rather than real content
- The logo is a 765px raster; crisp to ~382px on a 2x screen, soft beyond. A vector removes the ceiling.
- The hero is exactly 100dvh, so on mobile it resizes as browser chrome collapses. That is intentional; `100svh` is the alternative if the jump is unwanted.