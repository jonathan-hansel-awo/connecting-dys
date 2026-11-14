# Connecting Dys — Homepage Experience Enhancement Action Plan

**Version:** 1.0 — 14 November 2026  
**Status:** Phase 00 audit completed. Phase 01 material implementation delivered 14 November 2026; [visual/browser acceptance remains pending](PHASE_01_MATERIAL_SYSTEM.md). Phases 02–07 not implemented.
**Repository:** [`jonathan-hansel-awo/connecting-dys`](https://github.com/jonathan-hansel-awo/connecting-dys) (current default branch: `master`)  
**Current site:** https://connecting-dys.vercel.app/  
**Primary focus:** mobile-first scroll choreography, an original tactile visual system, and compatibility with the existing reading settings  
**Deployment:** **Do not deploy or configure Vercel.** The owner controls deployment. Note that pushing to an already-connected branch might trigger the owner's existing automatic GitHub–Vercel integration; never claim deployment is manual if it occurs automatically.

> **This is an enhancement roadmap, not a site rebuild or rebrand.** Preserve the existing homepage's layout/content foundations, routes, navigation and identity. Work **one phase per Work-mode chat**; do not jump ahead. **The mini-game is deliberately the final phase** and must not hold up a presentation-ready homepage.

---

## 0. Decisions that must not drift

### Identity and content

- **Keep Marie's approved original embracing-figures logo unchanged.** The current implementation references `/brand/connecting_dys_logo.png` for the full logo and `/brand/connecting-dys-embrace.png` for the existing symbol adaptation. Do not replace either with a generated mock-up emblem. The logo itself is not a GSAP morph target.
- Keep the exact site tagline: **“A home for every DYS mind.”** The existing homepage hero and other approved copy are the starting point; don't swap the hero's content with the image mock-up copy just because the image looks good.
- Retain brand colours: **navy `#20354D`, cream `#FCF7ED`, teal `#146C78`, amber `#EAB85C`, coral `#D98677`**. Do not introduce lavender or Relevo's kraft-brown palette as new brand defaults.
- Default body font **Open Sans**; headings **Nunito Sans**. Existing optional reading fonts remain available: Arial, Verdana, Atkinson Hyperlegible and OpenDyslexic.
- Connecting Dys is a **UK Community Interest Company (CIC), not a registered charity**. Existing verified copy makes clear that the community is still developing; do not invent delivered services, member photos/testimonials, events, statistics or outcomes.
- Use the Relevo & Vinco reference for **materiality** (soft grain, emboss/deboss, layers) and Ines Cherif for **scene progression**; do not copy their letterforms, layouts, art or choreography.
- Existing navigation/menu stays in the header; the **Reading settings toolbar remains beneath the header** as presently implemented. Don't silently hide those controls inside the menu.

### Technical and accessibility non-negotiables

- Stack: **Next.js App Router + TypeScript + Lenis + GSAP + ScrollTrigger** (already present); use CSS for simple effects. Avoid new motion libraries without need.
- Preserve ordinary document flow, semantic sections, functional links, native scrolling, anchor navigation and browser Back/Forward. No forced wheel hijacking, mandatory swipe, snap trap, hidden text pending an animation or animated reading text.
- **Mobile should feel deliberately animated**: use GSAP/ScrollTrigger to drive the scene changes, not merely Lenis. The current provider enables Lenis only for `(pointer: fine)`, so standard touch phones use native momentum scrolling; this is an intentional accessibility/performance choice, not necessarily a fault.
- Target **WCAG 2.2 AA**, with manual tests in addition to automation. Obey the OS `prefers-reduced-motion`, the site's **Reduce decorative motion** setting, spacious typography, forced-colours and user reading background preferences.
- All meaningful content and all calls to action must remain usable **without GSAP, Lenis or JavaScript**. Do not confuse aesthetic scroll engagement with a functional dependency.

---

## 1. Snapshot of the actual homepage (baseline)

Existing sections and source hooks, in current order:

| Existing chapter | Current selectors / files | Keep, enhance or add? |
|---|---|---|
| **Welcome / Hero** | `.hero`, `.hero-composition`, `.hero-orbit`, `src/app/page.tsx` | Keep; enhance artistic depth and scroll transition |
| **Recognition** | `#recognition`, `.recognition-media`, `.recognition-photo` | Keep current human-image section and accessible caption; add panel transition |
| **Discovery: four DYS experiences** | `#explore`, `.difference-list`, `.difference-row` | Keep all four real links/descriptions; introduce carefully constrained sequential/lateral choreography |
| **Connection / Community** | `#community`, `.connection-visual`, `.connection-chapters`, `.journey-path` | Keep the three existing chapters; make this the signature evolving-story moment |
| **Support / Next steps** | `.support`, `.support-links` | Keep practical, calm and obviously actionable |
| **About / Meet Connecting Dys** | `.about-home`, `.approved-logo` | Keep verified CIC and Marie references; restrained material reveal |
| **Invitation** | `.invitation` | Keep the current closing CTA; make its arrival memorable |
| **Optional game** | *Not yet present* | **New, only in final phase**, near the end/before footer |

Key implementation files: `src/components/home-story-motion.tsx`, `src/components/providers/SmoothScrollProvider.tsx`, `src/lib/preferences.ts`, `src/components/reading-settings.tsx`, `src/components/site-header.tsx`, `src/app/globals.css`, `src/components/story-art.tsx`, `src/app/page.tsx`, `tests/production.test.ts`, `docs/QA.md`.

**Already known:** compact/touch GSAP animations exist but are subtle (small hero offset, slight image pan, artwork shift and path draw), while the art pin is desktop-only. Reading settings already cover five fonts, 16–26px text, line/letter spacing, four backgrounds and reduced motion. Large-reading preference currently triggers `data-spacious="true"` and disables the complex animation context. Preserve these strengths.

---

## 2. Target sensory and motion language

**Concept:** *A home you can almost touch — a journey in which different paths find connection.*

### Continuous tactile background — YES, across the entire experience

- Use **fine, matte, paper-like micrograin** on the whole homepage, including different brand-coloured sections. Texture must not disappear arbitrarily between scenes; instead, its **tone/opacity adapts** to each surface.
- Use a high-quality tiny tileable texture or lightweight CSS/SVG noise that is **static**, subtle, non-animated and performant. Avoid large photographic background files, repeating seams, shimmering noise or interference with small text.
- Create a **surface system**: `surface-paper` (default reading area), `surface-soft` (tinted reading area), `surface-raised` (subtle shadow), `surface-inset` (recessed photo/decorative window), `surface-scene` (immersive chapter) and `surface-quiet` (minimal reading). Use shared design tokens, not arbitrary shadows in each section.
- **Neumorphism is selective.** Raised nodes, handles, buttons, decorative motifs and recessed frames are welcome; essential text should generally remain flat and crisp. Contrast cannot rely on shadow alone.
- Decorative **embossed connecting curves** recur across hero, recognition, community and finale, making a consistent Connecting Dys language; the paper texture is not borrowed packaging branding.
- Use **one consistent lighting direction** for highlights and shadows. The brand colours and real artwork—not the texture—define the identity.

### Motion vocabulary

| Pattern | Purpose | Typical mobile interpretation |
|---|---|---|
| **Paper-sheet overlap** | Chapter change feels spatial rather than a vertical cut | Incoming rounded panel gently covers previous artwork; no text collisions |
| **Recessed-to-raised** | Photo or motif becomes prominent | Decorative frame/image depth changes minimally, image never obscures copy |
| **Connecting-path draw** | Narrative link from difference to community | SVG path progresses with native scroll; static completed path in reduced mode |
| **Lateral drift** | Brief shift of perspective | Decorative layers move sideways; core content remains reachable in normal DOM order |
| **Short sticky tableau** | A memorable controlled scene | If tested robustly, only artwork sticks for a short passage; no sticky reading paragraphs or trapped navigation |
| **Quiet breathing room** | Reading and choosing an action | No pinning; simple CSS focus/hover, restrained entrances, generous spacing |

**Rule:** three signature moments carry most of the creative energy — **Hero→Recognition**, **Discovery→Connection**, and **Connection's evolving shared landscape**. The rest supports them; don't animate every paragraph.

---

## 3. Reading settings compatibility contract (applies to *every* phase)

The current settings UI is **real functionality**, not a decorative option. Every new style and GSAP timeline must consume the same settings state.

| Preference | Required behaviour after enhancement |
|---|---|
| **Font: Open Sans / Arial / Verdana / Atkinson / OpenDyslexic** | All real text uses the chosen font as appropriate; logos remain images; decorative SVG outlines never substitute for meaningful textual content |
| **Font size, line height, letter spacing** | Reflow without overlap/clipping; recalculate ScrollTrigger geometry after changes; when `data-spacious="true"`, use simpler no-pin/no-lateral layouts |
| **Cream / White / Soft blue / Soft peach background** | User selection changes **all primary reading surfaces** and their associated texture tint/contrast. A branded scene may retain an intentional darker decorative backdrop only if reading panels remain compliant and settings are respected. No opaque fixed background overlay should silently defeat this choice |
| **Texture setting (NEW)** | Add an accessible **“Background texture” On/Off** preference, default **On (subtle)**, persisted with existing reading settings. Off removes grain and optional tactile background relief while retaining clear component boundaries, plain colours and usable controls |
| **Reduce decorative motion** | Immediately disable/teardown Lenis interpolation, scroll scrubs, parallax, lateral/pinned scenes and optional animation; render the full, readable normal-flow layout |
| **OS reduced motion / forced colours** | Respect before first paint. Force a static legible layout with textures/decorative shadow layers suppressed as needed; no flicker during hydration |
| **Reset** | Restore the previous defaults plus subtle texture enabled; preserve safe compatibility for users whose localStorage predates the new field |

**Do not introduce a separate incompatible preference storage system.** Extend `src/lib/preferences.ts` (existing `connecting-dys-reading-settings` key), ensure values are validated/clamped, update the first-paint preference bootstrap and dialog controls, then add regression tests. Optional new "Texture" preference must not change the logo, semantics, button borders, focus indicators or meaning.

**Preferred implementation:** new semantic CSS variables/data attributes on `<html>` (e.g., `--surface-grain-opacity`, `data-texture`). Use CSS to give the user's selected background priority on light reading surfaces; keep section-specific artistic colours as accents. If the selected background requires changing image borders, shadow contrast or text colour, ensure those variations pass WCAG contrast checks. Confirm texture-off persists after reload and works even when JS is initially blocked (a plain static fallback is fine).

**QA test matrix for EVERY phase:** phone portrait, phone landscape, tablet, desktop; all five fonts; each of four backgrounds; default and maximum spacing; texture on/off; motion on/off; 320px CSS width and 200%/400% zoom; keyboard/focus/anchors; no-JS/native scroll fallback; OS reduced motion. Use representative combinations during development and run full matrix before final handoff.

---

## 4. Phased implementation sequence

> **Execution rule:** One phase per chat/PR or clearly bounded commit. Start the next phase only after reporting the previous phase's changes, tests, unresolved issues and commit SHA. Preserve a presentable site after **every** phase. The game is last and optional.

### PHASE 00 — Audit, baselines and scene contracts

**Goal:** Establish a trustworthy reference for visual and functional regression before changing anything.

Actions:

- [x] Read all project source Markdown, current `AGENTS.md`, `docs/FOUNDATION_AUDIT.md`, `docs/QA.md`, actual homepage source and latest Git history.
- [x] Capture screenshot/recording baselines of current hero→footer at **mobile narrow (~360px), mobile wide (~430px), tablet and desktop**, plus reading settings dialog. Where screenshot tooling is available, inspect mobile scrolling and browser console; state honestly if unavailable.
- [x] Verify current routes, content, approved logo bytes, tagline, external links, font choices, sticky header and separate Reading settings toolbar.
- [x] Audit GSAP matchMedia conditions, ScrollTrigger events, Lenis scope/cleanup and existing mobile image overflow fix. Flag scene selectors that may break from future CSS changes.
- [x] Write a **scene contract** for each chapter: DOM order, animated decorative targets, scroll start/end, mobile/desktop fallback, no-motion state, focus targets and refresh requirements.
- [x] Confirm current baseline commands and results: `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.
- [x] Add reusable viewport/accessibility smoke-test tooling where practical, without adopting a wholesale new testing stack.

**Exit criteria:** Baseline captured; exact changes for subsequent phases documented; all existing routes accessible; test output recorded. **No visual redesign yet.**

### PHASE 01 — Preference-safe surface engine and continuous texture

**Goal:** Deliver the tactile foundation independently of scroll animations, so the site is already improved after this phase.

Actions:

- [x] Define CSS design tokens for continuous background grain, material colour, shadow/highlight, raised/inset planes and rounded panel edges.
- [x] Implement a **continuous fine paper texture** across the actual existing homepage; adapt it to cream, teal/dark and softly tinted surfaces. Keep the effect deliberately more subtle than the original Relevo reference.
- [x] Give selected decorative elements gentle emboss/deboss; avoid thick carved headline letters, dark extrusions and shadows behind long copy.
- [x] Apply raised/recessed visual treatment to selected surfaces/buttons/photo frames while preserving visible borders, clear focus states and hover/touch affordances.
- [x] Integrate **Background texture On/Off** into the current Reading settings dialog and persistent early bootstrap; handle existing saved preference objects without breaking them.
- [x] Ensure **all four reading-background options** apply coherently across the newly textured/coloured light reading surfaces. Confirm typography preferences still govern headings and section copy.
- [ ] Verify texture remains crisp but quiet at standard density, large type, maximum zoom, high-DPI screens; disable in forced-colours mode. **Forced-colours suppression is implemented; rendered verification is blocked. See Phase 01 report.**
- [x] Document performance impact and texture asset licensing/origin if an asset is added.

**Implementation status:** Static materials, preference schema/bootstrap/UI and regression checks are implemented. Screenshots and browser visual acceptance remain pending; do not treat that gate as passed.

**Exit criteria:** Same layout and brand, but continuous tactile ambience is visible; all reading options still work, including the new texture toggle. No new animation dependencies. Screenshots accepted before moving on.

### PHASE 02 — Welcome / Hero → Recognition: first signature transition

**Goal:** Make the **first mobile screen and its transition** immediately feel alive, without replacing current content/logo.

Actions:

- [ ] Preserve exact current hero heading, copy, CTAs, approved symbol and wordmark/tagline.
- [ ] Give hero decorative curves, path nodes and non-text surfaces subtle depth; visually separate the moving layers from stationary, readable text and tap targets.
- [ ] Add mobile ScrollTrigger choreography that **visibly** changes the composition as scrolling begins: an embossed path extends, decorative layers shift in depth, and the next panel rises to overlap the hero.
- [ ] Use a restrained desktop variation with optional parallax/lateral movement; do not simply scale the desktop offsets to mobile.
- [ ] Preserve the existing recognition photograph, caption and overflow fix. The frame may appear to lift or settle into a recessed surface while the copy stays in flow.
- [ ] Ensure anchor target `#recognition` lands correctly even when a panel overlaps visually; don't intercept touch scroll or move actionable links.
- [ ] Add an always-readable reduced-motion/static overlap appearance and responsive fallback for spacious settings.

**Exit criteria:** A mobile visitor can **see one meaningful visual scene change** on first downward scroll; no content shifts under text, no clipped heading, no focus/anchor regression, native scrolling still works.

### PHASE 03 — Discovery: four DYS experiences as a guided passage

**Goal:** Make existing linked topic rows feel like a curated discovery rather than four repeated list entries.

Actions:

- [ ] Retain names, descriptions, existing illustrations and four functional deep links: Dyslexia, Dyspraxia, Dyscalculia, Dysgraphia. No fabricated symptoms/stereotypes.
- [ ] Introduce a subtle running path/marker or soft tactile highlights that progress as rows enter the viewport.
- [ ] Desktop: consider a **short lateral visual passage** or split artwork accompanying the four links; do not require horizontal scroll to reach any link.
- [ ] Mobile: favour **sequential perspective shifts / short lateral art drift** with ordinary vertical scrolling. No forced carousel, long pin or compulsory swipe.
- [ ] Keep each link stationary and selectable; a visitor can tap directly into any topic at any point.
- [ ] If a sticky illustration is used, ensure it is artwork-only, compact, and automatically disabled when viewport height/spacing/font size makes it unsafe.
- [ ] Check touch target sizes, high contrast, voiceover reading order and return-from-topic-page scroll restoration.

**Exit criteria:** Clear progression through the four topics on phone and desktop; navigation never depends on animation; larger fonts/reduced motion produce readable static rows.

### PHASE 04 — Connection: evolving illustrated community journey

**Goal:** Make the existing three-part community scene the homepage's memorable emotional centre.

Actions:

- [ ] Keep the existing three connection chapters and the factual statement that the CIC is **still building** its community/support foundations.
- [ ] Refine—not replace by default—the current `CommunityArtwork` SVG; maintain proportioned figures and correctly drawn hands/arms. If a new illustration is proposed, treat it as a separate reviewable improvement.
- [ ] Use a scroll-linked GSAP timeline to **draw/emboss connecting paths**, bring decorative nodes together and subtly evolve the composition as each chapter enters view.
- [ ] Desktop: retain selective artwork pinning only while the real three chapter elements are traversed; recalculate distances from actual element dimensions.
- [ ] Mobile: replace the mostly imperceptible compact movement with a **short, readable evolving tableau**: ideally sticky artwork for a carefully bounded interval *only if proven safe*, otherwise a non-pinned ScrollTrigger scene with clearly visible path progression and layered transitions.
- [ ] Never pin paragraphs or freeze a focusable control behind the artwork; do not add arbitrary blank scroll distance or visually obscure link destinations.
- [ ] Integrate the path with the tactile surface system (subtle relief along the strokes and nodes, not blurred lettering).
- [ ] Fully tear down/rebuild timelines when reading settings, viewport height, orientation, images or fonts change.

**Exit criteria:** The path visibly develops across the three chapter beats on mobile; normal-flow fallback is equally coherent. Navigation, screen readers, large type and reduced motion pass.

### PHASE 05 — Support → About → Invitation: purposeful calm, layered finish

**Goal:** Finish the full top-to-bottom narrative while retaining useful navigation and the organisation's credibility.

Actions:

- [ ] **Support:** preserve practical links and make them easy to choose. Add only a gentle raised surface/arrival treatment; no elaborate pin, hidden choices or moving tap targets.
- [ ] **About:** preserve original full logo, verified Marie/CIC copy and present reading order. Introduce a tactile frame or quiet panel transition, not an animated/morphed logo.
- [ ] **Invitation:** give the existing “There's room for you” conclusion an elegant, calm reveal that echoes the earlier connecting-path motif; keep the contact CTA prominent.
- [ ] Create visual rhythm between dense and quiet chapters. Audit entire journey for repetitive cards, redundant transitions and overly long mobile scroll spans.
- [ ] Ensure smooth visual continuity: texture persists, overlays match brand tones, and one section does not flash/flatten unexpectedly when backgrounds change.
- [ ] Validate every CTA, anchor, menu and Reading settings control in touch, keyboard, zoom, and alternate background modes.

**Exit criteria:** A complete, polished **presentation-ready homepage** from start to final invitation **without any mini-game**. User can stop here and show Marie the result.

### PHASE 06 — Whole-site integration, mobile feel and accessibility gate

**Goal:** Tune the actual complete journey; establish a safe release candidate **before** adding the optional game.

Actions:

- [ ] Compare *real mobile scroll behaviour* (Android Chrome and iOS Safari where accessible) to desktop, not just static screenshots. Record video or screenshots of signature moments.
- [ ] Calibrate ScrollTrigger start/end distances, speed, overscroll and trigger refresh so animated effects are perceptible but don't lag behind fast swipes.
- [ ] Keep native mobile touch momentum. Do **not** enable Lenis on touch just to claim Lenis is running; only trial it if tested to improve the experience and native scrolling/accessibility remain intact. Ensure Lenis/GSAP share one clock where Lenis is active and listeners clean up.
- [ ] Check browser Back/Forward, fragment links, menu open/close, reading-dialog focus return, history restoration and navigation after mid-scene interaction.
- [ ] Test all five fonts, all four backgrounds, maximum spacing, texture on/off, OS/site reduced motion, 320px width, phone landscape, 200%/400% zoom and no-JS behaviour.
- [ ] Run automation (`npm run typecheck`, `npm run lint`, `npm test`, `npm run build`), relevant browser Playwright/axe checks, contrast audits and performance tests; record **actual** results, skipped checks and outstanding issues.
- [ ] Optimise/reduce mobile animation cost: prefer `transform` and `opacity` for moving decorative elements, static texture, limited SVG filters, no expensive whole-screen blur and no unnecessary image/LCP regressions.
- [ ] Update `docs/QA.md` and README with all new motion, texture preference, testing and fallback behaviour.

**Exit criteria:** Site is considered release-ready **without a game**. Every visitor can read, navigate and choose preferences. No known overlap, scroll trap or critical WCAG 2.2 AA blocker. Provide actual test and commit evidence, not an unverified claim of certification.

### PHASE 07 — OPTIONAL, LAST: “Paths to Belonging” mini-game

**Goal:** Reward readers who reach the end without making gameplay a requirement to use the site.

Actions:

- [ ] Add a clearly optional **“Paths to Belonging”** experience near the bottom, immediately before the footer or between invitation and footer as fits current content flow.
- [ ] Provide a compact tactile network puzzle: select/connect nodes to produce a shared path composition; warm embossed nodes and pathways use the **approved brand palette**.
- [ ] Keep it **short, untimed, replayable, gentle and non-competitive**; no scoring people by reading speed, no disability stereotypes, no intrusive celebration animation or unrequested audio.
- [ ] Support **touch, mouse, keyboard** and click/tap selections without drag precision. Provide clear instructions, restart, progress/status in accessible text and a non-visual completion cue.
- [ ] Respect all five fonts, text size/spacing, four backgrounds, texture on/off and reduce-motion settings. The puzzle state should not be lost solely because someone changes reading preferences.
- [ ] No account, leaderboard, analytics trackers, personal data collection, social sharing prompts or hidden backend.
- [ ] Load game code lazily if useful, and ensure the footer/support/Contact remain accessible if the game fails to load or JavaScript is disabled.
- [ ] Verify gameplay, focus, status announcements, zoom, mobile orientation, performance and the full release checks for files changed in this phase.

**Exit criteria:** Pleasant optional game with accessible completion/restart; all critical navigation remains intact. If game work proves too risky/time-consuming, **defer it without undoing the complete presentation-ready homepage from Phase 06**.

---

## 5. Section-by-section choreography map (implementation reference)

| Journey point | What the visitor should *feel* | GSAP/CSS idea | Reduced-motion/spacious fallback |
|---|---|---|---|
| **Hero** | Welcomed into a living but calm composition | Gentle orbit/path layers; staggered depth with scroll | Static artwork and prominent CTA |
| **Hero → Recognition** | One physical sheet giving way to another | Rounded overlapping panel + scene transition | Ordinary sections with clear boundary |
| **Recognition** | Seeing real people, not a graphic template | Recessed photo frame; slight contained image drift | Static labelled photo, caption and copy |
| **Discovery** | Four different routes; no one expected path | Progressive marker / lateral decorative artwork | Four readable, direct links |
| **Discovery → Connection** | Separate experiences beginning to meet | A recurring tactile path connects the transition | Static line/motif between sections |
| **Connection** | Relationships form over the chapter | SVG draw/progressive landscape; selective art-only sticky | Normal-flow illustrated landscape |
| **Support** | Space to decide without pressure | Gentle stable reveal; raised focusable links | Same practical links, no motion |
| **About** | Credibility and human warmth | Soft framed logo/photo scene; overlap transition | Full approved logo + verified text |
| **Invitation** | A welcoming conclusion | Paths settle/converge, CTA remains still | Clean closing panel |
| **Game, final optional phase** | A small enjoyable reward | Tactile nodes/paths and satisfying completion | Same puzzle with no decorative movement |

**Measured implementation success is about the perceived scene changes**, not the number of GSAP tweens. A phone visitor should recall at least the sheet overlap, the sequential discovery and the evolving connection path — while being able to read or skip them naturally.

---

## 6. Work-mode execution protocol (copy into each new chat)

1. Start by reading this plan **and all original project source Markdown**. Inspect the current **`master` HEAD** and read `AGENTS.md`, `docs/QA.md` and relevant code; never implement against an assumed old commit.
2. Work on **one named phase only** (e.g. “Phase 01”), in order. Do not advance to the next phase without user instruction. Preserve the approved logo, tagline, existing content, colours and navigation.
3. Implement actual code changes in the existing `jonathan-hansel-awo/connecting-dys` repository (not a new project), with focused commits or a PR if appropriate. **Do not configure, invoke or deploy to Vercel.**
4. Run at least `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`; run focused browser/interaction tests that are relevant to that phase. If browser tools are unavailable, state that as an unverified acceptance item.
5. Supply a before/after visual summary, mobile-specific motion summary, preferences/accessibility QA result, list of changed files, any blockers, **exact branch, commit SHA and push/PR URL**, and which phase remains next. Don't describe unrun checks as passed.
6. Each phase must leave the existing homepage usable and presentable. The final optional game remains **Phase 07**.

**Suggested prompt for the next Work chat:**

> Continue work on the **existing Connecting Dys website** at `https://github.com/jonathan-hansel-awo/connecting-dys`. Read all project Markdown instructions and the file `CONNECTING_DYS_HOMEPAGE_ENHANCEMENT_ACTION_PLAN.md` that I'm attaching. Implement **PHASE 00 ONLY** of that plan, not later phases. Inspect the actual latest repository and current implementation, do the specified work, run the relevant tests, commit/push documented changes when needed, and return the exact results. Do not redesign the site, change the approved logo/tagline, or deploy/configure Vercel. I will decide when to proceed to Phase 01.

---

## 7. Deliverables checklist (across the roadmap)

- [x] Documented current baseline and motion/reading-preference contracts (Phase 00; browser limits recorded)
- [x] Site-wide fine tactile background and preference-aware visual surface system (Phase 01 implementation; visual acceptance pending)
- [ ] Noticeable mobile hero→recognition transition (Phase 02)
- [ ] Curated, accessible DYS discovery progression (Phase 03)
- [ ] Signature connection story, mobile and desktop (Phase 04)
- [ ] Calm, complete support/about/invitation journey (Phase 05)
- [ ] Full mobile, preference, performance and accessibility release gate (Phase 06)
- [ ] Optional accessible Paths to Belonging game **LAST** (Phase 07)

**Reminder:** the visual mock-up is a moodboard for textures/overlap, **not an approved replacement screenshot**. It used a different generated logo and compressed some content; the real homepage and approved assets take precedence.
