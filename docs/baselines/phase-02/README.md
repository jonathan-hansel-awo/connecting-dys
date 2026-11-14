# Phase 02 browser evidence

Real local Chromium against the production build, 14 November 2026. These are current Phase 02 captures, not generated mock-ups or a deployed site. Phase 01 reference: `de8e075276ac01990735a897c26eccb7a030f31b`.

- [Final full browser run](full-browser-results.txt) / [case-level JSON](browser-results.json): **54 passed, 6 intentional skips, no failures or flaky tests**. Five shared-route audit duplicates are skipped (the desktop run audits all ten routes); the remaining skip omits animation on short landscape screens while explicitly testing its static fallback.
- [Focused run output](focused-browser-results.txt): 17 passed, 1 intentional short-screen animation skip. Static short-screen checks still execute.
- [Measured path/edge progress and link clearance](measurements-summary.json), with full per-viewport measurement JSON alongside the screenshots.
- [Source/content/asset audit](source-http-audit.json): ten routes, identical content/links/images and unchanged approved logos.
- Early/late welcome captures show different ordinary scroll positions, not a fixed-camera before/after comparison. The tests separately compare absolute document coordinates to prove copy/controls do not move and sampled path/sheet geometry actually changes.

| Viewport | Early hero | Later hero | Recognition arrival |
| --- | --- | --- | --- |
| 360×800 | [early](mobile-narrow-welcome-early.png) | [later](mobile-narrow-welcome-late.png) | [settled](mobile-narrow-recognition-settled.png) |
| 1440×900 | [early](desktop-welcome-early.png) | [later](desktop-welcome-late.png) | [settled](desktop-recognition-settled.png) |
| 320×800 | [early](reflow-320-welcome-early.png) | [later](reflow-320-welcome-late.png) | [settled](reflow-320-recognition-settled.png) |

[360px maximum reading / texture-off / static recognition](mobile-narrow-recognition-spacious-flat.png) demonstrates the ordinary-flow fallback with OpenDyslexic, 26px, line-height 2 and letter spacing .12em. The native anchor lands below the header and the caption has positive clearance from the following copy.

Reproduce with `npm ci`, `npm run build`, then `npm run test:browser`. `PLAYWRIGHT_PORT` may choose an unused local port (default 3100); `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` may specify an installed Chromium. The test runner owns only its local server. In this workspace native Terminal was required because the command executor disallows Chromium Unix sockets; loopback proxy exclusion was required for local server checks. These are environment details, not application configuration.

The automated suite emulates viewports/media/input and uses rendered axe; physical mobile momentum, real high-DPI screens, assistive technology, browser UI zoom and Core Web Vitals remain separate release checks. No deployment or deployment-status lookup was used.
