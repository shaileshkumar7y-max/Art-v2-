# Phase 7 — final update merge guide

This is an **incremental patch**. Apply it on top of your Phase 6 build. Do not replace the whole project with this ZIP and do not delete files that are not listed below.

## Replace these existing files

- `index.html` — adds meta CSP/referrer policy, 19-image copy, and self-attestation disclosure.
- `app.js` — validates and normalises saved shelf records before use.
- `collections.js` — validates museum-provided image/record URLs as HTTPS and preserves local ArtFlip preview paths.
- `creator.js` — pins OAuth endpoints to the official HTTPS origin, verifies callback redirect/state, validates `sk_` token shape/expiry and limits returned image URLs to Pollinations hosts.
- `library-art.js` — expands My Studio Shelf from 11 to 19 works, uses actual image dimensions and improves keyboard focus handling in the Studio viewer.
- `sw.js` — increments the cache to v7, precaches the core app as required, and treats local artwork pre-cache as optional so one failed image cannot block service-worker install.
- `README.md` and `SOURCES_AND_LICENCES.md` — updated Phase 7 notes, sources, limits and deployment warnings.
- `PHASE_7_QA.md` and `PHASE_7_SECURITY_REPORT.md` — static QA evidence, open checks and security limits.

## Add these new files

- `PHASE_7_MERGE_GUIDE.md`
- `PHASE_7_QA.md`
- `PHASE_7_SECURITY_REPORT.md`
- Eight new WebP assets under `assets/my-studio/`:
  - `classical-male-anatomy-sheet.webp`
  - `vintage-graphite-figure-sheet.webp`
  - `sepia-bathhouse-figure-studies.webp`
  - `classical-atelier-figure-study.webp`
  - `classical-triptych-life-drawing.webp`
  - `monochrome-figure-sketchbook.webp`
  - `classical-charcoal-two-poses.webp`
  - `graphite-anatomy-ideas-8-9.webp`

## Keep these Phase 2–6 files unchanged

Keep `styles.css`, `manifest.webmanifest`, `brand-voice.js`, `pwa.js`, `artflip-figure-index.js`, `assets/artflip-thumbs/`, all Phase 2 artwork/pose sources and all eleven Phase 6 Studio WebP assets unchanged. `creator.js` is replaced as listed above. The Phase 7 ZIP does not copy older files or images again.

## Merge on GitHub from Android

1. Extract the ZIP on your phone.
2. Open your existing repository on GitHub and use **Add file → Upload files**.
3. Upload the listed changed files at the repository root, preserving the `assets/my-studio/` folder structure for the eight new WebP files.
4. Review the file list before committing. Do not delete the older files.
5. Commit with a message such as `Phase 7: final hardening and Library art expansion`.
6. After GitHub Pages publishes the change, open the site online once and wait for the new service worker v7 to activate; then reload it.
7. Test a second reload, Studio shelf, save/remove, light/dark mode, AI prompt building, and offline app-shell startup. Pollinations and live museum endpoints require internet and are not cached.

## Important publishing check

The 19 generated Studio works include non-explicit artistic nudity. The app's 18+ gate is only a self-attestation. Confirm you intend to publish those images to anyone who can access your public site/repository, and check the host's current content policies before deployment.
