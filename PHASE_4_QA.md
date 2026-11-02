# Phase 4 QA — Open-access Figure Art Collections

## Implemented

- [x] 49 ArtFlip figure-art records added as a metadata-only index after checking their source JSON for `isPublicDomain: true` and a usable museum image URL; each opens its museum record and ArtFlip metadata JSON.
- [x] Female/male tag-based filters use exact category-prefix matching so “female” is not accidentally treated as “male”; static index count: 39 female-tag records and 16 male-tag records (6 overlap). Also added figure-study, reclining, bather, classical/mythology and sculpture subject filters.
- [x] ArtFlip source-only option plus combined ArtFlip + live museum discovery.
- [x] All new artwork image binaries omitted; images load from originating museum URLs.

- [x] New Collections navigation destination and Android-scrollable navigation integration.
- [x] Eight subject searches: all figure art, female figure, male figure, reclining, bathers, mythology, study/gesture and sculpture.
- [x] Three museum sources: The Met, Art Institute of Chicago, and Cleveland Museum of Art.
- [x] Met current paginated v1.1 search endpoint, with public-domain object-detail verification.
- [x] Art Institute API query constrained to `is_public_domain = true`, requiring an image identifier.
- [x] Cleveland API queried with `cc0` and `has_image=1`, then verifies CC0 on returned records.
- [x] Small paginated loads (12 results per source) and limited Met detail concurrency (4).
- [x] Search box, source selector, sorting, load-more, status/error handling.
- [x] Artwork detail modal with artist, date, medium, image rights note and museum record link.
- [x] Save actions reuse the existing browser favourites shelf.
- [x] Deduplication by source ID, normalized title/artist and normalized image identifier/filename. Phase 2 artwork IDs are explicitly excluded.
- [x] No new image binaries copied into the project; remote museum-hosted image URLs only.
- [x] No backend, account, API key or paid service required for museum browsing.

## Static validation

- [x] JavaScript syntax validation.
- [x] HTML parsing / duplicate ID audit.
- [x] DOM ID reference audit.
- [x] ZIP integrity check (final package).
- [ ] API response integration and CORS test in a real browser.
- [ ] Android Chrome rendering / interaction test.

## Known limitations

- Live API search depends on each museum's network availability, CORS policy and data schema. Browser integration has not yet been exercised in this environment.
- A query term can yield adjacent works that mention the subject in metadata; each card still comes from a museum-approved public-domain / CC0 record with an image.
- The APIs have result limits and different search ranking. Load more retrieves subsequent pages, but no guarantee is made that every nude work held by each museum is discoverable by the text search.
- Museum-hosted image URLs are not copied locally; a source-side image may move or become unavailable.
- The ArtFlip README catalogue count is 6,280 general public-domain artworks (2026-09-06), not 6,280 figure/nude records. Phase 4 includes 49 verified records; more catalogue entries can be researched and added later.
- The connected GitHub account returned no repository inventory during this phase. Duplicate avoidance is therefore confirmed against the four supplied Phase 2 seed records, not against any additional files a user may have manually pushed to an unshared repository.

## Next manual tests

1. Open Collections on GitHub Pages in Android Chrome.
2. Confirm all three sources return JSON without CORS/network errors.
3. Search each chip and test load more, sort and source filter.
4. Test female vs male filters separately; confirm the female filter does not accidentally match the word “male”.
5. Save an artwork; confirm it appears in the existing Saved shelf and remains saved after reload.
6. Open an artwork; confirm its image and museum link work.
7. Confirm the existing gallery, pose atlas and AI Creator still operate.
