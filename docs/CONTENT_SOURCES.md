# Content sources and decisions

Reviewed 13 November 2026.

## Authoritative instructions

All seven attached Markdown project sources were read before implementation, together with repository `AGENTS.md` and the original README. The current user request supersedes older source-pack instructions that proposed a new repository or called the logo provisional: use the existing `connecting-dys` repository; Marie has approved the existing logo and tagline. No new logo has been drawn or substituted.

## Existing website audit

The public HTML at https://dys-connect-hub.base44.app/Home and its delivered application bundle `/assets/index-Cc6BzY9h.js` were read. The bundle contains the actual route content; the initial HTML also exposes the public route inventory. This was a source audit, not a browser/form interaction audit.

| Source                                              | What was used                                                                                                                            |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Home metadata and public route inventory            | Organisation purpose, audience, available public page names                                                                              |
| About route (`qT` in the audited bundle)            | Community led, Nottingham base, nationwide community, shared experience; including people waiting for diagnosis or unsure where they fit |
| WhatWeDo route (`VT`)                               | Explicit statement that full services are not being delivered yet; building foundations and community before services                    |
| Contact route (`k4`) and footer                     | Published `hello@connectingdys.org` email address                                                                                        |
| Dyslexia, Dyspraxia, Dyscalculia, Dysgraphia routes | Conservative introductory descriptions of the differences and their everyday contexts                                                    |
| OurPolicies route                                   | Existing organisation policy destination retained; no replacement legal text invented                                                    |
| Supplied brand source and current user approval     | Marie Johnson as lead, CIC status, palette, approved unchanged logo and exact tagline                                                    |

The old policy page also mentions `connectingdys@gmail.com`, whereas the contact route and footer consistently use `hello@connectingdys.org`. This implementation uses the contact route’s published address; delivery was not tested and Marie should confirm the operational address before wider release.

Medical advice, diagnostic checklists, prevalence figures and stereotyped lists of strengths were not expanded from the old content. The new pages are simple community introductions. Future specialist information should have editorial/source review.

## Intentional omissions

- No fabricated community voices, founder biography, member imagery, outcomes, activity listings or statistics.
- No donation/checkout, sign-up or member portal built without the necessary service, consent, safeguarding and moderation design.
- No copying of contact forms or promises about response times/confidential processing.
- No claim that a particular font improves all dyslexic readers’ experience.

## Font sources

Self-hosted Latin fonts were copied from the installed `@fontsource/open-sans`, `@fontsource/nunito-sans` and `@fontsource/atkinson-hyperlegible` packages. Their licence texts are included alongside the assets. Existing OpenDyslexic OTF metadata confirms the 2019 OFL copyright and licence; matching standalone licence text was obtained from https://github.com/antijingoist/opendyslexic/blob/main/OFL.txt.
