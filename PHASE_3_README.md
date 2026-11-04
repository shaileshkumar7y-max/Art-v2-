# Big-project- — Phase 3: Art Studio integration

**Package type:** additive new route plus small integration patch.  
**Target repository:** `shaileshkumar7y-max/Big-project-`  
**New route:** `https://shaileshkumar7y-max.github.io/Big-project-/art/`

## What this phase adds

- A mobile-first Art Studio route using the Phase 2 After Dark dark/oxblood/antique-gold design language.
- 52 curated ArtFlip figure-art records already identified in the Art-v2 source index. The source index marks them `isPublicDomain: true`; full images are loaded from their museum-hosted URLs and each card keeps a link to the museum record.
- 11 studio-library artworks from the existing Art-v2 repository, re-used by URL rather than duplicated in this ZIP.
- Artwork search, category filters, source filters, paginated cards, detail viewer and a browser-local Saved shelf.
- Pose Atlas with eight general Shisei poses and 32 available front/diagonal/side/above/below references.
- Fine-art prompt builder with composition, medium, lighting, palette and art-direction options.
- A link to the existing Art-v2 Creator at `#creator-section`. Its Pollinations BYOP/OAuth flow, live model catalogue and user-approved budget remain at the source Creator, so this phase does not copy provider credentials or invent a free generation quota.
- Adult self-attestation, non-explicit art framing, lazy images, accessible controls and reduced-motion support.

## Upload on Android / GitHub

1. Extract this ZIP.
2. Open `Big-project-` → **Add file → Upload files**.
3. Upload the complete `art/` folder exactly as provided. Do not flatten it; the route depends on `/art/index.html`, `/art/styles.css` and `/art/app.js`.
4. Apply the small replacements in `PHASE_3_INTEGRATION.patch` to the existing root `index.html` and `app.js`.
   - In root `index.html`, update the Phase 2 image paths to the raw `Game-` asset URLs and change the Art Studio link to `./art/`.
   - In root `app.js`, update the five Night Outfit Oracle image paths to the raw `Game-` asset URLs.
5. Commit to `main`. GitHub Pages should continue deploying from the repository root / `main` branch.
6. Open `https://shaileshkumar7y-max.github.io/Big-project-/art/` and test the Gallery, Pose Atlas, Creator, Saved tabs on Android Chrome.

`PHASE_3_INTEGRATION.patch` is a unified diff for the existing files. If you use GitHub's mobile editor instead of `git apply`, search for the exact old lines and replace them with the new lines shown in the patch. Do not replace the entire root files.

## Image strategy

No third-party image binaries are copied into this ZIP. The app reuses the 11 high-resolution studio images from `Art-v2-`, the 52 museum image URLs in its ArtFlip index, and Shisei's standard/general CC0 pose references. This avoids re-uploading duplicate images and preserves original source records. Museum image hosts and raw GitHub URLs require an internet connection; the gallery will still show the studio cards if the remote museum catalogue script cannot load.

## Privacy and service limits

- Saved artwork IDs and the age self-attestation are stored in local browser storage only.
- No app backend, profile account, remote image upload, analytics, checkout or cross-device sync is added.
- The self-attestation is not formal age verification.
- The prompt builder only assembles text; actual image generation opens the existing Art-v2 Creator. Check the connected provider, model policy, budget and expiry before generating.
- Museum open-access status is taken from the current Art-v2 source index; users should still review each museum's current object page and rights/attribution details before reuse or commercial publication.

## Rollback

The new route is isolated in `/art/`. To roll it back, delete only the `art/` folder and restore the previous link/image paths in root `index.html` and `app.js`. No Phase 2 feature code or local-storage key is migrated or deleted.
