# Phase 03 evidence

Real local Chromium against the production build, 14 November 2026. Reference source: Phase 02 `604b3af65b9fa8e9193d07d8b3cdeae757d7da66`. The screenshots are rendered application captures, not generated mock-ups.

The complete browser run, case-level results, measured discovery progression and selected phone/desktop/reflow screenshots are saved here after verification. The first focused phone/desktop run passed all six scenarios.

The tests compare absolute document coordinates to prove that links/text/arrows stay stationary while the decorative stroke and inner illustration change. Each topic is entered with the keyboard; Back restores the prior scroll position within 3px. Spacious mode, texture Off, OS/site reduced motion, forced colours, short landscape and no-JS are included. Source/content/brand parity is recorded in [source-http-audit.json](source-http-audit.json).

Run `npm run build`, `npm test`, and `npm run test:browser`. For a focused run: `npm run test:browser -- tests/browser/discovery.spec.ts`. The existing six viewports are 360×800, 430×932, 768×1024, 1440×900, 844×390 and 320×800. The runner owns its local production server, using the existing optional port/executable overrides; no deployment is involved.

Physical mobile/VoiceOver/browser UI zoom/high-DPI/performance release checks remain separate. See [the implementation report](../../PHASE_03_DISCOVERY_PASSAGE.md) for scope and limits.
