# Phase 3 — AI Creator setup checklist

## Before connecting

- [ ] Publish the static site over HTTPS.
- [ ] Open **AI Creator** and copy the exact redirect URL shown by the page.
- [ ] In Pollinations, create an App Key and register that exact redirect URL.
- [ ] Confirm BYOP / user authorization is enabled for the App Key.
- [ ] Read current image-model prices and account balance. Do not assume every model is free.

## Connect

- [ ] Enter the publishable `pk_...` App Key.
- [ ] Set a conservative Pollen cap and short expiry.
- [ ] Tap **Connect Pollinations**.
- [ ] Review the Pollinations consent screen and approve only what is intended.
- [ ] Return to the site and check that the connection status is shown.
- [ ] Generate one test image using an available official image model.
- [ ] Verify preview, open-full-size and download from Android Chrome.
- [ ] Disconnect and verify generation becomes disabled.

## Security expectations

- The app must never contain a developer `sk_...` secret key.
- The `pk_...` App Key is a public OAuth client identifier and may be stored locally.
- The user-approved access token is stored in tab `sessionStorage`, not local storage or source files.
- The exact redirect URL must be registered with Pollinations; update it after any domain/path change.
- The user chooses a budget cap and expiry on each authorization. Actual usage is governed by Pollinations and the selected model's current price.

## Phase 3 limitation

This code includes the OAuth PKCE flow and API integration, but the following real-world checks are still pending because no Pollinations app key/account was supplied and the current container could not perform reliable browser automation:

- OAuth consent and token exchange on the published host.
- Live model-catalogue CORS and response schema.
- Real image generation, provider moderation and image download.
- Physical Android viewport, touch and accessibility testing.

Do not mark the Creator as production-verified until these are completed.
