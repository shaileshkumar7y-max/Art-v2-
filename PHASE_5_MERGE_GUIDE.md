# Phase 5 — incremental merge guide

Apply this patch over the **merged Phase 4 project folder**. It is not a full replacement project.

## Replace these existing files

1. `index.html`
2. `styles.css`
3. `collections.js`
4. `artflip-figure-index.js`
5. `README.md`
6. `SOURCES_AND_LICENCES.md`

## Add these new files

1. `brand-voice.js`
2. `PHASE_5_BRAND_GUIDE.md`
3. `PHASE_5_MERGE_GUIDE.md`
4. `PHASE_5_QA.md`
5. `assets/artflip-thumbs/` — 20 WebP preview files

## Phone workflow (GitHub mobile / browser)

- Extract the patch ZIP on the phone, then open the inner `NAKED_CANVAS_PHASE_5_UPDATE_FILES` folder.
- Copy the contents of that inner folder (including `assets/artflip-thumbs/`) into the existing repository root.
- Compare each of the six replacement files before saving. If you have made later edits to one of those files, merge the Phase 5 changes rather than overwriting your work.
- Upload the new `brand-voice.js`, docs and the complete `assets/artflip-thumbs/` folder.
- Keep `app.js`, `creator.js`, existing Phase 2 pose images and all unrelated files exactly as they are.
- Confirm that `assets/artflip-thumbs/436003.webp` and the other 19 files exist in the same path as the updated HTML expects.
- Test the site from its HTTPS Pages URL, not only from a `file://` preview.

## What changed

- Brand palette, editorial copy, featured artwork strip and small English/Hinglish copy toggle.
- Expanded ArtFlip index from 49 to 52 curated public-domain records.
- Mapped 20 local CC0 WebP thumbnail previews into the ArtFlip index and collection cards.
- Full-size images still load from official museum image URLs; preview thumbnails are local.

No GitHub push or deployment was performed by this patch build.
