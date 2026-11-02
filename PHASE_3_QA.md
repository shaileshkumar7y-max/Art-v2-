# Phase 3 QA Report — AI Creator

**Status:** Implementation and static validation complete. Real Pollinations OAuth/generation and device tests remain unverified.

## Added in Phase 3

- [x] New AI Creator navigation item and section; prior gallery/pose/saved sections remain in place.
- [x] Fine-art prompt presets, medium, pose, lighting, palette and size controls.
- [x] Editable final prompt, copy action and inspiration shuffle.
- [x] Live official image-model discovery from Pollinations' public model catalogue.
- [x] OAuth authorization-code flow with PKCE using Pollinations' discovered OAuth metadata.
- [x] User-selected budget cap and expiry passed to the provider consent screen.
- [x] Temporary user-authorized token kept in `sessionStorage`; no API credential embedded in project files.
- [x] Generation request uses bearer authorization and the selected model/prompt/size.
- [x] Image preview, open-full-size and download actions for returned image URL or base64 payload.
- [x] Disconnect action removes the tab's temporary access token.
- [x] Prompt guard blocks common minor/explicit-sex phrases; user-facing note explains it is not full moderation.
- [x] No backend, framework or build step added.

## Static checks completed

- [x] `node --check app.js` passes.
- [x] `node --check creator.js` passes.
- [x] HTML parser accepts `index.html`.
- [x] No duplicate HTML IDs found.
- [x] All statically referenced Creator JS element IDs exist in the HTML.
- [x] Both `app.js` and `creator.js` are referenced from the page.
- [x] No `sk_...` developer key or concrete API credential is included in the source.
- [x] No backend or build dependency introduced.

## Not verified / must test after publishing

- [ ] Register the exact GitHub Pages redirect URI in a Pollinations App Key.
- [ ] Complete Pollinations consent screen and OAuth code/token exchange.
- [ ] Confirm the model catalogue returns the expected schema in Android Chrome.
- [ ] Generate a test image with an actual user-approved balance/budget.
- [ ] Check provider errors for unsupported model/size/moderation or insufficient balance.
- [ ] Verify image preview and full-size open.
- [ ] Verify image download on Android Chrome; cross-origin downloads may need “Open full size” fallback.
- [ ] Verify Disconnect and tab-close behaviour.
- [ ] Inspect on a physical Android phone at narrow portrait width.
- [ ] Screen-reader and full keyboard/accessibility review.

## Current limitations

1. No App Key or user account was provided, so no real generation request was made.
2. The current environment did not provide reliable browser automation; real rendering and interaction are not claimed as tested.
3. Model availability, prices, moderation and CORS behaviour are provider-controlled and can change.
4. The client-side prompt check is a basic guard, not a secure moderation system.
5. The returned image may be hosted by Pollinations and is not saved into this static app's local files.
6. Phase 2 external artwork and pose images remain remote; no binary images are bundled.
