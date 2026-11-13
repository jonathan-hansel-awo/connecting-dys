# Verification report

13 November 2026. This report distinguishes production-source checks from real-browser verification. WCAG 2.2 AA is the target, not a certification claim.

## Executed checks

| Check                          | Result and scope                                                                                                                                                                                                                                               |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clean dependency installation  | `npm ci --no-audit`; reconciled the original incompatible lockfile                                                                                                                                                                                             |
| ESLint                         | `npm run lint`                                                                                                                                                                                                                                                 |
| TypeScript                     | `npm run typecheck`                                                                                                                                                                                                                                            |
| Production build               | `npm run build`; homepage plus nine content routes generated                                                                                                                                                                                                   |
| Regression suite               | `npm test`; eight test groups against the generated production HTML                                                                                                                                                                                            |
| Brand integrity                | SHA-256 confirms the approved PNG is byte-for-byte identical to the starting repository                                                                                                                                                                        |
| Internal routes and anchors    | Traversed every rendered internal link/fragment across ten routes against the production output; no missing destinations                                                                                                                                       |
| No-JavaScript content          | All ten production HTML documents contain their complete main content, a single H1, ordered headings, skip destination and named images without running app scripts                                                                                            |
| Preference restoration         | Executed the actual compiled first-paint script in jsdom for all five fonts and maximum reading settings; also tested malformed JSON, hostile values and denied localStorage access                                                                            |
| axe structural audit           | No detectable WCAG 2 A/AA, 2.1 AA or 2.2 AA structural violations across ten rendered routes in jsdom. Colour contrast disabled in axe because jsdom has no rendering/layout engine; this is not a full browser audit                                          |
| Palette contrast               | Numeric WCAG contrast checks pass 4.5:1 for navy/teal normal text across all reading presets and principal tinted reading surfaces; white-on-teal and amber-on-navy also pass                                                                                  |
| Optional-font loading contract | Required WOFF2 assets exist; optional fonts are not included in font preload tags                                                                                                                                                                              |
| Dependency audit               | Production dependencies: no vulnerabilities reported. Full development graph retains 12 advisories (2 low, 10 moderate) in shadcn/deepmerge/minimatch and associated tooling. `npm audit fix` could not eliminate these; no forced major downgrade was applied |
| Diff hygiene                   | `git diff --check`                                                                                                                                                                                                                                             |

Tests inspect generated files, not a running HTTP server. The eight tests cover ten routes internally; “eight” is the test-group count, not a browser/device count.

## Browser preview blocker

The supported managed command `sites-preview start <checkout>` invoked the Next.js dev script as:

```text
next dev --host 127.0.0.1 --port 4173 --strictPort
```

Next.js rejects `--host` (its option is `--hostname`) and does not use Vite’s `--strictPort` flag. Preview stopped during startup. The application itself builds successfully. No alternative browser runner or replacement preview infrastructure was introduced.

## Not executed — required before public release

- Visual inspection on real phone/tablet/desktop browsers, portrait and landscape.
- Manual keyboard traversal, modal Escape/focus return, skip links and mobile navigation.
- Real OS reduced-motion preference changes, native wheel/touch scrolling and momentum interruption.
- 200%/400% zoom and narrow 320 CSS-pixel reflow, including maximum reading settings and optional font loading/failure.
- Real ScrollTrigger pinning, lateral artwork and lifecycle behaviour through navigation, history restoration, resize and mid-page font/spacing changes.
- Full browser axe, rendered colour-contrast audit, Lighthouse and measured Core Web Vitals / LCP / CLS / INP.
- Screen-reader and real-user review.
- Email deliverability and external forms, accounts, policy correctness or service availability on the existing Base44 website.

## Manual review sequence

1. Run `npm ci`, `npm run build`, `npm test`, then `npm start` locally.
2. At desktop width, wheel-scroll through recognition and connection. Only artwork should pin/move; text remains in the ordinary reading order. Move to a topic page and use Back while mid-story.
3. Use Tab from the top. Activate the skip link and verify main receives focus. Open Reading settings; test Tab/Shift+Tab, Escape and focus return.
4. Change all five fonts, size, line/letter spacing and backgrounds, including mid-story. Reload and confirm restoration. Use maximum size/spacing and confirm the simpler layout.
5. Turn on reduced motion in both the device and the site. Verify no Lenis interpolation, path-drawing or pin/lateral movement; direct navigation remains usable.
6. Test 320px, phone landscape, tablet and desktop, plus 200%/400% zoom. Check for clipped text, horizontal page overflow, obscured focus and unreachable controls.
7. Disable JavaScript and reload. Read the entire homepage and follow its topic/support/contact links.
8. Run full browser axe and Lighthouse; review with assistive technology and representative young visitors before wider release.

## Follow-up visual refinement (13 November)

The owner supplied the deployed URL, https://connecting-dys.vercel.app/, and mobile screenshots. Live desktop inspection confirmed the original header/hero issues. The Reading settings dialog opened, focused its close button and returned focus to the trigger after Escape. A read-only layout measurement also found that the rotated hero orbit extended beyond the viewport; the follow-up reduces its inset/rotation.

Changes move Reading settings out of the sticky header into normal document flow below it; remove sparkle/starburst motifs; use a transparent symbol-only adaptation of the embracing-heart identity; and show the unchanged original full logo at a larger size in a matching dark organisation section. The tagline is unchanged. Local lint, typecheck, build and the eight regression groups pass for the refinement. Deployment is still managed by the owner; this work only updates GitHub source. Updated deployment browser results are recorded separately when available.

### Updated live verification

The existing GitHub/Vercel integration automatically published source commit `99f9470`; no deployment API was invoked. On the updated live desktop page, the header has no Reading settings control, the separate toolbar scrolls away, the transparent symbol renders cleanly on cream, and the original full logo is readable in the organisation section. Measured page width equals viewport client width (no horizontal overflow). Reading settings opened with focus inside the native dialog; Escape returned focus to its trigger. Atkinson Hyperlegible and reduced motion persisted after reload; reduced mode had no Lenis instance and no pin spacers. Reset restored defaults.

Testing also exposed a same-page navigation edge case: clicking the home logo during Lenis momentum could override the router’s scroll-to-top. The follow-up interrupts momentum for every same-origin link, including links with no fragment. The header home link targets a native page-start anchor so same-route navigation reliably returns to the top rather than depending on the router’s scroll restoration. Real-device mobile/zoom, full browser axe/Lighthouse, and screen-reader reviews remain outstanding.

## Mobile recognition overlap and imagery refinement

Reproduced the reported bug on the live site at a 454 CSS-pixel viewport (300% Chromium zoom), with Atkinson Hyperlegible and the soft-blue reading background. Read-only geometry measured the recognition label starting **9px before** the artwork ended. The SVG had negative bottom margins and visible overflow; changing reading preferences exposed the layout problem.

The recognition chapter now uses a contained 3:2 responsive photo frame, a caption in normal flow and an explicit positive grid gap before the copy. The duplicated SVG is removed from that chapter. The connection illustration is redrawn with proportioned figures and filled anatomical arm/hand shapes. Mobile/compact GSAP choreography pans the contained image and connection artwork and draws the linking path without pinning text or intercepting native touch scrolling. Reduced motion and spacious reading choices still disable these effects.

Local lint, TypeScript, production build, all eight production regression groups and diff hygiene pass. Real-device touch, OS-level motion preference changes, screen readers and full browser performance audits remain separate checks. Narrow-viewport live results follow after publication by the existing GitHub integration.
