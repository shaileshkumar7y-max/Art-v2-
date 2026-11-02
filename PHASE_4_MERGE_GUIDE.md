# Phase 4 — Incremental Merge Guide

This ZIP is an **update patch**, not a second copy of the whole project. It contains only the files changed or added for Phase 4. It contains **no artwork image files**, no pose images, no `creator.js`, and no copy of the existing gallery assets.

## Files in this patch

### Replace these existing project files

- `index.html` — adds the Collections section, controls and script references.
- `styles.css` — adds responsive collection styling and improves card/control readability.
- `app.js` — exposes the existing Saved shelf function to the new Collections section.
- `README.md` — updates the project guide for Phase 4.
- `SOURCES_AND_LICENCES.md` — adds ArtFlip and museum provenance/rights notes.

### Add these new files

- `collections.js` — live museum search, filtering, deduplication, detail modal and save integration.
- `artflip-figure-index.js` — 49 curated public-domain metadata entries with remote museum image URLs.
- `PHASE_4_QA.md` — static QA results and remaining manual tests.
- `PHASE_4_MERGE_GUIDE.md` — this guide.

## Safe merge steps

1. Make a backup of the current repository before replacing anything.
2. Extract this ZIP at the **repository root**, keeping the filenames and folder level exactly as they are in the ZIP.
3. Allow overwrite only for the five files listed under “Replace”; add the four files listed under “Add”.
4. Do not delete your existing `creator.js`, Phase 2 files, pose/image folders, or any other assets.
5. Commit and publish the update. Open the site in Chrome and test Collections, Saved items, Creator, Gallery and Pose Atlas.

## What is fetched remotely

The 49 ArtFlip records are metadata only. Their preview/full image URLs point to the originating museum image hosts. Live API results also load museum images directly. This patch does not download or re-host any of those images. The 49 records are a curated subset, not the complete ArtFlip collection.

## Duplicate limitations

The code excludes the four Phase 2 seed artwork IDs and collapses repeated search results by source ID, normalized title/artist and normalized image identifier/filename. I could not read a complete file inventory of the target GitHub repository during this task, so I cannot certify that there are no duplicates against extra images you may have manually added outside the known Phase 2 package. No duplicate image binaries are added by this patch.
