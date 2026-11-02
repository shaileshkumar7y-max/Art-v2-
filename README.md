# Naked Canvas — Phase 5 Brand & Art Library Build

A lightweight, Android-first static fine-art gallery with a curated open-access figure-art library, pose atlas and AI Creator studio. The project preserves the Phase 2 gallery and Phase 3 Creator, includes 52 curated ArtFlip public-domain figure-art records, 20 locally bundled WebP thumbnails, live search across three museum open-access APIs, and 19 locally bundled user-generated ChatGPT Library figure-study artworks.

## What is included

### Gallery (preserved from Phase 2)
- Artwork grid with title, artist, date, medium and museum source.
- Artwork search and category filters.
- Artwork viewer with previous/next controls, metadata and official museum-record link.
- Pose atlas with search, category filters and a five-angle viewer.
- Browser-local favourites, 18+ acknowledgement, light/dark theme and keyboard shortcuts.

### Art Collections (introduced in Phase 4, expanded in Phase 5)
- A built-in index of 52 ArtFlip figure-art records verified from their metadata for `isPublicDomain: true` and a usable museum-hosted image URL.
- Female and male figure studies, reclining poses, bathers, mythological/classical works, photography, drawings and sculpture/object records.
- Live search across The Met, Art Institute of Chicago and Cleveland Museum open-access catalogues.
- Subject chips, source filter, title/artist sorting, paginated load-more and artwork detail viewer.
- Artwork cards and viewer reuse the existing Saved shelf.
- Duplicate handling checks museum record IDs and normalized title + artist; the four Phase 2 starter records are explicitly excluded.
- Phase 5 bundles 20 small 100×100 WebP previews from ArtFlip’s CC0 thumbnail library. They are local card previews only; full-size artwork remains on the originating museum host and opens from its source URL. The 52 metadata records remain lightweight.

### Local image previews (new in Phase 5)
- 20 small WebP artworks from ArtFlip’s CC0 thumbnail library are included under `assets/artflip-thumbs/`.
- These 100×100 files are lightweight previews; larger images remain linked from official museum hosts.
- The four-image strip on the homepage and the ArtFlip collection cards reuse these same local assets.

### Brand identity (new in Phase 5)
- Refined charcoal, wine, warm-ivory and muted-gold colour system.
- Playfair Display + DM Sans type pairing, consistent monogram and brand language.
- English / Hinglish copy switch with device-local preference; no translation service or backend.
- Premium editorial manifesto and a featured strip using locally bundled ArtFlip thumbnails.
- Tone guidance: confident, flirty and witty in optional Hinglish copy; clean navigation, respectful rights text and non-explicit art framing.

### AI Creator (new in Phase 3)
- Fine-art prompt builder with six presets: academic figure study, draped classical study, gesture drawing, portrait, sculpture study and adult duo composition.
- Controls for medium, pose/composition, lighting, palette and output size.
- Editable final prompt, copy-to-clipboard and inspiration shuffle.
- Live discovery of official Pollinations image models; the model list is not hard-coded.
- Optional Pollinations sign-in using OAuth authorization-code + PKCE (Bring Your Own Pollen / BYOP).
- User-selected budget cap and key expiry are passed to the Pollinations consent screen.
- Generated image preview, open-full-size and download actions.
- Adult-only, non-explicit fine-art framing and basic prompt checks against minor/explicit-sex terms.
- No application backend, no server-held credentials, no framework or build tooling.

## Important: AI generation is not automatically free

Pollinations requires an authorized generation key for current API requests. New browser apps should use its BYOP flow: register a publishable App Key (`pk_...`), let the user approve a scoped key, then send generation calls with that temporary user-authorized key. A `pk_` value identifies the app; it is **not** itself a generation credential.

The user chooses the maximum Pollen budget and expiry in Pollinations' own consent screen. Actual image cost depends on the selected model and its current pricing. Check the live [image model catalogue](https://gen.pollinations.ai/image/models) and your Pollinations balance before generating. This project does not promise a free quota or guarantee a zero-cost image.

### Connect Pollinations on the published site

1. Publish this static folder on an HTTPS host (for example, GitHub Pages). OAuth will not work from a `file://` URL.
2. Open the site and go to **AI Creator**. Tap **Copy this page’s redirect URL**.
3. Sign in to [Pollinations App Keys](https://enter.pollinations.ai/keys), create an App Key for this web app, and add the exact copied redirect URL to that app's allowed redirect URLs. Enable BYOP / user authorization for the app.
4. Copy the resulting public `pk_...` App Key into the Creator and choose a budget cap and expiry.
5. Tap **Connect Pollinations**. Review the Pollinations consent screen carefully and approve only the budget/model permissions you are comfortable with.
6. Return to the Creator. Choose an available model, review the prompt, then generate.

The redirect URL is tied to the published site path. When moving the site to a different domain or path, update the App Key's registered redirect URL.

## Credential and privacy handling

- The public App Key (`pk_...`) is stored in this browser's `localStorage` so it does not need to be re-entered every visit. It is an OAuth client identifier, not a spend credential.
- The scoped user-authorized access token is stored in `sessionStorage` only, for the current browser tab session. It is not written into the source code, ZIP, `localStorage`, or any app server.
- Disconnect removes the tab's stored access token. The user can also revoke/edit approved keys from their Pollinations account.
- The prompt and image request go directly from the browser to Pollinations. Do not enter personal or confidential information into prompts.
- Generated images are not uploaded to this project or persisted by its app code. They are displayed from the returned URL or in-memory image blob.
- This is a static client-side design, not a security boundary. Anyone who can use a device/browser session should be able to access its currently connected session. Disconnect when finished on a shared device.

## Content scope

The Creator is framed for clearly adult, non-explicit academic and classical fine art. It includes a basic client-side prompt check for references to minors and explicit sexual activity, but that check is not a moderation system and can be bypassed. Pollinations and individual model policies/moderation still apply. Do not use this app to generate sexual content involving minors or explicit sexual imagery.

## Run locally

No build tooling is needed.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`. Gallery and prompt-building features can be explored locally. Pollinations OAuth requires a valid registered redirect URI; a public HTTPS deployment is the intended connection flow.

## GitHub Pages deployment

Upload all files in this folder to the root of a repository and select **Settings → Pages → Deploy from a branch → main / root**. This folder is standalone and does not change any existing project repository. Register the final Pages URL as the Pollinations App Key redirect URI after deployment.

## Current known limits

- The original starter gallery remains 4 artwork entries and 8 Shisei pose sets. Phase 5 carries forward 52 curated ArtFlip figure-art picks, 20 local previews and live museum search, not a mirror of any full source repository.
- The 20 bundled ArtFlip WebP previews are 100×100 pixels; larger full-size artwork remains remotely hosted by source museums and requires internet access. ArtFlip’s 6,280-record general catalogue is not a 6,280-item nude-art catalogue.
- AI generation requires the user to create/configure a Pollinations App Key and approve their own budget. No developer key is included.
- The real OAuth, model catalogue and generation calls were not live-tested from this container. Browser CORS, account balance, moderation, region/model availability and provider behaviour must be verified on the published HTTPS site.
- Browser rendering, live museum API/CORS behaviour and physical Android touch testing remain outstanding; headless Chromium was not usable in the prior Phase 2 runtime.
- An 18+ self-acknowledgement is not identity or age verification.

## Smoke checks

```bash
node --check app.js
node --check creator.js
node --check collections.js
node --check artflip-figure-index.js
node --check brand-voice.js
python -m http.server 8000
```

See `PHASE_2_QA.md`, `PHASE_3_QA.md`, `PHASE_4_QA.md` and `PHASE_5_QA.md` for performed checks and remaining manual tests. See `PHASE_5_BRAND_GUIDE.md` and `PHASE_5_MERGE_GUIDE.md` for Phase 5 details. See `PHASE_3_CREATOR_SETUP.md` for the Pollinations setup checklist and `SOURCES_AND_LICENCES.md` for collection provenance.


## Phase 6 — Android / mobile performance

- The initial eleven original figure-study images selected from the user's ChatGPT Library are bundled locally in `assets/my-studio/` as optimized WebP (not ArtFlip images).
- Phase 7 adds eight more distinct ChatGPT Library generations, bringing the My Studio Shelf to nineteen original compositions. The new eight source PNGs total about 25.90 MiB; their WebP derivatives total about 1.30 MiB.
- All nineteen WebP files total about 4.34 MiB. The original Library PNG files are not overwritten or deleted; only optimized copies are included in this app. Gallery cards use lazy loading and asynchronous decoding.
- A versioned service worker caches same-origin HTML, CSS, JavaScript, the manifest, icons, the generated Studio images, and the small local open-access thumbnail set for offline browsing.
- External museum APIs, museum image hosts, Shisei images, Pollinations OAuth and generation endpoints are intentionally not cached. No tokens or API credentials enter the cache.
- A web app manifest and standalone icons support installation on compatible Android browsers.
- Collections and studio art have touch-friendly controls, responsive two-column mobile cards, modal swipe navigation, keyboard actions and reduced-motion support.

The age gate is a self-attestation prompt, not identity or age verification.


## Phase 7 — final hardening, regression checks and additional Library art

- Added eight additional, visually inspected, distinct figure-study compositions from the user's ChatGPT Library: Classical Male Anatomy Study Sheet, Vintage Graphite Figure Study Sheet, Sepia Bathhouse Figure Studies, Classical Atelier Figure Study Sheet, Classical Triptych Life Drawing Studies, Monochrome Figure Study Sketchbook, Classical Charcoal Study of Two Poses, and Graphite Anatomy Study — Ideas 8 and 9.
- My Studio Shelf now contains nineteen AI-generated works in total. They are clearly labelled as user-generated ChatGPT Library art, not museum/public-domain items.
- Added an HTML meta Content Security Policy and strict-origin-when-cross-origin referrer policy. Because GitHub Pages does not provide per-project custom response headers, a meta policy is a client-side defence-in-depth layer, not a substitute for HTTP response headers. Meta CSP cannot express every directive (for example, `frame-ancestors`).
- Saved shelf records are validated and normalised before rendering; invalid IDs, unsafe image schemes and malformed localStorage shapes are discarded from the render model.
- Museum API image and record URLs are constrained to HTTPS before being placed in the gallery.
- Pollinations OAuth discovery endpoints are pinned to the official HTTPS origin; callback state and same-origin redirect are checked; only a short-lived `sk_` token is accepted and kept in sessionStorage; generated media URLs are restricted to Pollinations HTTPS hosts.
- Service-worker cache is versioned `v7`. Essential shell files are precached as a required group; optional local artworks are cached separately so one optional asset failure cannot prevent the app shell from installing. External APIs, OAuth requests, remote images and access tokens are not cached.
- The 18+ gate is a self-attestation only. It does not verify age or identity.

### Phase 7 release limits

- This is a static GitHub Pages-compatible app. There is no server-side session, server-side moderation, admin console or server-side security boundary.
- The HTML CSP is intentionally compatible with the project's external fonts, image hosts and API endpoints. Its `img-src https:` allowance is broader than a strict host allow-list because the museum catalogue uses multiple image hosts; tighten that list only after live museum API URLs have been audited.
- OAuth provider behaviour, Pollinations CORS/token exchange, current model catalogue, real image generation, and all three museum APIs still require a live HTTPS/browser test.
- Browser automation and physical Android testing were not completed in this environment. See `PHASE_7_QA.md` for exact pass/pending status.
- Before a public deployment, inspect the generated Library images and confirm that you intend these artistic-nudity images to be visible to anyone who can access the public repository/site. Review the hosting provider's current content rules before publishing.
