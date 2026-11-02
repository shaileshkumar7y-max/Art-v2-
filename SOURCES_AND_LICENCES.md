# Sources, image rights and third-party notices

This is an independent Phase 2 implementation. It uses source-hosted media URLs and does not copy the third-party source code into this folder.

## Artworks — ArtFlip and museum records

Gallery source project: https://github.com/lewdry/artflip (MIT licence applies to its code; it does not replace the rights status of each museum artwork).

The following artwork metadata was inspected in ArtFlip's `public/metadata/` directory. ArtFlip metadata marks each listed record `isPublicDomain: true`; the museum record remains the primary provenance and rights reference.

| Work | Artist | Date | Museum record | Metadata file |
|---|---|---:|---|---|
| Reclining Nude | Auguste Renoir | 1883 | https://www.metmuseum.org/art/collection/search/438013 | https://github.com/lewdry/artflip/blob/main/public/metadata/438013.json |
| Study of a Female Nude | Henri Lehmann | 1840 | https://www.metmuseum.org/art/collection/search/438661 | https://github.com/lewdry/artflip/blob/main/public/metadata/438661.json |
| Reclining Female Nude | Rembrandt van Rijn | 1658 | https://www.metmuseum.org/art/collection/search/337063 | https://github.com/lewdry/artflip/blob/main/public/metadata/337063.json |
| Nude on a Couch | Gustave Caillebotte | c. 1880 | https://collections.artsmia.org/art/1655 | https://github.com/lewdry/artflip/blob/main/public/metadata/mia-1655.json |

Image delivery URLs currently reference ArtFlip's repository paths:

- `https://raw.githubusercontent.com/lewdry/artflip/main/public/images/<id>.jpg`
- `https://raw.githubusercontent.com/lewdry/artflip/main/public/thumbs/<id>.webp`

These external URLs are not included as binary files in this ZIP. Rights should be rechecked against the museum record before any commercial campaign, paid product or redistribution.

## Pose references — Shisei

Source project: https://github.com/wquguru/shisei

- Code licence: Apache License 2.0.
- Image licence: CC0 1.0 Universal, separately stated in `LICENSE-images`.
- This Phase 2 app references only the standard/general pose line-art paths `images/line/w600/std_P001_*.webp`, `std_P015_*.webp`, `std_P032_*.webp`, `std_P049_*.webp`, `std_P058_*.webp`, `std_P064_*.webp`, `std_P070_*.webp` and `std_P073_*.webp`; suggestive categories are not included in the starter sample.
- Image path format: `https://raw.githubusercontent.com/wquguru/shisei/main/images/line/w600/<filename>`.

The selected images are source-hosted and not mirrored into this project. Source project and image licence are linked above for provenance.

## RuiC-PoseAtlas

Source project: https://github.com/HRuiCcc/RuiC-PoseAtlas

Its MIT licence applies to project code, styles, scripts and documentation but explicitly excludes `img/`, `thumbs/` and source records. Its README states that image data may not be redistributed, reposted or resold. This Phase 2 build uses no RuiC image assets.

## Atelier — Figure Study Studio

Source project: https://github.com/tayshie/atelier-figure-studio

The repository's generator interface and controls were reviewed as feature references only. No Atelier code or assets are copied into this build; no top-level project licence was confirmed during Phase 1.

## General notice

This is an adult-oriented academic/classical fine-art reference gallery. The current sample is intended for non-explicit presentation. All third-party titles, artist names, records and media remain subject to their source rights and terms.

## Phase 3 Creator service documentation

The AI Creator integration is implemented against Pollinations' documented user-authorized BYOP / OAuth PKCE flow. The application does not include a developer secret key. A public App Key identifies the client; the user authorizes a scoped key and chooses the budget/expiry. All generation costs and model restrictions are controlled by Pollinations and the selected model.

- Pollinations API documentation: https://gen.pollinations.ai/
- Pollinations BYOP / App Key guidance: https://github.com/pollinations/pollinations/blob/main/enter.pollinations.ai/POLLEN_FAQ.md
- OAuth PKCE guide and discovery notes: https://github.com/pollinations/pollinations/blob/main/enter.pollinations.ai/AGENTS.md
- Official image-model catalogue: https://gen.pollinations.ai/image/models

Pollinations is a third-party service with its own terms, model restrictions, moderation and data handling. Prompts and generation requests are sent directly to Pollinations. Review its current policies before use. This project does not claim that all models or all image generations are free.


## Phase 4 — Live open-access collection sources

Phase 4 adds 49 metadata-only ArtFlip figure-art picks selected from its public-domain tags and verified full metadata records (`isPublicDomain: true` plus a non-empty `primaryImage`). Their image URLs point directly to the originating museum; no ArtFlip image or museum image binary is copied into this repository. The Collections browser also calls three official museum APIs and displays images from each museum-supplied URL. Source query, rights flag and museum record URL are retained with each result.

| Source | API / rights check | Image source | Documentation |
|---|---|---|---|
| The Metropolitan Museum of Art | `/public/collection/v1.1/search` + object detail; accept only `isPublicDomain === true` and a non-empty image | `primaryImage` / `primaryImageSmall` returned by the Met | https://metmuseum.github.io/ |
| Art Institute of Chicago | `/api/v1/artworks/search`; constrain `is_public_domain: true`; require `image_id` | Official IIIF Image API URLs from returned `image_id` | https://api.artic.edu/docs/ |
| Cleveland Museum of Art | `/api/artworks/` with `cc0` and `has_image=1`; also require `share_license_status === "CC0"` | Museum-supplied `images.web.url` / `images.print.url` | https://openaccess-api.clevelandart.org/ |

The Met's `/v1.1/search` is used instead of the legacy `/v1/search`, which the current API documentation says was scheduled for retirement on 2026-10-01. The Met documentation also says no API key is required and asks API users to keep request rates within 80 requests/second; this app requests 12 search IDs per batch and fetches details with concurrency capped at four.

The Art Institute's documentation recommends filtering images to records marked public domain and notes the IIIF image URL pattern. Its general record metadata has separate CC0 / CC-BY terms; the UI uses image rights only for the image itself. Cleveland's documentation says CC0 status controls which records provide CC0 images. ArtFlip seed entries preserve the originating museum record link and link back to the exact ArtFlip metadata JSON file for inspection.

## Duplicate handling

ArtFlip records are stored as a small metadata index (`artflip-figure-index.js`), not as image files. Source IDs are namespaced as `artflip-<id>`. Search results exclude the Phase 2 starter objects by ID and collapse repeated works by normalized title + artist across ArtFlip and live museum APIs. The dynamic library excludes the Phase 2 seed IDs `met-438013`, `met-438661`, `met-337063`, and `mia-1655`. It also skips duplicates by source record ID, normalized title + artist, and normalized image identifier/filename across sources. No new image file is copied into the project. A complete remote-repository inventory was not available from the connected GitHub account during this phase, so cross-checking any additional files manually added to a private/other repository remains a deployment-time check.

## ArtFlip catalogue note

ArtFlip repository: https://github.com/lewdry/artflip. Its README lists 6,280 public-domain records in the 2026-09-06 count and describes museum sources. That is a general art set, not a verified 6,280-item nude catalogue. Its general source catalogue is not a verified 6,280-item nude catalogue. Phase 4 searched the `Female Nudes` and `Male Nudes` metadata terms, checked candidate records individually, excluded false-positive/ambiguous matches and records clearly identified as child subjects (including a “Young Girl” bathing record), and retained 49 image-available, `isPublicDomain: true` picks. The selected artworks load from the originating museum image URLs; no binary assets, ArtFlip thumbnails or bulk dump are re-hosted.
