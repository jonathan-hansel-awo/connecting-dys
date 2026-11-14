# Phase 02 — Welcome → Recognition

Implemented 14 November 2026 against Phase 01 commit `de8e075276ac01990735a897c26eccb7a030f31b`. Phase 03 is not included. The owner's instruction to proceed accepts the Phase 01 visual direction; it does not replace the remaining real-device release checks.

## Before and after

Phase 01 supplied static paper, shallow relief and panel edges. Phase 02 adds a separate embossed connecting path with raised coloured nodes and a recessed decorative plane behind the unchanged hero identity. On native phone scroll, the path extends, the plane drifts upward and Recognition's rounded paper edge rises into reserved hero space. Desktop uses smaller vertical offsets and a slight lateral drift. Only the painted edge overlaps: hero copy, links, approved logo, recognition frame, caption and reading copy are not transformed by this transition.

The recognition photograph, its disclosure, 3:2 clipping frame and positive copy gap remain intact. No extra pin, scroll interception, arbitrary storytelling runway, replacement artwork, dependencies or content is introduced. Hero bottom padding reserves the sheet's maximum reach plus clearance. The real `#recognition` section remains the native anchor.

## Exact scene contract

| Element | Compact / native touch | Desktop tier (≥1100×700, fine pointer) |
| --- | --- | --- |
| Path `welcome-path` | Hero `top top` → `bottom top`, scrub `true`, normalized dash offset .92→0 | Same bounds, scrub .35s |
| Decorative inset plane | y 0→−34px | x 0→14px, y 0→−12px |
| Path nodes | y 0→−18px | y 0→−6px |
| Painted lip `welcome-recognition` | Recognition `top 96%` → `top 36%`, y .75→−.25 × overlap, scrub `true` | y .3→−.1 × overlap, scrub .3s |

Overlap is `clamp(2rem, 7vw, 5rem)`, resolved from the sheet's layout `offsetTop` on refresh. All new motion additionally requires height ≥520px. Normalized path values disable GSAP pixel rounding so the stroke progresses continuously. Existing orbit, photo and community choreography is unchanged.

OS/site reduced motion gives a full path and a settled static lip. Spacious reading removes the new art and lip, sets overlap to zero and restores a plain rounded section boundary. Short landscape screens keep a complete static new scene. Forced colours/print suppress the new decorative layers; no-JavaScript keeps full paths, a static boundary and usable content. Texture-off removes relief through Phase 01's shared tokens. Font, background and spacing use the existing preference store and pre-paint policy.

Preference rebuilds and matchMedia reversion own both new timelines, including inline-style cleanup. The existing provider refreshes geometry for fonts/images, resize, routes and preferences; no additional animation clock or Lenis instance is added.

## Compatibility defects found by the browser run

Selecting an alternate background previously used a higher-specificity `background` shorthand that cleared Phase 01 grain on coloured reading sections. Changing only `background-color` preserves the chosen colour and texture setting together.

Native fragment links also created null-state history entries that this Next.js version ignored on Back after a topic visit: the URL returned to `#recognition` while the topic stayed visible. The provider now registers null-state fragment URLs through the documented `history.replaceState` integration on `hashchange` (and initial effect), while the matching route is active. This replaces the existing entry, adds no history entry and leaves native scrolling/focus intact. One cleaned-up listener runs independently of Lenis, including touch/reduced-motion mode; no private Next.js state fields are copied. The regression test covers Back → Forward → Back and return to page start.

At 320px with maximum OpenDyslexic settings, the recognition link’s long word and arrow overflowed by 10px. A spacious-only maximum inline size and word-wrapping rule keep that link in its column without shrinking the chosen type or hiding overflow. The focused fallback test now also checks page overflow.

The smoke harness now recognises static SVG identity matrices, addresses accessible headings while Next retains hidden route DOM, honours its configured base URL in no-JS contexts, and excludes generated browser reports from ESLint. These corrections retain the checks for static geometry, actual visible navigation and material coverage.

## Verification and evidence

- Production build, lint, TypeScript and all **11 production regression groups pass**.
- Full real Chromium suite: **54 passed, 6 intentionally skipped, 0 failures, 0 flaky**. Five skips avoid repeating the shared ten-route axe audit outside desktop; one skips new animation on short landscape screens, whose static fallback is tested. [Actual final output](baselines/phase-02/full-browser-results.txt) and [case-level results](baselines/phase-02/browser-results.json).
- Focused real Chromium browser checks: **17 passed, 1 intentionally skipped** across 360×800, 430×932, 768×1024, 1440×900, 844×390 and 320×800. The skipped short-screen animation assertion is replaced by an explicit static-fallback check.
- Measured checks require path progression >.25, painted edge rise >12px, all sampled copy/control/caption document positions stable within 1px, no horizontal overflow, native anchor clearance below the header, and a positive recognition artwork-to-copy gap at maximum reading settings.
- All five fonts × four backgrounds, site/OS reduced motion, spacious 26px/2×/.12em typography, texture off, forced colours and no-JS navigation are exercised.
- [Source/HTTP audit](baselines/phase-02/source-http-audit.json): ten routes return 200; all main text, links and image sources/alt text equal Phase 01. Both approved logo asset hashes are unchanged.
- Built static asset totals, compressed delta: **+307 bytes JavaScript, +366 bytes CSS**. No new font, bitmap or dependency. These are build asset sizes, not a Core Web Vitals or runtime frame-rate measurement.
- [Screenshots and actual browser output](baselines/phase-02/README.md) record the result. The final full suite includes chapter overflow/screenshots/console checks at all six viewports and a rendered WCAG-tagged axe audit of all ten public routes with no detected violations.

Real Android Chrome/iOS Safari touch feel, physical high-DPI inspection, screen readers, browser UI 200%/400% zoom and measured Core Web Vitals remain release-gate checks. Emulated 320px reflow is covered; it is not presented as those physical-device checks or WCAG certification. No Vercel deployment, configuration or build-status monitoring is performed.

## Changed implementation files

`src/components/hero-transition-art.tsx`, `src/components/home-story-motion.tsx`, `src/styles/hero-transition.css`, `src/app/page.tsx`, `src/app/layout.tsx`, the native fragment compatibility handling in `SmoothScrollProvider.tsx`, the background-colour correction in `globals.css`; focused browser/production tests; browser port configuration; reusable source-audit output/reference handling; this report, scene contracts, roadmap and QA evidence. Existing content/assets/preferences remain the authority.
