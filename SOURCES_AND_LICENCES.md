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


## Phase 4–5 — Open-access collection sources and local preview assets

Phase 4 introduced 49 curated ArtFlip figure-art records. Phase 5 adds three more image-backed public-domain records (IDs 436003, 435831 and 437827), bringing the seed index to 52. Every selected record was checked against ArtFlip metadata (`isPublicDomain: true`) and a usable museum-hosted full-size image URL. Twenty small 100×100 WebP preview images are now bundled locally under `assets/artflip-thumbs/`; the full-size images are still served by the originating museum. The Collections browser also calls three official museum APIs and displays images from the museum-supplied URLs. Source query, rights flag and museum record URL are retained with each result.

| Source | API / rights check | Image source | Documentation |
|---|---|---|---|
| The Metropolitan Museum of Art | `/public/collection/v1.1/search` + object detail; accept only `isPublicDomain === true` and a non-empty image | `primaryImage` / `primaryImageSmall` returned by the Met | https://metmuseum.github.io/ |
| Art Institute of Chicago | `/api/v1/artworks/search`; constrain `is_public_domain: true`; require `image_id` | Official IIIF Image API URLs from returned `image_id` | https://api.artic.edu/docs/ |
| Cleveland Museum of Art | `/api/artworks/` with `cc0` and `has_image=1`; also require `share_license_status === "CC0"` | Museum-supplied `images.web.url` / `images.print.url` | https://openaccess-api.clevelandart.org/ |

The Met's `/v1.1/search` is used instead of the legacy `/v1/search`, which the current API documentation says was scheduled for retirement on 2026-10-01. The Met documentation also says no API key is required and asks API users to keep request rates within 80 requests/second; this app requests 12 search IDs per batch and fetches details with concurrency capped at four.

The Art Institute's documentation recommends filtering images to records marked public domain and notes the IIIF image URL pattern. Its general record metadata has separate CC0 / CC-BY terms; the UI uses image rights only for the image itself. Cleveland's documentation says CC0 status controls which records provide CC0 images. ArtFlip seed entries preserve the originating museum record link and link back to the exact ArtFlip metadata JSON file for inspection.

## Duplicate handling

ArtFlip records are stored as a small metadata index (`artflip-figure-index.js`); Phase 5 also includes 20 small WebP preview image files. Source IDs are namespaced as `artflip-<id>`. Search results exclude the Phase 2 starter objects by ID and collapse repeated works by normalized title + artist across ArtFlip and live museum APIs. The dynamic library excludes the Phase 2 seed IDs `met-438013`, `met-438661`, `met-337063`, and `mia-1655`. It also skips duplicates by source record ID, normalized title + artist, and normalized image identifier/filename across sources. Only the 20 named CC0 preview thumbnails are copied into the project; no full-size source image dump is mirrored. A complete remote-repository inventory was not available from the connected GitHub account during this phase, so cross-checking any additional files manually added to a private/other repository remains a deployment-time check.

## ArtFlip catalogue note

ArtFlip repository: https://github.com/lewdry/artflip. Its README lists 6,280 public-domain records in the 2026-09-06 count and describes museum sources. That is a general art set, not a verified 6,280-item nude catalogue. Phase 4 searched the `Female Nudes` and `Male Nudes` metadata terms, checked candidate records individually, excluded false-positive/ambiguous matches and records clearly identified as child subjects (including a “Young Girl” bathing record), and retained 49 initial image-available, `isPublicDomain: true` picks; Phase 5 added three additional image-backed public-domain records, bringing the index to 52. The selected artworks use locally bundled CC0 thumbnails for 20 card previews and load full-size artwork from originating museum image URLs. No full-size ArtFlip dump or museum image collection is re-hosted.


## Phase 5 — bundled ArtFlip thumbnails

The following 20 WebP thumbnails are included under `assets/artflip-thumbs/`. They are small 100×100 previews sourced from the ArtFlip repository's `public/thumbs/` folder. The ArtFlip README states that artwork in its collection is from collections released under CC0; the project is a public-domain artwork aggregator. Full-size artwork URLs and museum records remain in the metadata index.

| ArtFlip ID | Local preview | Museum record |
|---|---|---|
| 436003 | `assets/artflip-thumbs/436003.webp` | [The Young Bather](https://www.metmuseum.org/art/collection/search/436003) |
| 436004 | `assets/artflip-thumbs/436004.webp` | [The Woman in the Waves](https://www.metmuseum.org/art/collection/search/436004) |
| 435831 | `assets/artflip-thumbs/435831.webp` | [The Birth of Venus](https://www.metmuseum.org/art/collection/search/435831) |
| 435829 | `assets/artflip-thumbs/435829.webp` | [Echo](https://www.metmuseum.org/art/collection/search/435829) |
| 459191 | `assets/artflip-thumbs/459191.webp` | [Study for Poseuses](https://www.metmuseum.org/art/collection/search/459191) |
| 437827 | `assets/artflip-thumbs/437827.webp` | [Venus and the Lute Player](https://www.metmuseum.org/art/collection/search/437827) |
| 436173 | `assets/artflip-thumbs/436173.webp` | [Woman Having Her Hair Combed](https://www.metmuseum.org/art/collection/search/436173) |
| 435963 | `assets/artflip-thumbs/435963.webp` | [Bacchante by the Sea](https://www.metmuseum.org/art/collection/search/435963) |
| 435965 | `assets/artflip-thumbs/435965.webp` | [Bacchante in a Landscape](https://www.metmuseum.org/art/collection/search/435965) |
| 435739 | `assets/artflip-thumbs/435739.webp` | [The Toilette of Venus](https://www.metmuseum.org/art/collection/search/435739) |
| 436022 | `assets/artflip-thumbs/436022.webp` | [The Source](https://www.metmuseum.org/art/collection/search/436022) |
| 436002 | `assets/artflip-thumbs/436002.webp` | [Woman with a Parrot](https://www.metmuseum.org/art/collection/search/436002) |
| 13070 | `assets/artflip-thumbs/13070.webp` | [The Pleiades](https://www.metmuseum.org/art/collection/search/13070) |
| 256403 | `assets/artflip-thumbs/256403.webp` | [Marble Statue Group of the Three Graces](https://www.metmuseum.org/art/collection/search/256403) |
| 64916 | `assets/artflip-thumbs/64916.webp` | [The Serf](https://www.artic.edu/artworks/64916) |
| 314826 | `assets/artflip-thumbs/314826.webp` | [Male Figure (Moai Tangata)](https://www.metmuseum.org/art/collection/search/314826) |
| 247117 | `assets/artflip-thumbs/247117.webp` | [Bronze statue of Trebonianus Gallus](https://www.metmuseum.org/art/collection/search/247117) |
| 334002 | `assets/artflip-thumbs/334002.webp` | [Seated Giant](https://www.metmuseum.org/art/collection/search/334002) |
| 437784 | `assets/artflip-thumbs/437784.webp` | [Alexander the Great Rescued from the River Cydnus](https://www.metmuseum.org/art/collection/search/437784) |
| 835151 | `assets/artflip-thumbs/835151.webp` | [Paint box with nude study](https://www.metmuseum.org/art/collection/search/835151) |
