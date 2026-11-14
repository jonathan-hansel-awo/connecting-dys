# Phase 01 — Preference-safe material system

> Follow-up: the owner approved proceeding to Phase 02. [Phase 02](PHASE_02_WELCOME_TRANSITION.md) now records actual Chromium screenshots/browser results and corrects texture removal when selecting an alternate reading background. The original handoff limitations below are historical; physical-device release checks remain outstanding.

Implemented against `master` at `790264146141fd9b14cbe0246475c773b704418c`, 14 November 2026. **Code implementation is complete; rendered visual acceptance remains pending because browser access failed.** Phase 02 has not started. No deployment or Vercel status check is part of this work.

## Direction and scope

The owner's approved `1000240630.png` was inspected directly as the primary material reference. Its useful cues are fine continuous paper grain, upper-left light, shallow emboss/deboss, recessed circular shapes, lifted edges and quietly dimensional frames. Its generated emblem, compressed copy and replacement composition are not adopted.

The seven existing chapters, typography, text, navigation, photographs, SVG community illustration and both approved logo assets remain in place. Chapter columns, content padding, order, anchor IDs and scroll distances are unchanged. Surface classes attach to those real existing elements. The connection's light reading background now follows the chosen paper colour even for the default Cream preset; teal remains in its decorative artwork window. The other reading-background overrides remain effective.

**Phase 01 is static:** rounded chapter edges and an interior highlight suggest layered sheets, without moving or overlapping the reading content. Scroll-driven sheet overlap and new hero/discovery/community choreography remain Phases 02–04. No new animation, client dependency, font or photo has been added.

## Surface engine

`src/styles/surfaces.css` is imported after global layout styles by the root layout. It defines one set of tokens for paper colour, grain tile/scale, highlight, shadow, raised/inset planes, button/frame composition, path relief and rounded panel edges.

| Surface | Existing placement / behaviour |
| --- | --- |
| `surface-paper` | Body, header, hero and invitation; selected reading background plus grain |
| `surface-soft` | Connection reading chapter; all four selected backgrounds take priority |
| `surface-scene` | Recognition, about, footer and decorative connection window; the same neutral grain adapts to their current colour |
| `surface-quiet` | Discovery/support; calm continuous paper without new cards or pinning |
| `surface-raised` | Existing hero note; shared relief also applied to existing buttons, settings trigger, icon button and round topic arrows |
| `surface-inset` | Existing recognition image frame, connection artwork window and topic illustrations |
| `surface-panel` | Rounded top edges and an interior lip on recognition, connection and about; no negative margins or extra scroll height |

The existing orbit/nodes and invitation circles receive a restrained pressed-path treatment. Two small, contained recessed discs sit **behind** the hero composition, not over the approved symbol. Spacious mode removes those discs. The existing decorative community path receives a small static highlight/shadow filter; no image or meaningful text is filtered. The full approved logo is never redrawn, recoloured, embossed or morphed.

Grain is a **background image on real surfaces**, not a fixed overlay. It cannot sit over text, focus indicators, selection, photographs or logos, and never intercepts input. The image frame's inset edge is a non-interactive pseudo-element; its original 3:2 intrinsic space, caption flow and positive copy gap remain unchanged.

Lighting is consistently upper-left highlight / lower-right shadow. All new shadows/filters/sheens come from central tokens. Texture Off resets those tokens to `none`, while retaining the existing solid backgrounds, button borders, focus indicators, text and controls. Composite shadow values have their own tokens so Off does not generate invalid `none, none` shadow lists.

## Texture origin and cost

`public/textures/fine-paper.svg` is original procedural code authored for this project. A seeded `feTurbulence` tile with `stitchTiles="stitch"` produces neutral matte fibres at 192×192 CSS pixels. There is no external artwork, embedded photograph, remote reference, font, script or third-party licence dependency. The static image has no animation or changing seed. SVG resolution is independent of a fixed-resolution photographic texture; actual high-DPI/zoom appearance still requires visual review.

The SVG has a bounded 0.08 output opacity. Button sheen adds at most 0.04 white. A conservative numeric check tests the approved text combinations against fully black/white grain at those bounds, stronger than the actual fine fibres; the tested combinations remain at least 4.5:1. This is not a full rendered contrast audit, and borders/focus/real image combinations still need browser review.

Measured build/source counts are in [source-http-audit.json](baselines/phase-01/source-http-audit.json). Across all static chunks, JavaScript adds **211 gzip bytes**, CSS adds **862 gzip bytes** versus the rebuilt Phase 00 reference. The tile is under 1kB raw. Those are asset-size measurements, not a Lighthouse score, measured page transfer, LCP, CLS or INP. There is no continuous JS texture work, new frame loop, full-screen blur or new motion library. The SVG filter is confined to the small repeating background image, with an additional small drop-shadow on the existing decorative path.

## Reading preference contract

`src/lib/preferences.ts` extends the existing `connecting-dys-reading-settings` object with **`texture: boolean`**, default `true`. It does not create another storage key or settings system.

- A missing field in an older object defaults to On; valid `false` opts out. Invalid strings/numbers/null default safely to On. Other validated font/size/spacing/background/motion fields are preserved.
- The same self-contained runtime is used before first paint and for live preference updates. It writes `data-texture="on"` or `"off"` on `<html>`. Malformed/denied storage now feeds defaults to that runtime instead of skipping it.
- The dialog adds a native **Background texture** checkbox with an accessible description and visible On/Off text. Native checked state communicates the setting to assistive technology; the redundant visual On/Off label is hidden from the accessible name.
- Reset restores texture On and the previous default reading choices. The existing cross-tab storage listener uses the same restore path. Live updates still use the existing preference event and existing guarded storage write.
- All five font choices and size/line/letter-spacing rules stay in charge of text. Material rules add no text shadow or heading font override. Defensive `min-inline-size`/word reflow is added only in spacious mode.
- With JavaScript blocked there is no `data-texture="on"`; the CSS default is a complete **flat, static** page. A saved local preference cannot be read without JS; the safe no-JS fallback is flat regardless of previous choice.
- OS and personal reduced motion keep the existing static-scene/native-scroll policies. Grain itself is static. In forced colours and print, all new grain/relief is suppressed without changing the stored preference.
- Forced colours now also disables Lenis interpolation and the homepage GSAP context. The provider removes its new media listener on unmount; GSAP matchMedia reverts its scene when the media condition changes. No normal-mode timeline distances/targets are changed.

## Executed verification

| Check | Result / actual scope |
| --- | --- |
| `npm ci` | PASS, clean lockfile install (588 packages); no dependency or lockfile changes |
| `npm run lint` | PASS, including new CSS-adjacent components, audit script and test tooling |
| `npm run typecheck` | PASS |
| `npm run build` | PASS; existing public routes generated |
| `npm test` | PASS: **11/11** production groups, including 120 legacy/valid/invalid texture × font × background pre-paint cases, guarded storage, decorative scene contracts, assets and conservative material contrast |
| Original approved logo and symbol | Both SHA-256 hashes match Phase 00; no brand file changes |
| Source/HTTP parity | Ten public routes return 200; each main's meaningful text, all links and image alt/src pairs match a fresh build of Phase 00. Texture returns HTTP 200 with `image/svg+xml`. |
| Semantic/structural axe | Existing jsdom checks pass on all ten routes. These do not render CSS and do not prove browser contrast/reflow. |
| Playwright discovery | 42 project/scenario entries across the six existing viewport projects. Discovery/typechecking is not a browser execution pass. |
| `git diff --check` | PASS |

The reference build initially rejected a node_modules symlink outside its Turbopack root. A local copy of the already-installed dependencies was used instead; the unchanged reference then built successfully. No production Next.js configuration was altered for that comparison.

React review: content remains in server components; no new client surface component or rendering loop; existing settings state/storage/bootstrap is reused; native checkbox labelling is explicit; new media listener cleanup is paired; GSAP still has one frame clock. No Vercel service/tool was used for this review.

## Browser blockers and acceptance still outstanding

The attempted `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser -- --project=desktop --grep 'texture toggles'` reached its local production server but failed **before the test body**: Chromium's process singleton could not create an AF_UNIX socket (`Operation not permitted`). The added browser scenarios are not represented as passed.

A separate cloud-browser attempt could not reach the executor's local preview (`ERR_CONNECTION_REFUSED`). A local native-terminal preview could start using the installed Node binary, but acquiring the existing error tab was rejected by the browser URL policy for its `chrome-error:` protocol. That blocked action was not bypassed; the temporary preview was stopped. **No Phase 01 rendered homepage screenshot was obtained, and the existing live Vercel site was not used to stand in for the new build.**

Outstanding acceptance checks:

- Visual comparison with the approved mock-up: grain visibility/seams, dark/light/tinted material balance, consistent lighting, recessed/raised frames and legibility at standard/high DPI.
- Real phone portrait/landscape, tablet/desktop, 320px and 200%/400% zoom; all font/background/spacing and texture On/Off combinations.
- Live toggle/reload/Reset, cross-tab synchronisation, blocked JS/fonts/storage, and forced-colours/reduced-motion changes in a browser.
- Full rendered axe/contrast, keyboard/focus/history/anchor interaction and performance metrics.
- Reproduce Phase 00's 6px maximum-reading overflow. Defensive styles are included, but it is **not claimed fixed** without layout verification.

The existing smoke suite now adds material-specific texture On/Off checks across all five fonts/four backgrounds, persistence/Reset, forced-colours teardown and flat no-JS fallback. Run it in a browser-capable environment before accepting Phase 01's visual gate:

```bash
npm ci
npm run build
npm test
npx playwright install chromium
npm run test:browser
```

No subsequent phase is started. In particular, **screenshots have not been accepted**, and Phase 02 remains for the owner's next instruction after review.

## Changed files and delivery

- `src/styles/surfaces.css`, `public/textures/fine-paper.svg`: tokens/materials and original micrograin.
- `src/lib/preferences.ts`, `src/components/reading-settings.tsx`: validated persistent texture choice and pre-paint application.
- `src/app/layout.tsx`, `src/app/page.tsx`, header/footer: attach the engine to the existing experience.
- Home motion and smooth-scroll provider: forced-colours opt-out/cleanup only.
- Production/browser tests, `scripts/audit-materials.mjs`: regression and source/HTTP evidence.
- README, QA, scene contract addendum and roadmap: scope, operation and honest verification status.

The commit updates the existing repository. No Vercel CLI/API/configuration, deployment or build-status monitoring is performed. The owner's existing automatic GitHub integration may react to a push; that integration is neither changed nor monitored here.
