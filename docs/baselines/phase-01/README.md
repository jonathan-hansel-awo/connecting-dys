# Phase 01 evidence

`source-http-audit.json` records the executed comparison with a rebuilt Phase 00 source reference: ten successful HTTP routes, identical meaningful main content/links/images, texture MIME/bytes, approved asset hashes and raw/gzip asset counts.

Reproduce with a built reference checkout:

```bash
node scripts/audit-materials.mjs /absolute/path/to/built/phase-00-checkout
```

This evidence is **not a browser rendering or performance score**. New screenshots could not be captured; Phase 00 screenshots remain historical references and are not relabelled as Phase 01. The full limitations and acceptance checklist are in [PHASE_01_MATERIAL_SYSTEM.md](../../PHASE_01_MATERIAL_SYSTEM.md).
