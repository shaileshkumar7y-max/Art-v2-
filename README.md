# Naked Canvas — Phase 2 Gallery Merge

A lightweight, Android-first static gallery prototype that combines the strongest *gallery* ideas from the audited repositories into one independent interface.

## What works in this Phase 2 build

- Artwork grid with title, artist, date, medium and museum source.
- Search across artwork title, artist, medium, museum and tags.
- Artwork category filters: all works, paintings, drawings/prints.
- Full-screen artwork viewer with previous/next controls, metadata and official museum-record link.
- Pose atlas with search, category filter and a five-angle viewer (front, three-quarter, side, above, below).
- Favourites for both artworks and poses, saved in this browser using localStorage.
- 18+ acknowledgement screen, light/dark theme toggle and keyboard shortcuts (`/`, `Esc`, left/right arrows in artwork viewer).
- Responsive layout designed for Android portrait screens; no backend or account system.

## Important asset note

This deliverable intentionally does **not** contain copied binary image files. It references source-hosted images directly so the ZIP remains small and the original asset repositories are not mirrored.

- ArtFlip artwork image and thumbnail URLs are referenced from the ArtFlip repository. Each record includes the original museum page and rights status taken from its metadata. Check the museum record before commercial use.
- Pose images are referenced from Shisei's `images/line/w600/` collection. Shisei's image assets carry a separate CC0 1.0 notice; see `SOURCES_AND_LICENCES.md`.
- RuiC-PoseAtlas image assets are not used because its repository explicitly excludes images and thumbnails from its MIT code licence and prohibits redistribution.
- Atelier code is not copied. Its generator will be handled separately in Phase 3 after the external provider and licence conditions are evaluated.

Remote images need an internet connection. If a source host is unavailable, the gallery UI remains available, and image placeholders/error styling will be shown.

## Run locally

No build tooling is needed.

1. Extract the ZIP.
2. Open `index.html` in Chrome, or serve the folder with a static server for a closer GitHub Pages preview.

For Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages deployment

Upload the files in this folder to the root of a repository and select **Settings → Pages → Deploy from a branch → main / root**. This Phase 2 folder is a standalone static site and does not change any existing project repository.

## Known Phase 2 limits

- The gallery uses a small starter sample (4 artworks and 8 general pose sets), not the complete 6,051-work ArtFlip catalogue or the full Shisei library.
- Remote image loading has not been verified on a physical Android handset in this environment.
- Image downloads, AI generation, outfit collections, portrait collections, accounts and cloud sync are intentionally out of scope for Phase 2.
- Some external sources may block hotlinking or change URLs; a later release should use an approved image source strategy and automated link checks.

## QA

Run the included smoke checks from the project root:

```bash
node --check app.js
python -m http.server 8000
```

See `PHASE_2_QA.md` for the checks performed and outstanding manual tests.
