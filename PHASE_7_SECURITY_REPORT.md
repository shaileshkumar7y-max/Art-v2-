# Phase 7 — security hardening report

Audit date: 2026-11-02  
Application: NAKED CANVAS — Art After Dark  
Hosting target: static HTTPS site / GitHub Pages  
Scope: client-side source inspection and static/runtime smoke checks; no server or penetration test.

## Findings addressed in this patch

### 1. Saved shelf input validation

Browser `localStorage` is user-editable. Stored records are now parsed as arrays, normalised, bounded and de-duplicated. IDs and titles are constrained. Image references must be HTTPS, same-origin or safe paths under local `assets/`/`icons/`; traversal segments, backslashes, unexpected schemes and malformed records are dropped before rendering.

### 2. API-provided museum URLs

The Met, Art Institute of Chicago, Cleveland Museum and ArtFlip adapters now validate HTTPS image/source URLs before attaching them to the UI. ArtFlip local thumbnails are restricted to safe project asset paths. Text rendered into HTML templates is HTML-escaped; DOM status/title text is written with `textContent`.

### 3. Pollinations OAuth/session handling

The app does not contain a developer `sk_` token. The user supplies a public `pk_` App Key, then grants their own model/budget consent at the provider. OAuth metadata must advertise HTTPS endpoints on `enter.pollinations.ai`; the redirect is checked against the same origin/path; the saved state and PKCE verifier are checked before code exchange. Only a bounded `sk_` access token with a valid future expiry is retained in `sessionStorage`, and disconnect removes the session token. Model IDs are validated before display/use. Provider-returned image URLs must be HTTPS under `pollinations.ai` or a subdomain. Oversized/malformed base64 image responses are rejected before decode.

**Limit:** This is still a browser-only OAuth client. CORS and the provider's exact current token/expiry behaviour must be tested on the final HTTPS domain. A compromised browser/device or same-origin script can access a client-side session token.

### 4. Service-worker/cache boundaries

Cache version `naked-canvas-shell-v7` replaces the old shell cache. The essential same-origin app shell is cached as a required set; artwork thumbnails are optional cache entries so an optional image failure does not prevent the shell from installing. Cross-origin Pollinations calls, museum API responses, remote source images and bearer tokens are not intercepted or cached by this worker. Only GET requests are handled.

### 5. Browser policy and link isolation

An early HTML meta CSP sets a restrictive default, blocks objects, restricts scripts to same-origin, constrains API connections and form targets, and uses a strict-origin-when-cross-origin referrer policy. External target-blank links use `noopener noreferrer`.

**Important CSP limitation:** The policy is delivered through a `<meta>` element. The W3C specification does not allow meta-delivered CSP to enforce `frame-ancestors`, `sandbox`, `report-uri` or `Content-Security-Policy-Report-Only`. An HTTP response-header CSP is stronger. Ordinary GitHub Pages static project publishing does not provide this project with a normal per-repository custom-header configuration; do not mistake the meta tag for complete server-header hardening. Sources: [W3C CSP Level 3](https://www.w3.org/TR/CSP/) and [GitHub Pages documentation](https://docs.github.com/en/pages).

The current `img-src https:` is intentionally broad to accommodate the museum providers' multiple image hosts. It is a remaining least-privilege improvement to tighten after all live museum image hostnames are captured and audited.

## Remaining risks / not provided by a static site

- There is no backend, account system, server-side permission enforcement, server-side moderation, abuse-rate limiting or admin audit log.
- The 18+ entry screen is only a self-attestation and does not prove age or identity.
- AI prompt keyword checks are UX guardrails only; they are not a moderation service and can be bypassed. Provider moderation and law/host rules still apply.
- Generated ChatGPT Library WebP images are copied into the static app; anyone who can access the public repository/site can also access those files directly. They are not museum public-domain/CC0 works.
- The static build cannot keep user-saved items synchronised between devices. Saved items remain in local browser storage.
- Browser rendering, physical Android acceptance, live OAuth/model generation, external museum API/CORS and live deployment have not been verified here.

## Recommended production hosting posture

For a stronger production policy, use a host that supports security response headers (CSP header with `frame-ancestors`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` and HSTS where appropriate), then test the policy in report-only mode before enforcing a stricter host allow-list. The user should also decide whether to publish the 19 generated Studio images on a public repository/site before upload.

## Verdict

**Client-side hardening implemented; production security acceptance remains pending.** No claim of complete security, age verification or penetration-test clearance is made.
