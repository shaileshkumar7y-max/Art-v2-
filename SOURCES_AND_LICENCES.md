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
