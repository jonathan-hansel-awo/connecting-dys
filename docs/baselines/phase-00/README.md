# Phase 00 visual and functional evidence

Captured 14 November 2026. Source reference `d45aeff2c9b0148c9b3cb6db72613f35ebf595fb`; screenshots are from the existing live website, whose deployed commit was not independently exposed/verified. These are **before-enhancement** references; application source/assets remain unchanged in Phase 00. See [full report](../../PHASE_00_BASELINE.md).

| File | What it records |
| --- | --- |
| `overview.jpg` | Contact sheet of actual desktop/narrow welcome screenshots; no generated redesign |
| [desktop-journey](desktop-journey/README.md) | 13 sequential viewport frames, hero→footer, 1363×936 CSS viewport, 100% zoom |
| [tablet-journey](tablet-journey/README.md) | 22 sequential frames through footer, 779×535, 175% zoom |
| [mobile-wide-journey](mobile-wide-journey/README.md) | 53 sequential frames through footer, 454×312, 300% zoom |
| [mobile-narrow-journey](mobile-narrow-journey/README.md) | 101 sequential frames through footer, 340×234, 400% zoom |
| `*-settings.jpg` | Default native Reading settings dialog at each width |
| `mobile-narrow-max-settings.jpg` | Maximum OpenDyslexic size/spacing and soft-peach background |
| `desktop-hero.jpg`, `mobile-narrow-hero.jpg` | Settled desktop welcome viewport; narrow welcome viewport |
| `mobile-narrow-recognition.jpg` | Native anchor landing/contained image scene |
| `desktop-ending.jpg` | About/invitation viewport captured after navigation, retained with corrected label |
| `desktop-community.jpg` | Artwork-only desktop pin observed near y=140px |
| `mobile-narrow-community.jpg` | Compact scene reference; no pin |
| `capture-metadata.json` | Viewports, zoom method, scope, findings and limitations |
| `preferences.json` | Measured 5 fonts × 4 backgrounds at narrow reflow width |
| `motion.json` | Two close compact scroll samples; no measured path progression, not proof of choreography |
| `http.json` | Local production route/H1 traversal and external HTTP reachability |
| `manifest.json` | Screenshot hashes, byte sizes and raster dimensions |

Browser screenshots are JPEG. The browser full-page path cropped zoomed layouts; those incomplete images were discarded and replaced with sequential **viewport** screenshots. All four journeys were checked through the footer. `frames.json` records each CSS scroll position (some initial frames were a few pixels below zero during native scroll settling; the separate hero screenshots cover entry detail). These are visual references, not pixel-perfect baselines. The 340/454px widths approximate the requested narrow/wide sizes but are **desktop zoom with a fine pointer**, not physical phones or exact 360/430px device emulation. Viewport heights are also shorter than portrait phones. Native touch behaviour, true mobile rendering and exact portrait/landscape captures remain outstanding.

The new Playwright runner uses exact viewport dimensions and saves per-chapter PNGs/full-page screenshots to `test-results/`. Its browser launch was blocked in this environment; do not mistake test discovery for an executed browser pass. Keep these committed Phase 00 images unchanged and store later comparison captures separately.
