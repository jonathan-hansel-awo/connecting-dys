# Homepage scene contracts — Phase 00

Audited 14 November 2026 against `master` at `d45aeff2c9b0148c9b3cb6db72613f35ebf595fb`. This describes the **existing implementation** and the boundaries for later work. No chapter is redesigned in Phase 00. See [baseline report](PHASE_00_BASELINE.md) and [roadmap](HOMEPAGE_ENHANCEMENT_ACTION_PLAN.md).

## Shared document and motion policy

DOM order is header → separate Reading settings toolbar → `main#main-content[tabindex="-1"]` → footer. Main contains seven semantic sections in the order below. There is no voices chapter or game. All text, links and complete SVG paths are server-rendered. No opacity-zero text, animation-dependent reading, transformed body/main, wheel snapping or synthetic scroll runway is permitted.

The **current** animation tiers are:

| Condition | Actual behaviour |
| --- | --- |
| OS no-preference, personal motion enabled, non-spacious; width ≥1100px, height ≥700px, fine pointer | Desktop scrubs, artwork-only pin and lateral landscape |
| Same motion/reading permissions, any other viewport/pointer | Compact unpinned scrubs; ordinary vertical document |
| OS reduced motion, personal reduced motion, or spacious reading | Homepage timelines revert; static artwork and normal-flow chapters |
| Fine pointer, OS/personal motion enabled | Lenis interpolates wheel input, independently of spacious mode |
| Coarse pointer or OS/personal reduced motion | Native scrolling; no Lenis instance |
| Forced colours | CSS supplies visible component borders; **currently not a GSAP/Lenis disable condition**. Later phases must close this gap. |

`data-spacious="true"` means size >20px, line height >1.8, letter spacing >0.04em, or OpenDyslexic selected. Exact 20px/1.8/0.04 boundaries do not opt out. Font selection and spacing apply to real content; the approved logo images and identity wordmarks retain their branding. Optional fonts are self-hosted and requested when selected.

## Chapter contracts

| Chapter and DOM order | Decorative targets allowed to move | Current start → end | Layout / no-motion fallback | Focus and navigation contract |
| --- | --- | --- | --- | --- |
| 1. Welcome `.hero`: copy/H1/actions, then composition, then bottom links | `.hero-orbit` only. **Never** `.logo-stage`, either brand image, wordmark, tagline, reading text or actions. | Trigger `.hero`: `top top` → `bottom top`; desktop y −35px / rotation −8°, compact −12px / −10°. Scrub 0.6 desktop, true compact. | Two-column at larger widths, stacked ≤700px. Spacious mode stacks and removes orbit. Static CSS composition otherwise. | H1 `#hero-title`; Explore support → `/support`, Find your community → `#community`, bottom link → `#recognition`. All remain still and immediately usable. |
| 2. Recognition `#recognition`: artwork label, figure/frame/image/caption, then copy/H2/link | `.recognition-photo` inside `.recognition-media` only; frame/caption/copy remain stationary | Frame: `top bottom` → `bottom top`; xPercent −1.2→+1.2, scale 1.05. Scrub 0.5 desktop, true compact. | Two columns >1000px; single column ≤1000px or spacious. Photo retains 3:2 frame, `overflow: clip`, isolation; caption in flow; positive grid gap. No motion: ordinary cover image, no GSAP transform. | Fragment `#recognition` uses native scroll padding; H2 `#recognition-title`. Link → `#explore`. Caption discloses AI scene, not members. Do not revive negative media margins/visible overflow. |
| 3. Discovery `#explore`: heading/introduction, four linked rows, footnote | **None currently.** Future decorative row art/marker only; never transform the whole anchor or its text. | No timeline currently; Phase 03 must define one before implementation. | All four rows remain ordinary links at every width. Spacious layout simplifies columns. No compulsory swipe or horizontal navigation. | H2 `#explore-title`; row order `/dyslexia`, `/dyspraxia`, `/dyscalculia`, `/dysgraphia`. Same reading order and direct hit targets in every mode. |
| 4. Connection `#community`: heading, visual, three articles, status note/link | `.connection-visual` may pin (decorative, `aria-hidden`, no controls); `.art-landscape`, `.journey-path`, `.connection-progress span` may animate | Desktop pin ID `connection-art`: visual `top 140px` → `+=max(0, chapters.offsetHeight − visual.offsetHeight)`, `pinSpacing:false`. Timeline `connection-desktop`: chapters `top 55%`→`bottom 70%`, scrub 0.7. Compact `connection-compact`: visual `top 90%`→`bottom 20%`, scrub true. Landscape x +45→−45 desktop / +18→−18 compact; path dash 0.95→0 with pathLength=1; progress scaleX 0→1. | Desktop art sits alongside three articles; mobile art precedes them. Compact never pins. Spacious/reduced/no-JS: full static landscape/path and all three articles. No long blank runway. | H2 `#community-title`. Only note CTA → `/get-involved`; never put focusable controls inside the pinned/aria-hidden artwork. Keep the statement that full services are not yet delivered. |
| 5. Support `.support`: heading then three practical links | None currently; future decorative surface only | No timeline currently | Calm two-column → stacked phone/spacious layout; all links always visible | H2 `#support-title`; `/support`, `/get-involved`, `/contact`. Do not move actionable links on scroll. |
| 6. About `.about-home`: original full logo/caption, then verified CIC/Marie copy | None currently; future frame only. **Logo is never a morph, path or tween target.** | No timeline currently | Two-column → stacked phone/spacious. Approved full logo retains intrinsic ratio. Alternate reading backgrounds override panel colour. | H2 `#about-title`; `/about`. Preserve original image alt/caption and verified content. |
| 7. Invitation `.invitation`: decoration, label/H2/copy/contact, back link | `.invitation-decoration` only if future motion is added | No timeline currently | Static clipped decorative circles; text and controls remain ordinary flow | H2 `#invitation-title`; `/contact`, back link → `#main-content`. Footer navigation follows directly; no game until Phase 07. |

## Refresh and teardown requirements (every animated chapter)

- `HomeStoryMotion` uses `useGSAP` and a `gsap.matchMedia` context. Each preference event debounces 120ms, reverts the old context (including pin spacers/styles) and constructs a new one unless reduced/spacious. Desktop/height/pointer/OS media changes cause matchMedia to revert/re-evaluate. Current selectors are **global document selectors**, not component-scoped refs.
- `SmoothScrollProvider` owns the single GSAP ticker callback → `lenis.raf(performance.now())`; Lenis scroll events call `ScrollTrigger.update`. It does not set global lag smoothing. `autoRaf:false`, `syncTouch:false`, `anchors:false`.
- Route changes cancel the previous import generation; destroy Lenis; remove ticker, Lenis scroll listener, native keyboard/click/focus/history listeners, resize observer, pending RAF/debounce and font/image/pageshow listeners. Import failure leaves native scroll working. A failed import currently leaves the enabled flag true until the policy changes; there is no immediate retry.
- Provider refreshes geometry after body resize, captured image loads, `document.fonts.ready`, `loadingdone`, preference events (100ms), `pageshow` and route changes. ScrollTrigger also observes viewport changes. Preference refresh/rebuild uses two independent debounce delays; avoid adding a third clock.
- Native key, focus, same-origin link, popstate and hashchange events interrupt Lenis inertia **without preventDefault**. Anchors use CSS `scroll-padding-top` (8rem, 7rem ≤700px). The header home link targets `/#page-start`; do not replace it with a same-route router reset.
- Geometry-only font/image changes currently **refresh** existing timelines; they do not fully rebuild them. Phase 04 requires explicit teardown/rebuild on changing geometry; audit whether refresh alone is sufficient before new sticky choreography. Preserve protection against ResizeObserver→pin-size→refresh feedback loops.
- Any future overlap must reserve reading/caption space in layout, preserve fragment visibility below the sticky header, avoid clipping focus rings, and be removed/flattened for reduced motion and unsafe short/spacious layouts.

## Selectors and layout assumptions that can break

| Hook / assumption | Risk for subsequent CSS/DOM work |
| --- | --- |
| Global `.hero-orbit`, `.recognition-photo`, `.connection-visual`, `.connection-chapters` | Renames silently remove effects; duplicates animate unrelated elements. Use scoped refs or explicit scene attributes if splitting components. |
| Pin start fixed at **140px** | Header height varies with zoom/font/spacing. Do not assume the hard-coded offset will suit new scenes; measure clearance. |
| Pin duration uses `offsetHeight` of chapters minus visual | New margins, overlap, font metrics and taller artwork can invalidate the apparent journey; clamp and compare actual section bounds. |
| Pin target is also a grid item with overflow clipping | Transforms/containment on ancestors, sticky overflow wrappers or grid changes can break pin/fixed positioning. |
| `.journey-path[pathLength="1"]`, progress span and landscape group | Removing/renaming groups/pathLength changes path drawing; do not target approved-logo pixels or meaningful text. |
| Recognition frame versus copy, 1000px breakpoint | Preserve 3:2 intrinsic space, caption in flow and positive gap; the old negative margins caused the reported overlap. |
| `data-reading-custom` and `data-spacious` on `<html>` | Fixed new light backgrounds or selectors with higher specificity can override preferences. Keep one storage/runtime policy. |
| `#page-start`, `#main-content`, `#recognition`, `#explore`, `#community` | Used by real links/history/focus. Keep unique IDs outside any animated/hidden wrapper. |

The production regression group protects chapter order, current scene hook cardinality, decorative scope, direct topic links and the toolbar position. Browser smoke tests cover geometry and interactions; screenshot review remains necessary for perceived motion and visual quality.
