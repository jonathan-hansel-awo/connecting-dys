# Foundation audit

## Problems found and changes

| Starting issue                                                                   | Resolution                                                                                                                                               |
| -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home referenced `connecting-dys-logo.png` but asset is `connecting_dys_logo.png` | Single content-config path points to the original file; asset-integrity regression test protects it                                                      |
| Only three homepage sections; no actual ScrollTrigger storytelling               | Editorial home with recognition paths, four linked topic rows, a selectively pinned lateral landscape and quiet support/organisation/invitation chapters |
| Every reading preference change destroyed/recreated Lenis                        | Reconfigure interpolation only when motion/pointer policy changes; otherwise refresh measurements                                                        |
| Global GSAP ticker lag setting changed without restoring it                      | Removed global ticker configuration mutation; single ticker calls Lenis with monotonic time                                                              |
| No robust animation teardown for homepage scenes                                 | useGSAP + a newly scoped matchMedia context per configuration; revert all scene triggers and inline styles                                               |
| Anchor interception could interfere with native history/focus                    | Lenis anchors disabled; native keyboard/focus/fragment/history navigation interrupts outstanding inertia without preventing the browser action           |
| Preferences applied only after hydration                                         | Shared validated runtime applies saved CSS variables before paint, tested against the compiled production script                                         |
| localStorage failures could throw during updates or error handling               | Read/write access guarded; controls still work for the current visit                                                                                     |
| Atkinson Hyperlegible missing                                                    | Added actual self-hosted regular/bold font files and licensing; all five requested choices exist                                                         |
| Readability controls did not consistently scale fixed-size content               | rem-based typography, preference-aware headings/surfaces, spacious responsive compositions and natural document flow                                     |
| npm lockfile rejected a clean install                                            | Reconciled dependency graph and verified npm ci                                                                                                          |
| README was a starter template                                                    | Replaced with architecture, content boundaries, checks, licences and manual deployment handoff                                                           |

## Motion contract

Only decorative scene elements move or pin. No text is hidden awaiting animation. No transformed body/main, no artificial scroll height journey, no snapping, no mandatory carousel, no moving link targets. The desktop artwork pin has a relative distance derived from actual content/art height. Width/height/pointer/OS preference changes use GSAP matchMedia teardown. Font completion, body resize, image loads and page restoration refresh measurements. Reading-choice changes debounce the refresh/rebuild.

The original logo file is unchanged and is not morphed or animated. A transparent symbol adaptation, authorised in the owner’s follow-up feedback, is used in the header and hero. Separate landscape artwork is decorative and hidden from assistive technology.

Real browser lifecycle and interaction verification remains outstanding because the provided managed preview could not start Next.js (see QA report).
