# Phase 04 — An evolving connection story

Reference: Phase 03 `4275c6ef4ad8617e40dc36da2dbaa42f84f00a35`. Implemented 14 November 2026, including the owner's requested pinned-overlap reveal and selectable textures. Phase 05 remains next; no game or later-section choreography is added.

## Before and after

| Phase 03 | Phase 04 |
| --- | --- |
| Compact illustration drifts over its own short scroll interval | Main path draws accurately from normalized 1→0, with three decorative branch paths and raised nodes converging |
| Three static chapter rows | A continuous fine path develops beside each existing chapter; circular tactile markers settle into the trail and a quiet tint passes behind the copy |
| Compact artwork always scrolls away | On safe portrait phones the artwork pauses while the first opaque chapter sheet rises over it — a **pinned overlap / stacking reveal** |
| Desktop art pins using a fixed 140px offset | Pin clearance measures the actual header; the end is the bottom of the real chapter group minus the actual illustration height |
| Paper or Off | **Paper, Linen or Plaster**, plus the existing Off switch; colour and reading choices remain independent |

The original three figures, proportioned limbs/hands, plant, table, artwork colours and all chapter text are retained. Added geometry is decorative, not member imagery. The real status note still says that the CIC is building its community and that full services are not yet delivered. Logo, tagline, routes and later chapters retain their approved content and behaviour.

## Scene contract

Only the `aria-hidden` `.connection-visual` may pin. No paragraph, heading, section, link or focusable control is pinned or transformed. `pinSpacing:false` keeps the original document distance: no blank scroll runway, duplicate text or synthetic steps. Chapters stay above the illustration in an isolated stacking context, so the new sheet covers decoration, never reading content. Reversing the scroll reverses the reveal.

| Mode | Bounds and behaviour |
| --- | --- |
| Desktop: ≥1100×700, fine pointer | Art start: its top reaches actual header height +16px. End: real chapters' bottom reaches that inset + actual art height. Pin only if the illustration fits below the header with 48px spare and the chapters are taller than it. |
| Portrait overlap: width ≤699px, height ≥650px | Art start: top reaches header +16px. End: first real chapter's top reaches the same inset. The first chapter scrolls in front. Requires the same art-fit guard. |
| Other viewports, height ≥520px | Native unpinned tableau and the same three evolving chapter trails. |
| Short, reduced motion, spacious, forced colours or no JavaScript | Complete static scene and ordinary-flow chapters. Spacious/forced-colour/print modes omit optional chapter rails. |

The main tableau's desktop timeline traverses the real chapters (`top 75%`→`bottom 65%`, .35s scrub). Compact timeline runs from visual `top 85%` to first chapter `top 25%` with direct scrub. Landscape drift is +30→−30 SVG units desktop / +16→−16 compact. The amber journey path uses `pathLength=1`, `strokeDasharray="1 1"`, no rounding, and offset 1→0. The progress strip grows 0→1.

Each chapter trail follows its actual article from `top 85%` to `bottom 40%`, .25s desktop/direct compact scrub. Path offset is 1→0; a circular HTML node moves ±12→0px and scales .65→1. The background tint rises to .7 opacity then recedes. The text, target geometry and chapter dimensions never animate. SVG paths alone stretch to chapter height; nodes keep their circular aspect ratio.

On desktop each real chapter also drives its corresponding tableau node/branch. On compact screens those tableau details converge during its initial reveal, then the visible chapter rail carries progression after the illustration is covered. This keeps the story visible without a persistent mobile overlay over the prose.

All new effects use the existing GSAP matchMedia context; there is no added animation clock, touch interpolation, wheel interception, snap or motion library. The entire context reverts and rebuilds after preferences, font completion, captured load events, pageshow, actual art/chapter/header size changes and viewport/orientation changes. Observed geometry is compared before scheduling the existing 120ms debounce, avoiding a pin/resize feedback loop. All listeners/observers and pending timers are cleaned up.

## Texture preferences

`texture:boolean` and the existing storage key retain their meaning. New `textureStyle` accepts only `paper`, `linen`, `plaster`; missing/unknown/hostile values migrate to `paper`. The identical validated runtime applies both before paint and after hydration. Turning texture Off flattens the existing material system and retains the selected style for later. Reset returns to Paper/On. The native select is disabled while Off; a small real surface preview reflects the current colour/style.

Linen and Plaster are original local seamless 192px SVG tiles: a fine woven repeat and a static matte mineral noise tile. No new runtime library, remote image, bitmap, tracking or font is introduced. Surfaces, modal, buttons, chapter sheets and hero heart/house interiors share the selected material; logos/photos are not filtered. The texture is static; colours still follow all four reading backgrounds. Forced colours and print remove grain/relief regardless of selected style; no-JS is flat.

The conservative numeric contrast bound covers all three tiles: Paper ≤.08 alpha, Linen .06 white / ≤.055 dark, Plaster ≤.042. These checks supplement rendered axe; they are not accessibility certification or proof of screen-reader usability.

## Verification and evidence

Production build, lint, TypeScript, diff hygiene and **12 production regression groups pass**. Tests include both approved asset hashes, main chapter semantics, four direct topic routes, old preference migration, new style allowlisting and storage failures. The full browser run is **91 passed, 11 intentional skips, zero failures or flaky tests** across six viewports. Results and screenshots are recorded in [Phase 04 evidence](baselines/phase-04/README.md).

[Source/HTTP audit](baselines/phase-04/source-http-audit.json) compares the built Phase 03 reference with Phase 04: all ten routes return 200, meaningful main text/links/image semantics match, and both logo hashes are identical. Built static assets increase by **757 gzip bytes JavaScript and 428 gzip bytes CSS**. Those are sums over built chunks, excluding new server SVG markup and separately loaded texture tiles; not page transfer or Core Web Vitals measurements.

Actual Chromium UI 200% and 400% zoom was checked with Linen and zero document overflow; at 400% the dialog also has zero overflow. Maximum OpenDyslexic size/spacing with Plaster at 400% retains zero page/dialog overflow and no pins. See [measurements](baselines/phase-04/browser-zoom.json). Physical Android/iOS momentum, VoiceOver/screen-reader review, high-DPI texture inspection and measured Core Web Vitals remain release checks. Automated viewports/media are not physical-device testing. No Vercel configuration, deployment or build monitoring is performed.

## Changed files

- `src/lib/connection-motion.ts`, `src/components/home-story-motion.tsx`: measured scene, portrait overlap, chapter progression and lifecycle cleanup.
- `src/components/connection-trail.tsx`, `story-art.tsx`, `src/styles/connection.css`, `src/app/page.tsx`, `layout.tsx`: decorative paths, nodes, stacking order and server-rendered chapter rails.
- `src/lib/preferences.ts`, `src/components/reading-settings.tsx`, `hero-recess.tsx`, `src/styles/surfaces.css`, `hero-transition.css`, `public/textures/{linen,plaster}.svg`: validated texture selection and shared surfaces.
- `tests/browser/connection.spec.ts`, `tests/production.test.ts`: measured progression/overlap, stationary text, navigation, preferences and lifecycle checks.
- README, roadmap, scene contracts, QA and `docs/baselines/phase-04/`: scope, measured evidence and release limits.
