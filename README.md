# Connecting Dys CIC

Next.js App Router + TypeScript website for Connecting Dys, a UK Community Interest Company. The original approved embracing-figures logo is preserved byte-for-byte. A background-free symbol adaptation is used in the header and hero following the owner’s 13 November feedback. The current tagline is **A home for every DYS mind.** No hosting project, deployment or Vercel configuration is created by this work.

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

## Experience and architecture

- `src/app/page.tsx`: server-rendered editorial homepage, following welcome → recognition → discovery → connection → practical support → organisation → invitation. The voices chapter is deliberately omitted until real, permissioned stories exist.
- `src/content/site.ts`: branding, verified contact address, learning-difference introductions and editable connection copy.
- `src/components/story-art.tsx`: original inline decorative SVG landscapes and topic illustrations. These are abstract illustrations, not member portraits or alternative logos.
- `src/components/home-story-motion.tsx`: GSAP + ScrollTrigger with `useGSAP` cleanup and matchMedia. The recognition photo pans within its frame; the connection artwork pins briefly on desktop while its landscape travels laterally. Compact/touch layouts use short unpinned lateral movement and path drawing. All reading text stays still in ordinary DOM order.
- `src/components/providers/SmoothScrollProvider.tsx`: one GSAP ticker drives Lenis. Dynamic Lenis import, no touch interpolation, native anchors/history/keyboard interruption, and complete lifecycle cleanup. No transformed scrolling container or body scroll lock.
- `src/lib/preferences.ts`: shared validated preference application; its self-contained runtime also runs before paint. Storage failures cannot block rendering. Optional font faces are fetched only when selected. Preferences apply to headings, controls and reading surfaces; branded artwork stays unchanged.
- `src/components/reading-settings.tsx`: a control below the navigation (not sticky), opening a native modal dialog with Escape, focus containment and focus return, plus a native scrollable panel.
- `src/app/[slug]/page.tsx`: calm reading routes for the four DYS subjects, about, support, getting involved, contact and accessibility. Existing organisation policy information remains linked to the original website.
- `src/app/globals.css`: central brand/reading tokens, fluid responsive layouts, enhanced large-spacing layouts, reduced-motion, print and forced-colour alternatives.

Pinned desktop choreography requires a fine pointer, at least 1100px width and 700px height. Other viewports use contained, unpinned artwork movement driven by native scrolling. Both modes require no OS reduced-motion preference and no personal simplified-reading preference. Large type/line/letter spacing and OpenDyslexic select spacious compositions. Lenis is disabled on coarse pointers and in reduced-motion mode. No information relies on animation or JavaScript being available.

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
