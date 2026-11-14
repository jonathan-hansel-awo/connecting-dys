# Phase 03 — A guided discovery passage

Implemented against Phase 02 commit `604b3af65b9fa8e9193d07d8b3cdeae757d7da66`. This phase preserves all four names, cues, descriptions, original illustrations and destination routes. Phase 04's community choreography is unchanged.

## Before and after

| Before | Phase 03 |
| --- | --- |
| Four static editorial topic rows | A fine curved trail develops beside the same four rows as they enter view |
| Stationary illustration discs | Their original inner drawings drift gently in alternating directions; the discs and links stay still |
| Uniform row presentation | A quiet paper-tinted band strengthens and recedes through each short beat, without adding cards |
| Soft rectangular hero recess and upper disc | Owner-requested heart and house paper recesses, separate from the unchanged approved logo |

The approved mock-up guides the shallow relief, continuous grain and upper-left light. It does not replace homepage content, typography, colours, structure or branding. No sticky illustration, extra pin, horizontal navigation, compulsory swipe, hidden text or new scroll runway is added.

## Scene contract

Each of the four `#explore .difference-row` anchors owns a decorative `DiscoveryTrail` (wash, curved SVG segment and raised node). The existing `DifferenceArtwork` keeps its SVG/frame and original paths; an inner group alone moves. A row remains a single ordinary link whose whole area is available immediately.

| Property | Compact / native touch | Desktop (≥1100×700 and fine pointer) |
| --- | --- | --- |
| Trigger and bounds | Actual row: `top 85%` → `bottom 25%` | Same |
| Scrub | `true` | .3s |
| Path | Normalized dash offset 1→0; pixel rounding disabled | Same |
| Illustration | x −4→4 SVG units, direction alternates per row | x −6→6 SVG units, alternating |
| Paper highlight | Opacity .05→.8→.05, peak halfway through the beat | Same |
| Stationary content | Anchor, number, cue, heading, description, illustration disc and arrow | Same |

New timelines require height ≥520px, OS/site motion permission, non-spacious typography and no forced colours. They use the existing matchMedia context, preference rebuild and geometry refresh lifecycle. No new animation timer, scroll listener, animation clock or library is introduced; the existing reading-preference storage is unchanged.

The CSS/server fallback is a complete path and quiet static band. Short landscape screens use that new static scene. Spacious reading removes the decorative rail/band and keeps all links/illustrations in the existing reflow layout. OS/site reduced motion reverts motion, forced colours/print remove optional layers, and no-JS preserves the four direct links. Hover no longer changes row padding, so pointing at a topic does not shift its text or target. Focus outlines remain outside unclipped anchors.

## Owner-requested hero refinement

`HeroRecess` supplies two original decorative SVG paths: heart and house, with shallow inner light/shadow and the existing procedural paper tile. The heart replaces the Phase 02 decorative plane; the house replaces the upper disc. The lower disc, existing hero paths, approved emblem/wordmark/tagline and Phase 02 motion distances stay intact. These are hidden decorative motifs, not replacement logos or new claims.

Both fills follow the selected reading background. Texture Off removes the grain and inset filter; spacious/short/forced-colour/print alternatives suppress the optional motifs. There is no bitmap generation or new image/font dependency.

**Recorded for later:** the owner's suggestion for selectable background texture styles. Phase 03 retains the current Background texture On/Off preference and existing storage schema; a style selector is a separate future enhancement.

## Navigation and zoom compatibility corrections

The full browser run exposed a short-landscape Back jump to the discovery heading instead of the visited topic. `useTopicReturnRestoration` records a small bookmark (source URL, topic link, relative position, keyboard origin) on the **existing** history entry, preserving its framework data and URL. When that cached page returns, two cancellable animation-frame callbacks let layout settle. The hook repairs an off-screen topic heading while leaving an already-correct native restoration alone; keyboard focus returns with `preventScroll`. It does not add history entries, intercept scrolling, change `scrollRestoration` or use preference/local storage. The bookmark survives cached page lifecycles. Tests cover Enter → Back → Forward → Back for every topic, including repeated landscape runs.

Actual 200% Chromium zoom also exposed an existing 2px overflow from the closing chapter's negatively inset decorative container. Its mobile paint is now contained inside that existing section. Closing content and choreography are unchanged. The corrected page measures zero horizontal overflow at both actual 200% and 400% zoom; corresponding intermediate-width/short-height assertions are included.

## Verification

- Production build, lint, TypeScript and **11 production regression groups pass**, including unchanged approved logo hashes and direct topic-link semantics.
- Initial focused Chromium run: **6 passed** on narrow phone and desktop, checking all four beats, keyboard/topic/Back reading-position restoration, all fonts/backgrounds, reduced motion, forced colours and no-JS.
- The final six-viewport browser matrix and screenshot evidence are recorded in [the evidence directory](baselines/phase-03/README.md).
- New geometry assertions require >.7 path progress per row, highlight peak >.6, changed inner-art transforms, stationary anchor/text/arrow coordinates within 1px, contained artwork and no horizontal overflow. All four topic visits use Enter; Back must restore the prior reading position within 3px.
- [Source/HTTP comparison](baselines/phase-03/source-http-audit.json): ten routes return 200; all main text, links and image semantics match Phase 02. Original logo and approved symbol asset hashes are unchanged.
- Total compressed built-static-asset delta: **+584 bytes JavaScript, +277 bytes CSS**. This excludes server-rendered decorative SVG markup and is not a network-transfer, frame-rate or Core Web Vitals measurement. No package, font or runtime bitmap asset is added; the existing paper tile is reused.

Actual browser UI 200%/400% zoom is now checked at default reading settings, with [screenshots/measurements](baselines/phase-03/browser-zoom.json). Physical Android/iOS touch feel, VoiceOver/screen-reader review, physical high-DPI inspection and Core Web Vitals remain release checks. Automated semantics/keyboard/reflow coverage is not presented as VoiceOver testing or WCAG certification. No Vercel deployment/configuration or build-status monitoring is performed.

## Changed implementation files

- `src/components/discovery-trail.tsx`, `home-story-motion.tsx`, `story-art.tsx`, `src/styles/discovery.css`: decorative trail, bounded artwork drift and quiet highlight.
- `src/components/hero-recess.tsx`, `hero-transition-art.tsx`, `src/styles/hero-transition.css`: heart/house material refinement.
- `src/app/page.tsx`, `src/app/layout.tsx`: attach server artwork and scoped CSS to the existing homepage.
- `src/lib/use-topic-return-restoration.ts`, `SmoothScrollProvider.tsx`: scoped topic-return navigation bookmark. `globals.css`: contain the existing closing decoration at intermediate zoom widths.
- `tests/browser/discovery.spec.ts`, `tests/production.test.ts`: real geometry/navigation/preferences and decorative-scope regression checks.
- README, roadmap, scene contracts, QA report and `docs/baselines/phase-03/`: current behaviour, deferred texture-style request and actual evidence.
