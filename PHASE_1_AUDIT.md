# Phase 1 — Three-repository baseline audit
Audit date: 2026-11-02  
Primary base selected: `shaileshkumar7y-max/Art-v2-` (`main`)  
Status: source/tree/documentation audit completed; final Android visual acceptance remains outstanding.

## Repository inventory

| Repository | Default branch | Tracked files | Main image inventory | Purpose found |
|---|---|---:|---:|---|
| Art-v2- | main | 68 | 39 WebP + 2 PNG | Android-first art archive, pose atlas, open-access collections, AI Creator, Saved shelf and PWA |
| New-product- | main | 102 | 52 WebP + 4 SVG | Innerwear campaign/product visuals, Creator reference workflow, plus a separate local game-show experience |
| Art- | main | 71 | 59 WebP | 47 curated artwork records, 9 collections, search/filter/sort, fullscreen viewer, favourites and recent views |

The Art-v2- main commit inspected for this work was `a81160a18d754e29a2a2adac839beb2d2194b803` (2026-11-02).

## Reusable capabilities mapped

### Art-v2- — keep as the application base
- Starter gallery and museum provenance details
- Expanded open-access museum collection search
- Pose Atlas and multi-angle viewer
- AI Creator with user-authorised Pollinations BYOP/OAuth flow
- Local Saved/Studio shelves, theme and English/Hinglish copy switch
- PWA manifest and versioned service worker

### New-product- — selective innerwear and campaign reuse
- Existing campaign images and product/editorial crops
- Black Lace, After Dark, Blxcked Runway and campaign visual families
- Fit guide and comfort-education assets for a later phase
- Feedback/privacy UI patterns and campaign voting concepts
- Creator reference and generation improvements for a later integration audit

The repository also contains a separate `show-house.html` game-show experience and related mini-games. It is not merged wholesale into the main site because that would mix unrelated journeys and make the brand navigation crowded.

### Art- — future art archive expansion source
- 47 artwork records and 9 named collections
- Collection discovery, quick filters, sort, grid/list and load-more
- Fullscreen viewer, keyboard navigation, mobile swipe/zoom
- Local favourites, recent views, share link and Surprise Me

## Risks and merge rules

1. Do not overwrite the Art-v2- application shell or replace its `app.js`, `creator.js`, gallery data or service worker with same-named files from another repository.
2. All three repositories contain colliding generic filenames (for example `index.html`, `app.js`, `styles.css`). Merge features/data in a namespaced way, not by copying complete root folders over one another.
3. Phase 3 reuses existing New-product- images by public raw paths; no binary images are copied into this update ZIP and no source image master is overwritten.
4. Preserve museum record IDs, metadata, attribution and rights notes. Recheck commercial-use rights before putting museum-derived artwork in paid advertising.
5. The current 18+ gate is a self-attestation only; it is not identity or age verification.
6. Current static/localStorage features are device-local. Shared votes, cross-device accounts, online leaderboards, admin analytics and server permissions require a backend and are not provided by this phase.
7. Pollinations generation requires the user's own authorised key/budget; it is not guaranteed free. Never ship a private provider token in source.

## Phase 1 acceptance
- [x] All three repositories and default branches confirmed
- [x] Recursive source trees inventoried
- [x] README, feature checklist, asset notes, brand guide and security report reviewed
- [x] Base selected: Art-v2-
- [x] Reuse map and collision/security risks documented
- [ ] Android Chrome visual/touch acceptance
- [ ] Final merged image-by-image rights and commercial-use acceptance

## Decision
Build incrementally on Art-v2-. Phase 2 changes visible brand copy and visual tokens without removing the art archive. Phase 3 adds an isolated Halloween experience and reuses existing campaign images by stable public raw paths. Product detail/cart and the 47-artwork integration remain later phases.

## Additional asset-path defect discovered

The actual recursive tree contains the 39 WebP images and the two PWA PNG icons at repository root. However, the live source referenced thumbnails under `assets/artflip-thumbs/`, Studio images under `assets/my-studio/` and icons under `icons/`. Those nested directories were not present in the inspected tree. This mismatch could cause Studio/Collections previews and PWA icon precaching to fail. Phase 1–3 package corrects root icon paths, fixes the 19 Studio image paths, remaps the 20 ArtFlip thumbnail records and includes a guarded compatibility repair for existing Saved Shelf DOM items.
