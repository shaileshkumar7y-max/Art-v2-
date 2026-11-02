# Naked Canvas — Phase 3 Creator Build

A lightweight, Android-first static fine-art gallery with a new AI Creator studio. This update preserves the Phase 2 artwork gallery, pose atlas, favourites and theme controls, then adds a prompt builder and optional Pollinations image generation connection.

## What is included

### Gallery (preserved from Phase 2)
- Artwork grid with title, artist, date, medium and museum source.
- Artwork search and category filters.
- Artwork viewer with previous/next controls, metadata and official museum-record link.
- Pose atlas with search, category filters and a five-angle viewer.
- Browser-local favourites, 18+ acknowledgement, light/dark theme and keyboard shortcuts.

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

- The starter gallery remains intentionally small: 4 artwork entries and 8 Shisei pose sets, not the full source repositories.
- Source gallery images are remote references; the ZIP does not bundle the binary images.
- AI generation requires the user to create/configure a Pollinations App Key and approve their own budget. No developer key is included.
- The real OAuth, model catalogue and generation calls were not live-tested from this container. Browser CORS, account balance, moderation, region/model availability and provider behaviour must be verified on the published HTTPS site.
- Browser rendering and physical Android touch testing remain outstanding; headless Chromium was not usable in the prior Phase 2 runtime.
- An 18+ self-acknowledgement is not identity or age verification.

## Smoke checks

```bash
node --check app.js
node --check creator.js
python -m http.server 8000
```

See `PHASE_2_QA.md` and `PHASE_3_QA.md` for performed checks and remaining manual tests. See `PHASE_3_CREATOR_SETUP.md` for the Pollinations setup checklist.
