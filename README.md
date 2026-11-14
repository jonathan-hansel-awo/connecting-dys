# Connecting Dys CIC

Next.js App Router + TypeScript website for Connecting Dys, a UK Community Interest Company. The original approved embracing-figures logo is preserved byte-for-byte. A background-free symbol adaptation is used in the header and hero following the owner’s 13 November feedback. The current tagline is **A home for every DYS mind.** No hosting project, deployment or Vercel configuration is created by this work.

## Current experience — Phase 06

The homepage now includes the complete support/about/invitation finish and native **full-section stacking**. A long section scrolls fully before its last screen holds behind the next opaque panel; no spacers or artificial scroll runway are added. Keyboard navigation, browser Find and programmatic focus release stacking until pointer scrolling resumes. The community keeps its separate bounded artwork pin. Touch uses native momentum; Lenis stays on fine pointers with one GSAP clock.

Reading settings contains the only **Dark mode** control. The existing `connecting-dys-reading-settings` object restores the theme, five fonts, four reading backgrounds and Paper/Linen/Plaster/Off before paint. Light colours are retained while dark counterparts are selected. Reduced motion, spacious reading, forced colours, short viewports and no-JS have readable alternatives; the approved logo files are unchanged. Phase 07's optional game is not included.

Phase 06 also replaces the oversized tab icon with a small derivative of the existing symbol and uses an SVG footer arrow across reading fonts. See [the current QA results and limits](docs/QA.md). Historical phase notes below retain their original handoff results. Browser regressions run with `npm run test:browser`; isolated cold-load lab measurements run separately with `npm run test:performance` after a production build. Do not run performance samples alongside the parallel browser suite. Both commands use local production servers and never deploy.

## Phase 01 materials

The existing homepage now uses a static fine-paper surface system with shallow raised/inset edges and consistent directional light. **Background texture** in Reading settings toggles the grain and optional depth together; it defaults to On and uses the existing preference key and pre-paint bootstrap. Saved older settings remain compatible. All four reading backgrounds govern light reading surfaces; fonts/spacing and the approved identity are preserved. Forced colours/print remove the material effects, and forced colours also selects native/static motion. Without JavaScript the page is flat and complete.

See [Phase 01 implementation and verification](docs/PHASE_01_MATERIAL_SYSTEM.md). Build/lint/typecheck and **11 production regression groups pass**. Browser rendering was blocked at the Phase 01 handoff; Phase 02 now supplies real Chromium screenshots and interaction evidence below. Physical-device/zoom quality checks remain outstanding. The material engine is in `src/styles/surfaces.css`; its original procedural SVG tile is in `public/textures/fine-paper.svg`. No new motion dependency or scroll choreography was added in Phase 01.

## Phase 02 welcome transition

The first scroll extends an embossed path, shifts decorative depth and raises Recognition’s rounded paper edge into reserved hero space. Mobile uses native scrolling and larger vertical art movement; desktop stays restrained. All reading text, controls, approved identity and the recognition caption remain in flow. Reduced motion, short screens, spacious reading, forced colours and no-JS retain complete static alternatives.

See [implementation, exact scene contract and limits](docs/PHASE_02_WELCOME_TRANSITION.md) and [actual screenshots/browser evidence](docs/baselines/phase-02/README.md). The full Chromium suite passes **54 tests with 6 intentional skips**, including rendered axe, preferences, anchors and Back/Forward across six viewports. Shared route audits run once at desktop; short screens test a static fallback. Phase 03 is now implemented below.

## Phase 03 discovery passage

The four existing topic links now share a fine embossed trail, alternating inner-art drift and a soft paper-band highlight as each row enters view. Text, hit targets and arrows stay in place; all links remain directly available. Short screens/reduced motion/spacious settings/no-JS keep complete static alternatives. The owner's requested heart and house recesses replace only hero decoration, preserving the approved identity. Texture-style selection is recorded for later; the existing On/Off setting is unchanged.

See [implementation and scene contract](docs/PHASE_03_DISCOVERY_PASSAGE.md) and [browser evidence](docs/baselines/phase-03/README.md). Phase 04 is implemented below.

## Phase 04 connection journey and texture choices

The retained three-part community story now has converging decorative nodes and paths plus a tactile trail beside each chapter. Safe portrait phones receive an artwork-only **pinned overlap / stacking reveal**: the illustration pauses while the first chapter sheet rises over it. Desktop art pinning measures the actual header and chapter geometry; text and links always stay in normal flow. Short/reduced/spacious/forced-colour/no-JS alternatives remain complete and static.

Reading settings now offers **Paper, Linen and Plaster**, with the existing Background texture On/Off switch, colour choices and saved reading preferences retained. Older saved settings migrate to Paper; Off retains your chosen style; Reset restores defaults. The same allowlisted runtime restores before paint and after hydration.

See [implementation, contracts and file list](docs/PHASE_04_CONNECTION_JOURNEY.md) and [screenshots/browser evidence](docs/baselines/phase-04/README.md). Build/lint/typecheck and 12 production regression groups pass. Full Chromium matrix: **91 passed, 11 intentional skips, zero failures/flaky tests**; actual UI 200%/400% zoom reflow also passes. Phase 05 is complete; current integration results are recorded above.

## Run locally

Use Node.js 22.18+ (or Node.js 24 LTS) and npm.

```bash
npm ci
npm run dev
```

Open the local address printed by Next.js. No environment variables or external font services are required.

```bash
npm run lint
npm run typecheck
npm run build
npm test
npm start
```

`npm test` inspects the last production build, so run `npm run build` after changes. The tests run Node.js + jsdom + axe, not a real browser. Their visual/accessibility limits are described in [docs/QA.md](docs/QA.md).

## Homepage enhancement baseline (Phase 00)

The existing homepage is unchanged in this audit phase. Read the [current baseline/results](docs/PHASE_00_BASELINE.md), [chapter scene contracts](docs/SCENE_CONTRACTS.md), [screenshots/evidence](docs/baselines/phase-00/README.md) and [phased roadmap](docs/HOMEPAGE_ENHANCEMENT_ACTION_PLAN.md) before later enhancements. Phase 01 implementation status is documented above. The baseline records a small maximum-reading/400% overflow and a forced-colours motion-policy gap for follow-up.

Reusable browser smoke checks use the already-installed Playwright/axe development dependencies:

```bash
npm run build
npx playwright install chromium
npm run test:browser
```

The runner owns a local production server on port 3100 (override with validated `PLAYWRIGHT_PORT`). It covers six viewports, chapter screenshots, rendered axe, reading preferences, anchors/menu/history, reduced motion and no-JS navigation. Reports/screenshots/traces go to ignored `test-results/` and `playwright-report/`; committed Phase 00 images are never overwritten. For an installed Chromium, optionally set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its absolute executable path. Browser launch was blocked in the Phase 00 executor. Phase 02 uses native local Chromium successfully; current results and any remaining failures are recorded in its evidence report. Live cloud Chromium zoom references are documented separately and do not replace real mobile/assistive-technology QA.

## Experience and architecture

- `src/app/page.tsx`: server-rendered editorial homepage, following welcome → recognition → discovery → connection → practical support → organisation → invitation. The voices chapter is deliberately omitted until real, permissioned stories exist.
- `src/content/site.ts`: branding, verified contact address, learning-difference introductions and editable connection copy.
- `src/components/story-art.tsx`: original inline decorative SVG landscapes and topic illustrations. These are abstract illustrations, not member portraits or alternative logos.
- `src/components/home-story-motion.tsx`: GSAP + ScrollTrigger with `useGSAP` cleanup and matchMedia. The recognition photo pans within its frame; the connection artwork pins briefly on desktop while its landscape travels laterally. Compact/touch layouts use native scroll-driven art and chapter trails; fitting portrait-phone artwork briefly pins behind the first rising chapter sheet. All reading text stays still in ordinary DOM order.
- `src/components/providers/SmoothScrollProvider.tsx`: one GSAP ticker drives Lenis. Dynamic Lenis import, no touch interpolation, native anchors/history/keyboard interruption, and complete lifecycle cleanup. No transformed scrolling container or body scroll lock.
- `src/lib/preferences.ts`: shared validated preference application; its self-contained runtime also runs before paint. Storage failures cannot block rendering. Optional font faces are fetched only when selected. Preferences apply to headings, controls and reading surfaces; branded artwork stays unchanged.
- `src/components/reading-settings.tsx`: a control below the navigation (not sticky), opening a native modal dialog with Escape, focus containment and focus return, plus a native scrollable panel.
- `src/app/[slug]/page.tsx`: calm reading routes for the four DYS subjects, about, support, getting involved, contact and accessibility. Existing organisation policy information remains linked to the original website.
- `src/app/globals.css`: central brand/reading tokens, fluid responsive layouts, enhanced large-spacing layouts, reduced-motion, print and forced-colour alternatives.

Pinned desktop choreography requires a fine pointer, at least 1100px width and 700px height. Safe portrait phones (≤699px wide, ≥650px tall, fitting artwork) also allow the short artwork-only stacking reveal; other viewports use contained, unpinned artwork movement driven by native scrolling. Both modes require no OS reduced-motion preference and no personal simplified-reading preference. Large type/line/letter spacing and OpenDyslexic select spacious compositions. Lenis is disabled on coarse pointers and in reduced-motion mode. No information relies on animation or JavaScript being available.

The pre-paint script is static, contains no untrusted interpolation and does not require `unsafe-eval`. If a Content Security Policy is introduced, authorise that script with a nonce or hash and accommodate Next.js’s own scripts; do not simply permit arbitrary inline scripts.

## Content and service boundaries

See [docs/CONTENT_SOURCES.md](docs/CONTENT_SOURCES.md). The organisation’s existing website states that full services are not yet being delivered, so future aspirations are not presented as operational services. There are no invented members, testimonials, statistics, events or partner endorsements.

Contact opens the verified published email address or points to the existing contact page. There is no simulated form submission, authentication, enrolment or community backend. Organisation policies continue to be maintained on the existing website; no new legal policy wording is fabricated. The site itself adds no analytics, tracking cookies or data-capture service. Reading preferences use local storage only.

## Assets and licences

- Original logo: `public/brand/connecting_dys_logo.png`, unchanged and displayed at a readable size in the organisation chapter.
- Header/hero symbol: `public/brand/connecting-dys-embrace.png`, a transparent adaptation of the original heart/embrace, with a navy outline for contrast on light backgrounds. Created with image editing; no new identity or tagline introduced. Both use responsive Next Image sizing.
- Illustrations: created directly in SVG for this implementation, with proportioned people and filled arms/hands.
- Recognition photo: `public/images/shared-moment.webp`, a fictional scene created with image generation for this website and compressed as WebP (1536×1024, about 217 kB before Next Image optimisation). The visible caption identifies it as AI-created and not Connecting Dys members. No remote image dependency.
- Open Sans and Nunito Sans: self-hosted Latin WOFF2 through `next/font/local`; copied from Fontsource. OFL texts are in `src/fonts/`.
- Atkinson Hyperlegible: self-hosted regular/bold Latin WOFF2, loaded on selection. OFL text in `public/fonts/`.
- OpenDyslexic: repository’s existing regular/bold WOFF2; its 2019 SIL OFL licence has been retained in `public/fonts/OpenDyslexic-LICENSE.txt`. Earlier alternate formats remain in the repository but are not requested by the site.
- System Arial and Verdana are used only where installed on the visitor’s device, with fallbacks.

## Manual deployment handoff

Deployment remains the owner’s responsibility.

1. Import the existing `connecting-dys` GitHub repository into your chosen Vercel account/project.
2. Choose the intended branch and the Next.js framework preset. Use `npm ci` and `npm run build`; leave the output directory at its Next.js default.
3. Use a supported Node version (22.18+ or 24 LTS). No environment variables are currently required.
4. After deployment, run the real-browser checks listed in [docs/QA.md](docs/QA.md), including keyboard focus, OS reduced motion, mobile/zoom reflow and ScrollTrigger transitions after font changes.
5. Confirm the published contact address and existing policy links with Marie before inviting public participation.

No Vercel project, domain, webhook or deployment has been configured by this change.
