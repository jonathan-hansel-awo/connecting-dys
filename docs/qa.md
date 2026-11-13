# Verification — 13 November 2026

## What changed after inspection

- Fixed the broken hyphenated logo URL; preserved the approved source image byte-for-byte.
- Repaired a package-lock mismatch that initially prevented `npm ci`.
- Replaced build-time Google font fetching with licensed local fonts, and added the missing Atkinson Hyperlegible option.
- Hardened preference parsing, pre-paint restoration, denied storage handling and cross-tab updates.
- Kept one Lenis/GSAP clock; preserved native anchors, keyboard/focus behaviour and route cleanup.
- Implemented the complete homepage journey with original artwork, decorative lateral/pinned storytelling and non-animated text.
- Added eight calm supporting routes and real destinations for the homepage navigation.
- Removed Cache Components / partial prefetching after a browser test exposed stale visible content on back navigation. These public pages are statically generated; ordinary Next route lifecycles now restore the correct page. Back/forward was retested successfully, with zero pins on reading pages and one pin after returning home.

## Automated checks

Final execution: `npm ci`, typecheck, lint, four preference tests, production build and three built-route checks all **passed**. The build prerendered the homepage and all eight supporting pages. `git diff --check` passed, and the original logo file has no diff.

The production homepage references 10 script files totalling 740,496 bytes raw / 238,458 bytes when each is gzip-compressed (about 233 KiB gzip, including framework/runtime and any legacy script references). This is an asset inventory, not a measured transfer or Core Web Vitals score. Temporary public audit files were absent after the build.

The handoff runs `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm run test:routes` against the finished source. The route suite checks all nine generated documents, one main/H1 per route, every internal content link and fragment, and the exact logo path. Four preference tests cover untrusted/corrupt storage, all five fonts, allowed ranges, bootstrap parity and denied storage access.

Production dependencies have zero reported vulnerabilities in `npm audit --omit=dev`. The full audit still reports development-tool advisories in the shadcn / TypeScript ESLint dependency trees; a safe `npm audit fix` did not resolve them. No forced major downgrade was applied. shadcn is a development dependency rather than a production runtime dependency.

## Browser checks performed

Chrome was used through the managed local preview. A repeatable same-origin iframe harness provides controlled CSS viewport sizes and runs axe-core against the rendered application, not the HTML source.

| Check                                                                                           | Observed result                                                                                                                |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Homepage, 390 × 844                                                                             | No horizontal overflow; zero reported WCAG A/AA violations                                                                     |
| Homepage, 768 × 1024                                                                            | No horizontal overflow; zero reported violations                                                                               |
| Homepage, 1200 × 900                                                                            | No horizontal overflow; zero reported violations; desktop pin active                                                           |
| Homepage, 844 × 390 landscape                                                                   | No horizontal overflow; zero reported violations; no pin                                                                       |
| Homepage, 320 × 234 reflow viewport                                                             | No horizontal overflow; zero reported violations; no pin                                                                       |
| Homepage, 320 × 740, OpenDyslexic, 28px, 2× line spacing, 0.12em letter spacing, reduced motion | No horizontal overflow; zero reported violations or incomplete checks; decorative composition simplified                       |
| About, Support, Community, Contact and all four learning-difference pages, 390 × 844            | Zero reported violations and zero incomplete checks on all eight routes                                                        |
| JavaScript-disabled homepage, 390 × 844                                                         | Full heading/content structure present; natural layout; no pin; no horizontal overflow                                         |
| Reading font choices                                                                            | Open Sans, Arial, Verdana, Atkinson and OpenDyslexic applied; both optional font faces confirmed loaded                        |
| Reading persistence                                                                             | Restored font, size, spacing, colour and motion settings after reload; reset restored defaults                                 |
| Reduced motion control                                                                          | Destroyed Lenis and all pin spacers; reset restored motion                                                                     |
| Skip link                                                                                       | Keyboard activation focused `main-content`                                                                                     |
| Reading panel / mobile menu                                                                     | Escape closed the disclosure and returned/retained focus on its summary                                                        |
| Route changes / browser history                                                                 | Reading pages had zero pins; returning home restored one pin; no retained second main after caching fix                        |
| Story movement                                                                                  | Artwork pinned near 150px; lateral track transform changed; text column had no transform                                       |
| Images                                                                                          | Approved logo rendered at correct path with responsive sources and reserved proportions; lazy footer image loads when relevant |

Axe tags: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`. Default homepage audits leave one or two **incomplete** contrast checks where decorative artwork overlaps the recognition caption / invitation. These are not counted as automatic passes: the actual cream-on-navy / navy-on-cream text pairs were inspected and checked numerically. The cream/navy pair is 11.72:1; teal on cream is 5.71:1; white on teal is 6.09:1. Navy on amber/coral is 6.86:1 / 4.55:1. No low-contrast amber/coral small text is used on cream.

## Repeat the browser audit

```sh
npm ci
npm run qa:prepare
npm run dev
```

Open `/__qa.html?w=390&h=844`. The form accepts width, height, a local path and a no-JavaScript option. The hidden `#results` element contains JSON with overflow, semantics and axe results; inspect its text or temporarily show it in the fixture. The harness injects axe only into its own local test frame. It is not part of the public app.

`npm run qa:clean` removes temporary public QA assets. The production build always cleans them automatically before compiling. The fixture and setup script remain under `tests/` / `scripts/` so the checks are reproducible.

## Limits and remaining review

- This is a WCAG 2.2 AA **target**, not certification. Automated checks do not prove conformance.
- OS-level reduced-motion changes were not emulated in this environment. The media-query logic/CSS were reviewed; the site’s reduced-motion control was exercised in the browser.
- 320px viewport reflow was tested, including a short viewport corresponding to a 400% zoom scenario. Actual browser 200%/400% zoom, physical touch devices and screen-reader combinations were not exercised.
- No Lighthouse, throttled mobile performance run or field LCP/CLS/INP measurements were collected. Local font hosting, image dimensions/preload, lazy optional fonts, static content and limited scoped motion are implemented; production performance still needs measurement on the owner’s deployment.
- No authenticated membership backend, form submission, real member stories or clinical pathways were enabled.
- The legacy policies page loads. Its policy copy includes an older Gmail contact link alongside the current domain email used by the Contact page; the organisation should reconcile that legacy content.
- Owner review with Marie should confirm copy and the operational mailbox / policies before public launch. No Vercel action was taken.
