# Phase 3 — Halloween 2027 experience and QA

## Implemented

- Halloween 2027 seasonal campaign section
- After Dark hero with seasonal countdown to 31 October 2027 (India time, UTC+05:30)
- Three seasonal creative directions: Midnight Lace, Velvet Shadow and Ember Rose
- Campaign wall with existing New-product- image assets
- Mystery Mood Wheel with six outcomes and section navigation
- Responsive desktop/tablet/mobile layout
- Accessible labels, live result announcements, keyboard focus styles and reduced-motion handling
- Failed remote images are marked unavailable without breaking the page
- Service-worker cache version advanced to v8 and new local CSS/JS added to the required shell list

## Source image paths referenced

These paths were confirmed present in the New-product- repository's main tree on 2026-11-02:

- `blacked-luxury-campaign.webp`
- `black-lace-collection.webp`
- `blxcked-luxury-night.webp`
- `blxcked-runway.webp`
- `after-dark-detail.webp`
- `her-after-dark.webp`

The images are loaded from `https://raw.githubusercontent.com/shaileshkumar7y-max/New-product-/main/`. They are not duplicated in this ZIP. Campaign visuals require an internet connection; the existing service worker does not cache third-party image hosts.

## Static checks expected after upload

Run from the repository root:

```sh
node --check halloween.js
node --check app.js
node --check creator.js
node --check collections.js
python -m json.tool manifest.webmanifest >/dev/null
```

Also verify:
- `index.html` loads both `halloween.css` and `halloween.js`.
- The Halloween nav item scrolls to `#halloween-section`.
- Countdown updates and reaches zero after the target date.
- Mood wheel selects one of six outcomes and its Explore button scrolls correctly.
- Existing artwork modal, Pose Atlas, Creator, Saved Shelf, light/dark theme and EN/HI toggle still work.
- Reopen the site twice after the service worker updates; check online and offline app-shell behaviour.

## Not claimed as tested

- No physical Android phone/Chrome test was possible in this build environment.
- No live GitHub Pages deployment or browser-render test was completed.
- Remote image rendering is not guaranteed when GitHub raw image hosting is unavailable or the device is offline.
- The Halloween wheel is a local creative picker, not an online prize/discount or payment system.
- No product cart, checkout, shared account, server-side vote counter or admin analytics is included in Phases 1–3.

## Phase 3 verdict

The seasonal experience is implemented as a static, namespaced enhancement. Production acceptance remains pending upload, Android tap/scroll testing and live image verification.

## Additional Phase 1 asset-path repair included in this package

- `index.html` and `manifest.webmanifest` now refer to the tracked root `app-192.png` and `app-512.png` files.
- `library-art.js` now loads the 19 Studio WebP assets from their actual repository-root paths.
- `asset-path-fix.js` remaps ArtFlip thumbnails from the absent `assets/artflip-thumbs/` directory to the verified root image filenames before Collections consumes the data, and repairs old nested Saved Shelf image URLs in the DOM.
- `sw.js` v8 precaches the correct root icon and image paths rather than absent `icons/` and `assets/` directories.
