# Connecting Dys CIC

An accessible Next.js App Router website for Connecting Dys, a UK Community Interest Company. The homepage follows welcome → recognition → discovery → connection → practical support → organisation → invitation. Community voices are intentionally omitted until real stories and permissions exist.

Marie’s approved embracing-figures artwork remains byte-for-byte unchanged at `public/brand/connecting_dys_logo.png`. The current tagline is **A home for every DYS mind.** The live request supersedes earlier source-pack language describing the logo as provisional.

## Run locally

Node.js 22.18+ (Node 24 recommended) and npm 11+.

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm run test:routes
npm start
```

The dev wrapper accepts normal Next CLI arguments and translates common preview `--host` / `--strictPort` flags. `test:routes` reads the production build, so build first. `npm run qa:prepare` creates a local browser/axe audit harness; `npm run qa:clean` removes it, and builds clean it automatically. No environment variables or third-party account keys are needed. No analytics, cookies, registration backend or message-submission simulation is included.

## Structure

- `src/app/page.tsx`: server-rendered homepage and logical document order.
- `src/content/site.ts`: approved brand configuration, editorial copy and learning-difference introductions.
- `src/app/[page]`: calm About, Support, Community and Contact pages.
- `src/app/understand/[difference]`: four learning-difference introductions.
- `src/components/home-motion.tsx`: scoped GSAP / ScrollTrigger decoration via `useGSAP`.
- `src/components/providers/SmoothScrollProvider.tsx`: the sole Lenis frame-loop owner.
- `src/components/reading-settings.tsx` / `src/lib/preferences.ts`: native disclosure controls, validated preferences and safe pre-paint restoration.
- `src/app/globals.css`: brand tokens, layouts, reading modes and responsive fallbacks.
- `tests/`: storage/first-paint regression tests and built-route/link traversal.
- `docs/content-audit.md`: content sources and operational boundaries.
- `docs/qa.md`: executed checks, findings and remaining manual validation.

## Motion and native browsing

GSAP’s ticker is the single Lenis clock; there is no second RAF loop. Touch scrolling is native. Wheel interpolation runs only on suitable desktop pointers. Native anchors, keyboard scrolling, focus and history remain browser-owned. Interpolation is synchronised to the native scroll position on focus, anchor/history changes and navigation keys.

Only the decorative connection artwork pins, on sufficiently wide/tall desktop viewports. Its three illustrations move laterally; essential text never moves with that track. Pin duration is the adjacent text column’s height less the illustration’s height. Public routes use ordinary static generation; Cache Components / partial prefetching were removed after back-navigation testing revealed stale visible route content. Mobile, short viewports, larger text and reduced motion use a normal document layout. Nothing must animate before it can be read or activated.

`useGSAP` and media contexts revert timelines, styles and pin spacers. Route effects destroy Lenis and its ticker subscription. Font completion and reading changes refresh measurements. Images reserve their natural aspect ratio. The document never applies scroll-blocking transforms or overflow to `body` / `main`.

OS reduced motion always wins. The Reading settings toggle can additionally reduce motion; it cannot override a device preference to force animation. At larger text sizes, decorative reading distractions are simplified further.

## Reading preferences and privacy

Five font choices: Open Sans, Arial, Verdana, Atkinson Hyperlegible and OpenDyslexic. Controls include 16–28px text, line/letter spacing, four reading backgrounds, reduced motion and reset. Optional fonts load on selection; no specialist font is described as a universal treatment.

A small trusted bootstrap in the head restores validated preferences before paint. Only the root element’s known style/data changes suppress hydration warnings. The hydrated controls reuse the same validation rules; parity is tested. Both malformed JSON and denied storage are handled. Settings still work in memory when saving is blocked. Updates from other tabs are observed. Settings are device-local and not sent to a server.

There is no CSP configured because hosting is owner-managed. If adopting a strict CSP, allow the exact emitted `#reading-preferences` script by hash or supply an appropriate nonce. Next’s own runtime also needs the corresponding CSP configuration. Never allow arbitrary inline scripts simply to enable this preference feature.

## Assets and licensing

- Approved logo: existing user-supplied image; preserved, not redrawn.
- All other visual compositions: original SVG / CSS artwork in this repository. Illustrations are decorative, not photos of members or diagnostic symbols.
- Open Sans and Nunito Sans: Latin variable WOFF2 files copied from the pinned Fontsource packages and loaded with `next/font/local`. This also removes build-time dependence on Google Fonts.
- Atkinson Hyperlegible: Fontsource Latin regular and bold files, lazily selected by CSS.
- OpenDyslexic: existing repository font files retained; upstream SIL Open Font License included from https://github.com/antijingoist/opendyslexic/blob/main/OFL.txt.
- Font licences are included under `public/fonts/licenses/`. Arial and Verdana use installed system fonts and are not redistributed.
- Lucide icons: existing `lucide-react` dependency (ISC licence).

## Content and integrations

The existing Base44 public website was reviewed for organisation facts, stage of development, membership information and the contact email. No testimonials, member portraits, events, service availability or impact figures were invented. Planned peer spaces / gatherings / workshops are explicitly future activities. General learning-difference descriptions remain brief and direct visitors to the existing detailed pages.

Contact opens the verified `hello@connectingdys.org` email address. The policies link remains on the existing website. Membership enquiries go through contact; this release does not enable a new data-collection or under-18 registration workflow. Any later membership/forms/community system needs a real provider plus reviewed safeguarding, privacy, consent and moderation arrangements.

## Manual Vercel handoff

No Vercel project has been created, linked, configured or deployed by this change. The repository itself is public, as it was when the task began.

1. Review the `master` branch and the content/QA notes with Marie.
2. In your Vercel account, import this existing repository; choose the Next.js preset and repository root.
3. Use `npm ci`, `npm run build`, and a supported Node runtime (22.18+ / 24). No application environment variables are required.
4. Review the preview on actual phones and with keyboard / screen readers; check OS reduced motion and all reading settings.
5. Confirm the retained external policy pages, contact mailbox and public wording before publishing.
6. Configure your own domain, canonical metadata, security headers / CSP and production monitoring as appropriate. No domain was assumed in code.

The accessibility target is WCAG 2.2 AA. Automated checks plus the documented browser checks are evidence, not certification; assistive-technology and real-user validation remain important.
