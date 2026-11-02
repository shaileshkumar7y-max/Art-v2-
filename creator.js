'use strict';

(() => {
  const API_BASE = 'https://gen.pollinations.ai';
  const OAUTH_DISCOVERY = 'https://enter.pollinations.ai/.well-known/oauth-authorization-server';
  const CLIENT_ID_STORAGE = 'naked-canvas-pollinations-client-id';
  const TOKEN_STORAGE = 'naked-canvas-pollinations-session-token';
  const TOKEN_EXPIRY_STORAGE = 'naked-canvas-pollinations-session-expiry';
  const VERIFIER_STORAGE = 'naked-canvas-pollinations-pkce-verifier';
  const STATE_STORAGE = 'naked-canvas-pollinations-oauth-state';
  const REDIRECT_STORAGE = 'naked-canvas-pollinations-oauth-redirect';
  const CLIENT_TEMP_STORAGE = 'naked-canvas-pollinations-oauth-client';

  const $ = id => document.getElementById(id);
  const controls = [
    'pollinationsClientId', 'creatorBudget', 'creatorExpiry', 'creatorPreset',
    'creatorMedium', 'creatorPose', 'creatorLighting', 'creatorPalette',
    'creatorSubject', 'creatorModel', 'creatorSize', 'creatorPrompt'
  ];
  if (!controls.every(id => $(id))) return;

  let accessToken = '';
  let currentImageUrl = '';
  let currentImageBlobUrl = '';
  let modelCatalog = [];

  const presetDescriptions = {
    academic: 'A museum-quality academic figure study with careful observation of gesture, balance, proportion and silhouette; tasteful, non-explicit classical art direction',
    draped: 'A dignified classical adult figure with elegant draped fabric, sculptural folds and a timeless atelier atmosphere; tasteful, non-explicit fine art',
    gesture: 'A professional life-drawing session with a clearly adult, fully clothed artist model; expressive gesture, confident line and natural body mechanics',
    portrait: 'An intimate but non-sexual fine-art portrait of a clearly adult subject; expressive eyes, thoughtful character and painterly presence',
    sculpture: 'A classical marble sculpture study of an idealised adult human form; museum lighting, sculptural planes and respectful academic presentation',
    duo: 'Two clearly adult art models in a graceful, non-romantic studio composition; coordinated gesture, balanced silhouettes and respectful personal space'
  };

  const inspirationIdeas = [
    'A confident adult art model in a calm studio, elegant posture and expressive silhouette',
    'A thoughtful adult model beside a tall atelier window, quiet presence and graceful gesture',
    'A classical adult figure study with flowing fabric, natural posture and sculptural light',
    'An adult portrait subject in a moody artist studio, subtle expression and rich atmosphere',
    'Two adult models arranged in a balanced, non-contact composition for a life-drawing study'
  ];

  function cleanPageUrl() {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    return url.href;
  }

  function setAuthStatus(message, state = '') {
    const status = $('creatorAuthStatus');
    status.classList.remove('connected', 'error');
    if (state) status.classList.add(state);
    status.lastElementChild.textContent = message;
  }

  function setGenerationStatus(message, state = '') {
    const status = $('creatorGenerationStatus');
    status.classList.remove('error', 'success');
    if (state) status.classList.add(state);
    status.textContent = message;
  }

  function getLiveToken() {
    try {
      const expiry = Number(sessionStorage.getItem(TOKEN_EXPIRY_STORAGE) || 0);
      const token = sessionStorage.getItem(TOKEN_STORAGE) || '';
      if (token && /^sk_[A-Za-z0-9_-]{8,}$/.test(token) && Number.isFinite(expiry) && expiry > Date.now()) return token;
      sessionStorage.removeItem(TOKEN_STORAGE);
      sessionStorage.removeItem(TOKEN_EXPIRY_STORAGE);
    } catch (_) {}
    return '';
  }

  function setConnectedUI(connected) {
    $('connectPollinations').classList.toggle('hidden', connected);
    $('disconnectPollinations').classList.toggle('hidden', !connected);
    $('generateCreatorImage').disabled = !connected || !modelCatalog.length;
    $('creatorConnectionTitle').textContent = connected ? 'Your image studio is connected' : 'Connect your image studio';
    if (connected) setAuthStatus('Connected for this tab · user-approved Pollen budget applies', 'connected');
    else setAuthStatus('Not connected · prompt builder is ready');
  }

  async function discoverOAuthMetadata() {
    const response = await fetch(OAUTH_DISCOVERY, { method: 'GET', cache: 'no-store' });
    if (!response.ok) throw new Error(`Could not load Pollinations sign-in details (${response.status}).`);
    const metadata = await response.json();
    if (!metadata.authorization_endpoint || !metadata.token_endpoint) {
      throw new Error('Pollinations sign-in metadata is missing required OAuth endpoints.');
    }
    const trustedOrigin = 'https://enter.pollinations.ai';
    const authorizationEndpoint = new URL(metadata.authorization_endpoint);
    const tokenEndpoint = new URL(metadata.token_endpoint);
    if ([authorizationEndpoint, tokenEndpoint].some(endpoint => endpoint.protocol !== 'https:' || endpoint.origin !== trustedOrigin || endpoint.username || endpoint.password)) {
      throw new Error('Pollinations returned an untrusted sign-in endpoint. Connection stopped for safety.');
    }
    return { ...metadata, authorization_endpoint: authorizationEndpoint.href, token_endpoint: tokenEndpoint.href };
  }

  function randomBase64Url(byteCount = 32) {
    const bytes = new Uint8Array(byteCount);
    crypto.getRandomValues(bytes);
    let binary = '';
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  async function createCodeChallenge(verifier) {
    const input = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', input);
    const bytes = new Uint8Array(digest);
    let binary = '';
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  async function connectPollinations() {
    const clientId = $('pollinationsClientId').value.trim();
    if (!/^pk_[A-Za-z0-9_-]{8,}$/.test(clientId)) {
      setAuthStatus('Enter a valid Pollinations App Key beginning with pk_.', 'error');
      $('pollinationsClientId').focus();
      return;
    }
    if (!window.isSecureContext && location.hostname !== 'localhost') {
      setAuthStatus('Sign-in needs HTTPS. Open the published GitHub Pages URL, not a local file.', 'error');
      return;
    }

    const budget = Number($('creatorBudget').value);
    if (!Number.isFinite(budget) || budget < 0.1 || budget > 100) {
      setAuthStatus('Set a consent budget between 0.1 and 100 Pollen.', 'error');
      $('creatorBudget').focus();
      return;
    }

    $('connectPollinations').disabled = true;
    setAuthStatus('Preparing secure sign-in…');
    try {
      const metadata = await discoverOAuthMetadata();
      const verifier = randomBase64Url(48);
      const challenge = await createCodeChallenge(verifier);
      const state = randomBase64Url(32);
      const redirectUri = cleanPageUrl();
      const expiry = $('creatorExpiry').value;

      sessionStorage.setItem(VERIFIER_STORAGE, verifier);
      sessionStorage.setItem(STATE_STORAGE, state);
      sessionStorage.setItem(REDIRECT_STORAGE, redirectUri);
      sessionStorage.setItem(CLIENT_TEMP_STORAGE, clientId);
      localStorage.setItem(CLIENT_ID_STORAGE, clientId);

      const authorizeUrl = new URL(metadata.authorization_endpoint);
      authorizeUrl.searchParams.set('response_type', 'code');
      authorizeUrl.searchParams.set('client_id', clientId);
      authorizeUrl.searchParams.set('redirect_uri', redirectUri);
      authorizeUrl.searchParams.set('state', state);
      authorizeUrl.searchParams.set('code_challenge', challenge);
      authorizeUrl.searchParams.set('code_challenge_method', 'S256');
      authorizeUrl.searchParams.set('models', 'image');
      authorizeUrl.searchParams.set('budget', String(budget));
      authorizeUrl.searchParams.set('expiry', expiry);
      window.location.assign(authorizeUrl.toString());
    } catch (error) {
      $('connectPollinations').disabled = false;
      setAuthStatus(error.message || 'Could not start Pollinations sign-in.', 'error');
    }
  }

  async function handleOAuthCallback() {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const oauthError = url.searchParams.get('error');
    if (!code && !oauthError) return;

    const returnedState = url.searchParams.get('state') || '';
    let expectedState = '', verifier = '', redirectUri = cleanPageUrl(), clientId = '';
    try {
      expectedState = sessionStorage.getItem(STATE_STORAGE) || '';
      verifier = sessionStorage.getItem(VERIFIER_STORAGE) || '';
      redirectUri = sessionStorage.getItem(REDIRECT_STORAGE) || cleanPageUrl();
      clientId = sessionStorage.getItem(CLIENT_TEMP_STORAGE) || localStorage.getItem(CLIENT_ID_STORAGE) || '';
    } catch (_) {
      window.history.replaceState({}, document.title, cleanPageUrl());
      setAuthStatus('Browser session storage is unavailable. Reopen the page in a normal browser tab and connect again.', 'error');
      return;
    }
    window.history.replaceState({}, document.title, cleanPageUrl());

    if (oauthError) {
      clearOAuthScratch();
      setAuthStatus(oauthError === 'access_denied' ? 'Connection cancelled. You have not been connected.' : `Sign-in was not completed: ${oauthError}.`, 'error');
      return;
    }
    let callbackMatches = false;
    try {
      const savedRedirect = new URL(redirectUri);
      callbackMatches = savedRedirect.origin === window.location.origin && savedRedirect.pathname === window.location.pathname && !savedRedirect.search && !savedRedirect.hash;
    } catch (_) {}
    if (!code || !returnedState || returnedState !== expectedState || !verifier || !/^pk_[A-Za-z0-9_-]{8,}$/.test(clientId) || !callbackMatches) {
      clearOAuthScratch();
      setAuthStatus('Sign-in callback could not be verified. Start the connection again.', 'error');
      return;
    }

    setAuthStatus('Securely completing your Pollinations connection…');
    try {
      const metadata = await discoverOAuthMetadata();
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        redirect_uri: redirectUri,
        code_verifier: verifier
      });
      const response = await fetch(metadata.token_endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });
      const tokenData = await response.json().catch(() => ({}));
      if (!response.ok || !tokenData.access_token) {
        const reason = tokenData.error_description || tokenData.message || tokenData.error || `HTTP ${response.status}`;
        throw new Error(`Pollinations connection failed: ${reason}`);
      }
      if (!/^sk_[A-Za-z0-9_-]{8,}$/.test(String(tokenData.access_token))) {
        throw new Error('Pollinations returned an unexpected credential format. No token was stored.');
      }
      const reportedExpiry = Number(tokenData.expires_in);
      const lifetimeSeconds = Number.isFinite(reportedExpiry) && reportedExpiry > 0 ? Math.min(reportedExpiry, 30 * 24 * 60 * 60) : 60 * 60;
      const expiresAt = Date.now() + lifetimeSeconds * 1000;
      sessionStorage.setItem(TOKEN_STORAGE, tokenData.access_token);
      sessionStorage.setItem(TOKEN_EXPIRY_STORAGE, String(expiresAt));
      accessToken = tokenData.access_token;
      clearOAuthScratch();
      setConnectedUI(true);
      setGenerationStatus('Connected. Review the selected model and prompt, then generate when ready.');
    } catch (error) {
      clearOAuthScratch();
      setAuthStatus(error.message || 'Could not complete Pollinations connection.', 'error');
    }
  }

  function clearOAuthScratch() {
    [VERIFIER_STORAGE, STATE_STORAGE, REDIRECT_STORAGE, CLIENT_TEMP_STORAGE].forEach(key => {
      try { sessionStorage.removeItem(key); } catch (_) {}
    });
  }

  async function loadImageModels() {
    const select = $('creatorModel');
    select.innerHTML = '<option value="">Loading official image models…</option>';
    try {
      const response = await fetch(`${API_BASE}/image/models?source=official`, { method: 'GET', cache: 'no-store' });
      if (!response.ok) throw new Error(`Catalogue request returned ${response.status}`);
      const payload = await response.json();
      const rows = Array.isArray(payload) ? payload : (payload.data || payload.models || []);
      modelCatalog = rows.filter(model => model && typeof model.id === 'string' && /^[A-Za-z0-9._:/-]{1,120}$/.test(model.id) && String(model.type || model.modality || 'image').toLowerCase() !== 'video');
      if (!modelCatalog.length) throw new Error('No official image models were returned.');
      select.innerHTML = '';
      modelCatalog.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        const label = model.name || model.title || model.id;
        option.textContent = `${label} · ${model.id}`;
        select.appendChild(option);
      });
      const preferred = modelCatalog.find(model => model.id === 'flux') || modelCatalog[0];
      select.value = preferred.id;
      $('creatorModelNote').textContent = `Loaded ${modelCatalog.length} official image models. Prices and supported sizes may differ by model; check the live catalogue before generation.`;
    } catch (error) {
      modelCatalog = [];
      select.innerHTML = '<option value="">Model catalogue unavailable</option>';
      $('creatorModelNote').textContent = 'Could not load the live catalogue. Check your connection and reload the page; no model or price has been assumed.';
      setGenerationStatus(error.message || 'Could not load image models.', 'error');
    }
    setConnectedUI(Boolean(accessToken));
  }

  function buildPrompt() {
    const direction = $('creatorSubject').value.trim();
    if (!direction) {
      setGenerationStatus('Add a short creative direction first.');
      $('creatorSubject').focus();
      return '';
    }
    const prompt = [
      presetDescriptions[$('creatorPreset').value] || presetDescriptions.academic,
      direction,
      `Pose and composition: ${$('creatorPose').value}.`,
      `Art medium and technique: ${$('creatorMedium').value}.`,
      `Lighting: ${$('creatorLighting').value}.`,
      `Colour direction: ${$('creatorPalette').value}.`,
      'Clearly adult subjects only, non-explicit fine-art presentation, respectful academic art context, natural anatomy, carefully observed proportions, believable hands, considered composition, refined detail, no minors, no sexual activity.'
    ].join(' ');
    $('creatorPrompt').value = prompt;
    setGenerationStatus('Prompt ready. You can edit it before generating.');
    return prompt;
  }

  function promptSafetyMessage(prompt) {
    const minorTerms = /\b(child|children|kid|kids|minor|underage|teen|teenager|schoolgirl|schoolboy|loli|shota|preteen|toddler|infant)\b/i;
    const explicitTerms = /\b(explicit sex|sexual intercourse|penetration|pornographic|pornography|sexual act|genitals exposed for sex)\b/i;
    if (minorTerms.test(prompt)) return 'This studio is restricted to clearly adult art subjects. Remove any reference to minors or underage people.';
    if (explicitTerms.test(prompt)) return 'This creator supports non-explicit fine-art imagery only. Please revise the prompt to an academic or artistic direction.';
    return '';
  }

  async function generateImage() {
    if (!accessToken) {
      setGenerationStatus('Connect Pollinations first. Your prompt can still be built and copied without connecting.');
      return;
    }
    const prompt = $('creatorPrompt').value.trim() || buildPrompt();
    if (!prompt) return;
    const safetyMessage = promptSafetyMessage(prompt);
    if (safetyMessage) {
      setGenerationStatus(safetyMessage, 'error');
      return;
    }
    const model = $('creatorModel').value;
    if (!model) {
      setGenerationStatus('Choose an image model from the live catalogue.', 'error');
      return;
    }

    const button = $('generateCreatorImage');
    button.disabled = true;
    button.textContent = 'Creating…';
    setGenerationStatus('Sending your prompt to Pollinations. Generation may take a little while…');
    try {
      const response = await fetch(`${API_BASE}/v1/images/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          prompt,
          size: $('creatorSize').value,
          n: 1,
          response_format: 'url'
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const details = result.error?.message || result.error || result.message || `HTTP ${response.status}`;
        const hint = response.status === 401 ? ' Reconnect Pollinations.' : response.status === 402 ? ' Your approved Pollen budget or available balance may be exhausted.' : '';
        throw new Error(`Generation failed: ${details}.${hint}`);
      }
      const item = Array.isArray(result.data) ? result.data[0] : null;
      if (!item) throw new Error('The provider returned no image. Try another model or prompt.');
      if (item.url) {
        const providerUrl = new URL(item.url, API_BASE);
        const host = providerUrl.hostname.toLowerCase();
        const pollinationsHost = host === 'pollinations.ai' || host.endsWith('.pollinations.ai');
        if (providerUrl.protocol !== 'https:' || !pollinationsHost || providerUrl.username || providerUrl.password) {
          throw new Error('The provider returned an image URL outside the trusted Pollinations domain.');
        }
        currentImageUrl = providerUrl.href;
        if (currentImageBlobUrl) URL.revokeObjectURL(currentImageBlobUrl);
        currentImageBlobUrl = '';
      } else if (item.b64_json) {
        if (typeof item.b64_json !== 'string' || item.b64_json.length > 16000000 || !/^[A-Za-z0-9+/]*={0,2}$/.test(item.b64_json)) {
          throw new Error('The generated image payload is malformed or larger than the 12 MB decoded safety limit.');
        }
        const binary = atob(item.b64_json);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
        const blob = new Blob([bytes], { type: 'image/png' });
        currentImageBlobUrl = URL.createObjectURL(blob);
        currentImageUrl = currentImageBlobUrl;
      } else {
        throw new Error('The provider response did not include a supported image URL or image payload.');
      }
      $('creatorOutputImage').src = currentImageUrl;
      $('creatorOutputImage').classList.remove('hidden');
      $('creatorOutput').querySelector('.creator-output-placeholder').classList.add('hidden');
      $('creatorOutputActions').classList.remove('hidden');
      setGenerationStatus(`Artwork generated with ${model}. Check the result and download it if you like.`, 'success');
    } catch (error) {
      setGenerationStatus(error.message || 'Image generation failed. Please try again.', 'error');
    } finally {
      button.textContent = 'Generate artwork ✦';
      button.disabled = !accessToken || !modelCatalog.length;
    }
  }

  async function copyText(text, successMessage) {
    if (!text.trim()) {
      setGenerationStatus('There is no prompt to copy yet.');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setGenerationStatus(successMessage, 'success');
    } catch (_) {
      const helper = document.createElement('textarea');
      helper.value = text;
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.appendChild(helper);
      helper.select();
      const copied = document.execCommand('copy');
      helper.remove();
      setGenerationStatus(copied ? successMessage : 'Copy was blocked by the browser. Select the text and copy it manually.', copied ? 'success' : 'error');
    }
  }

  async function downloadImage() {
    if (!currentImageUrl) return;
    if (currentImageBlobUrl) {
      saveBlobUrl(currentImageBlobUrl);
      return;
    }
    setGenerationStatus('Preparing your download…');
    try {
      const response = await fetch(currentImageUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('The image host did not allow a direct download.');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      saveBlobUrl(blobUrl);
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
      setGenerationStatus('Download started.', 'success');
    } catch (_) {
      setGenerationStatus('Direct download is blocked by the image host. Use “Open full size”, then save the image from your browser.');
    }
  }

  function saveBlobUrl(url) {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `naked-canvas-art-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  $('connectPollinations').addEventListener('click', connectPollinations);
  $('disconnectPollinations').addEventListener('click', () => {
    accessToken = '';
    try {
      sessionStorage.removeItem(TOKEN_STORAGE);
      sessionStorage.removeItem(TOKEN_EXPIRY_STORAGE);
    } catch (_) {}
    setConnectedUI(false);
    setGenerationStatus('Disconnected. Your App Key remains saved on this device; the approved session token has been cleared.');
  });
  $('pollinationsClientId').addEventListener('change', () => {
    const value = $('pollinationsClientId').value.trim();
    try {
      if (value) localStorage.setItem(CLIENT_ID_STORAGE, value);
      else localStorage.removeItem(CLIENT_ID_STORAGE);
    } catch (_) {}
  });
  $('copyRedirectUri').addEventListener('click', () => copyText(cleanPageUrl(), 'Redirect URL copied. Register this exact URL in your Pollinations App settings.'));
  $('buildCreatorPrompt').addEventListener('click', buildPrompt);
  $('copyCreatorPrompt').addEventListener('click', () => copyText($('creatorPrompt').value, 'Prompt copied to clipboard.'));
  $('shuffleCreatorIdea').addEventListener('click', () => {
    const current = $('creatorSubject').value;
    const choices = inspirationIdeas.filter(idea => idea !== current);
    $('creatorSubject').value = choices[Math.floor(Math.random() * choices.length)] || inspirationIdeas[0];
    buildPrompt();
  });
  $('generateCreatorImage').addEventListener('click', generateImage);
  $('downloadCreatorImage').addEventListener('click', downloadImage);
  $('openCreatorImage').addEventListener('click', () => {
    if (currentImageUrl) window.open(currentImageUrl, '_blank', 'noopener,noreferrer');
  });

  async function init() {
    try {
      $('pollinationsClientId').value = localStorage.getItem(CLIENT_ID_STORAGE) || '';
    } catch (_) {}

    await handleOAuthCallback();
    accessToken = getLiveToken();
    setConnectedUI(Boolean(accessToken));
    await loadImageModels();
    accessToken = getLiveToken();
    setConnectedUI(Boolean(accessToken));
    if (accessToken) setGenerationStatus('Your Pollinations session is connected in this tab.');
    buildPrompt();
  }

  init();
})();
