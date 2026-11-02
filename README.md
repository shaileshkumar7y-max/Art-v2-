# BLACKED PUSSY INNERWEAR — Halloween Mega Merge V1

An Android-first static innerwear brand experience with a curated fine-art gallery, pose atlas, AI Creator studio and a seasonal Halloween 2027 campaign. This incremental release uses `Art-v2-` as the base, preserves its existing gallery and Creator modules, and adds the BLACKED PUSSY brand identity and Halloween campaign hub. It also audits the New-product- and Art- repositories as feature and asset sources without copying complete application roots over one another.

## What is included

### Existing gallery and Creator (preserved)
- Artwork grid with title, artist, date, medium and museum source.
- Artwork search and category filters.
- Artwork viewer with previous/next controls, metadata and official museum-record link.
- Pose Atlas with search, category filters and a five-angle viewer.
- Browser-local favourites, 18+ self-attestation, light/dark theme and English/Hinglish copy switch.
- AI Creator with prompt builder, live model catalogue and optional user-authorised Pollinations BYOP/OAuth flow.
- My Studio shelf and museum/open-access Collections browser.

### Brand transformation (Phase 2)
- Public brand name: **BLACKED PUSSY INNERWEAR**.
- Descriptor: **INNERWEAR · ART AFTER DARK**.
- Midnight black, charcoal/plum, deep wine, muted rose and antique gold colour system.
- Existing Playfair Display + DM Sans typography and theme toggle retained.
- Existing application modules, browser storage keys, gallery data and user favourites retained.

### Halloween 2027 experience (Phase 3)
- Seasonal campaign hero and countdown to 31 October 2027 (India time, UTC+05:30).
- Three editorial directions: Midnight Lace, Velvet Shadow and Ember Rose.
- Campaign wall using existing New-product- image assets.
- Local Mystery Mood Wheel with six moods and links to matching gallery/studio sections.
- Mobile-first layouts, reduced-motion support and safe failed-image handling.

### Three-repository merger plan (Phase 1)
- `Art-v2-` remains the application base.
- `New-product-` is the source for selected innerwear/editorial images and later product/fit-guide integration.
- `Art-` remains the source for a later 47-artwork / 9-collection expansion.
- The separate `show-house.html` mini-game experience is not merged wholesale into the brand's main shopping/art navigation.

## Image paths and compatibility repair

The inspected `Art-v2-` tree stores the 39 WebP files and two PWA PNG icons at repository root. The older source used nested references such as `assets/my-studio/`, `assets/artflip-thumbs/` and `icons/`, although those nested directories are absent from the inspected tree.

This release corrects those paths:
- `library-art.js` points to the root-level 19 My Studio WebP files.
- `asset-path-fix.js` remaps the 20 ArtFlip thumbnail references and repairs legacy Saved Shelf image URLs.
- `index.html` and `manifest.webmanifest` use root-level `app-192.png` / `app-512.png` icon paths.
- The service-worker cache is advanced to v8 and includes the new Halloween assets and asset compatibility file.

Halloween campaign images are loaded from the existing public `New-product-` repository by their current filenames. They are not copied or duplicated in this update package. Those campaign images require an internet connection; the service worker does not cache third-party image hosts.

## Important: AI generation is not automatically free

Pollinations requires an authorised generation key for current API requests. The user must create a publishable App Key (`pk_...`), approve their own scoped key, and choose the budget and expiry at the provider's consent screen. A `pk_` value identifies the app; it is not itself a generation credential. Image generation is not guaranteed free and costs depend on the chosen model and provider terms.

## Credential and privacy handling

- The public App Key is a client identifier; the scoped user-authorised token is kept in the current browser tab session only.
- The app has no application backend and does not include a developer API secret.
- The prompt and generation request are sent directly from the browser to Pollinations.
- Saved artworks, preferences and local campaign-wheel choices remain on this device; there is no cross-device synchronisation in this static build.
- This is not a server-side security boundary. Disconnect authorised services on shared devices.

## Content scope and age notice

The gallery contains adult-oriented, non-explicit fine-art figure-study references and innerwear campaign/editorial imagery. The 18+ entry screen is self-attestation only; it does not verify age or identity. Keep campaign wording and imagery non-explicit, respectful and compliant with the host's current policies.

## Run locally

No build tooling is required. From the repository root:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. Pollinations OAuth requires HTTPS and an exactly registered redirect URL; the published GitHub Pages URL is the intended connection flow.

## GitHub Pages deployment

Upload the contents of the update ZIP to the root of the existing `Art-v2-` repository, replacing only files listed in `UPLOAD-INSTRUCTIONS.md`. Keep the existing application files, root artwork images, icons, `.nojekyll`, museum documentation and all other unlisted files. Under **Settings → Pages → Build and deployment**, use **Deploy from a branch**, branch `main`, folder `/(root)`.

## Smoke checks

Run from the repository root:

```bash
node --check app.js
node --check creator.js
node --check collections.js
node --check artflip-figure-index.js
node --check asset-path-fix.js
node --check library-art.js
node --check halloween.js
python -m json.tool manifest.webmanifest >/dev/null
```

After publishing, test the site twice on Android Chrome so service-worker v8 can activate. Check the Halloween countdown and wheel, brand navigation, gallery search/viewer, Collections thumbnails, My Studio shelf, pose angles, Creator prompt builder, light/dark toggle, Hinglish toggle and Saved Shelf. Live OAuth/generation, live museum APIs and physical Android touch acceptance remain manual tests.

## Existing known limits

- The starter shelf remains four artwork records and eight pose sets; the broader Collections browser uses curated museum records and live museum APIs.
- Museum-hosted full-size works remain remote and depend on museum availability and network access. Confirm provenance and rights at the museum record before using any artwork in paid advertising.
- Pollinations OAuth, current models, CORS, account balance and generation provider behaviour need live HTTPS testing.
- There is no product checkout/cart, online voting, shared account, admin analytics, server-side age verification or server-side moderation in Phases 1–3.
- The Halloween campaign assets reference six existing image files from `New-product-`; the repo must remain public and those filenames must not be changed unless URLs are updated.

## Phase reports

- `PHASE_1_AUDIT.md` — three-repository audit, feature map and root asset-path defect.
- `PHASE_2_BRAND_GUIDE.md` — brand identity and visual system.
- `PHASE_3_HALLOWEEN_QA.md` — seasonal features, source image list and pending live checks.
- `PHASES_1_3_CHANGELOG.md` — concise phase changelog.
- `UPLOAD-INSTRUCTIONS.md` — changed/new file list and Android upload steps.
- `SOURCES_AND_LICENCES.md` — existing source and rights documentation.
