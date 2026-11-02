'use strict';

(() => {
  const $ = id => document.getElementById(id);
  const API = {
    met: 'https://collectionapi.metmuseum.org/public/collection/v1.1',
    aic: 'https://api.artic.edu/api/v1',
    cma: 'https://openaccess-api.clevelandart.org/api'
  };
  const PAGE_SIZE = 12;
  const REQUEST_TIMEOUT = 12000;
  const blockedStarterIds = new Set(['met-438013', 'met-438661', 'met-337063', 'mia-1655']);
  const artflipSeed = Array.isArray(window.NAKED_CANVAS_ARTFLIP_FIGURES) ? window.NAKED_CANVAS_ARTFLIP_FIGURES : [];
  const state = {
    query: 'nude', source: 'all', sort: 'relevance', offsets: { met: 0, aic: 1, cma: 0 },
    totals: { artflip: artflipSeed.length, met: null, aic: null, cma: null }, results: [], seenIds: new Set(), seenWorks: new Set(), seenImages: new Set(), loading: false,
    activeItem: null, controllers: []
  };
  const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const text = value => String(value ?? '').trim();
  const safeHttps = (value, fallback = '') => {
    try {
      const url = new URL(String(value ?? ''));
      return url.protocol === 'https:' && !url.username && !url.password ? url.href : fallback;
    } catch (_) { return fallback; }
  };
  const safeImageRef = (value, fallback = '') => {
    const raw = String(value ?? '').trim();
    if (/^assets\/[A-Za-z0-9._/-]+$/.test(raw) && !raw.split('/').includes('..')) return raw;
    return safeHttps(raw, fallback);
  };
  const normalise = value => text(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const parseYear = value => {
    const match = text(value).match(/-?\d{3,4}/);
    return match ? match[0] : text(value) || 'Date unknown';
  };

  async function getJson(url) {
    const controller = new AbortController();
    state.controllers.push(controller);
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    try {
      const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
      return await response.json();
    } finally {
      clearTimeout(timer);
      state.controllers = state.controllers.filter(item => item !== controller);
    }
  }

  function mapMet(record) {
    if (!record || record.isPublicDomain !== true) return null;
    const thumb = safeHttps(record.primaryImageSmall);
    if (!thumb) return null;
    const image = safeHttps(record.primaryImage, thumb);
    const title = text(record.title);
    const artist = text(record.artistDisplayName) || 'Artist not recorded';
    return {
      id: `met-${record.objectID}`, museumKey: 'met', title, artist,
      year: parseYear(record.objectDate), medium: text(record.medium) || 'Medium not recorded',
      museum: 'The Metropolitan Museum of Art', image,
      thumb, sourceUrl: safeHttps(record.objectURL, `https://www.metmuseum.org/art/collection/search/${encodeURIComponent(record.objectID)}`),
      rights: 'Public domain — the museum record marks this object as public domain (CC0 open-access data).',
      kind: text(record.objectName) || text(record.classification) || 'Artwork',
      tags: (record.tags || []).map(item => item.term).filter(Boolean).slice(0, 12)
    };
  }

  function mapAic(record, iiifBase) {
    if (!record || record.is_public_domain !== true || !record.image_id) return null;
    const baseUrl = safeHttps(iiifBase, 'https://www.artic.edu/iiif/2').replace(/\/+$/, '');
    const image = `${baseUrl}/${encodeURIComponent(record.image_id)}/full/1200,/0/default.jpg`;
    const thumb = `${baseUrl}/${encodeURIComponent(record.image_id)}/full/600,/0/default.jpg`;
    return {
      id: `aic-${record.id}`, museumKey: 'aic', title: text(record.title), artist: text(record.artist_title) || 'Artist not recorded',
      year: parseYear(record.date_display), medium: text(record.medium_display) || 'Medium not recorded',
      museum: 'Art Institute of Chicago', image, thumb,
      sourceUrl: `https://www.artic.edu/artworks/${encodeURIComponent(record.id)}`,
      rights: 'Public domain image — the Art Institute record marks this artwork as public domain. Metadata fields carry the museum’s stated CC0/CC-BY terms.',
      kind: text(record.artwork_type_title) || 'Artwork', tags: []
    };
  }

  function mapCma(record) {
    if (!record || String(record.share_license_status).toUpperCase() !== 'CC0') return null;
    const image = safeHttps(record.images?.web?.url || record.images?.print?.url || record.images?.full?.url);
    if (!image) return null;
    const creators = Array.isArray(record.creators) ? record.creators.map(item => item.description || item.name).filter(Boolean) : [];
    return {
      id: `cma-${record.id}`, museumKey: 'cma', title: text(record.title), artist: creators.join(', ') || text(record.tombstone).split(',')[0] || 'Artist not recorded',
      year: parseYear(record.creation_date), medium: text(record.technique) || text(record.medium) || 'Medium not recorded',
      museum: 'Cleveland Museum of Art', image, thumb: safeHttps(record.images?.web?.url, image),
      sourceUrl: safeHttps(record.url, `https://www.clevelandart.org/art/${encodeURIComponent(record.id)}`),
      rights: 'CC0 — the museum record marks the image as open access; copyrighted/non-CC0 images are excluded.',
      kind: text(record.type) || 'Artwork', tags: []
    };
  }

  async function searchMet(query, page) {
    const offset = state.offsets.met;
    const url = `${API.met}/search?${new URLSearchParams({ q: query, hasImages: 'true', offset: String(offset), limit: String(PAGE_SIZE) })}`;
    const result = await getJson(url);
    state.totals.met = Number(result.total || 0);
    const ids = Array.isArray(result.objectIDs) ? result.objectIDs : [];
    const records = await mapLimit(ids, 4, async id => getJson(`${API.met}/objects/${id}`).then(mapMet).catch(() => null));
    state.offsets.met += ids.length;
    return records.filter(Boolean);
  }

  async function searchAic(query, page) {
    const params = {
      q: query,
      query: { term: { is_public_domain: true } },
      page: Math.max(1, page || state.offsets.aic),
      limit: PAGE_SIZE,
      fields: 'id,title,artist_title,date_display,medium_display,image_id,is_public_domain,artwork_type_title'
    };
    const result = await getJson(`${API.aic}/artworks/search?params=${encodeURIComponent(JSON.stringify(params))}`);
    state.totals.aic = Number(result.pagination?.total || 0);
    state.offsets.aic = Number(result.pagination?.current_page || state.offsets.aic) + 1;
    const base = result.config?.iiif_url || 'https://www.artic.edu/iiif/2';
    return (result.data || []).map(item => mapAic(item, base)).filter(Boolean);
  }

  async function searchCma(query, page) {
    const skip = state.offsets.cma;
    const params = new URLSearchParams({ q: query, cc0: '', has_image: '1', limit: String(PAGE_SIZE), skip: String(skip) });
    const result = await getJson(`${API.cma}/artworks/?${params}`);
    state.totals.cma = Number(result.info?.total || result.data?.length || 0);
    const rows = (result.data || []).map(mapCma).filter(Boolean);
    state.offsets.cma += PAGE_SIZE;
    return rows;
  }

  async function mapLimit(items, concurrency, worker) {
    const output = new Array(items.length);
    let next = 0;
    async function run() {
      while (next < items.length) {
        const index = next++;
        output[index] = await worker(items[index], index);
      }
    }
    await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
    return output;
  }

  function mapArtflip(record) {
    if (!record || record.isPublicDomain !== true || !record.id || !record.title) return null;
    const image = safeHttps(record.image);
    const thumb = safeImageRef(record.thumb, image);
    const sourceUrl = safeHttps(record.sourceUrl);
    if (!image || !thumb || !sourceUrl) return null;
    const tags = Array.isArray(record.tags) ? record.tags : [];
    return {
      id: `artflip-${record.id}`, museumKey: 'artflip', title: text(record.title),
      artist: text(record.artist) || 'Artist not recorded', year: text(record.year) || 'Date not recorded',
      medium: text(record.medium) || 'Medium not recorded', museum: `${text(record.museum) || 'Museum collection'} · ArtFlip index`,
      image, thumb, sourceUrl,
      rights: record.thumb ? 'The local preview is included from ArtFlip’s CC0 public-domain thumbnail library. The full-size image remains on the originating museum host; follow the linked museum record for provenance and any credit notes.' : 'ArtFlip metadata marks this object as public domain. The full-size image is loaded from the linked museum image host. Follow the linked museum record for provenance and any credit notes.',
      kind: tags.includes('sculpture') || /bronze|marble|ceramic|terracotta|wood|ivory|alabaster/i.test(record.medium || '') ? 'Sculpture / object' : 'Figure artwork',
      tags, indexSource: 'ArtFlip public-domain metadata', metadataUrl: `https://github.com/lewdry/artflip/blob/main/public/metadata/${record.id}.json`
    };
  }

  function artflipSeedsForQuery(query) {
    const q = normalise(query);
    let rows = artflipSeed.map(mapArtflip).filter(Boolean);
    if (!q || q === 'nude' || q === 'figure art') return rows;
    const queryWords = q.split(' ');
    if (queryWords.includes('female')) rows = rows.filter(item => item.tags.some(tag => normalise(tag).startsWith('female nude')));
    else if (queryWords.includes('male')) rows = rows.filter(item => item.tags.some(tag => normalise(tag).startsWith('male nude')));
    else if (q.includes('reclin')) rows = rows.filter(item => /reclin|lying/i.test(`${item.title} ${item.tags.join(' ')}`));
    else if (q.includes('bather') || q.includes('bath')) rows = rows.filter(item => /bather|bath|river|source/i.test(`${item.title} ${item.tags.join(' ')}`));
    else if (q.includes('venus') || q.includes('myth')) rows = rows.filter(item => /venus|diana|daphne|nymph|myth|judgment of paris|judgement of paris|arcadia|bacch/i.test(`${item.title} ${item.tags.join(' ')}`));
    else if (q.includes('study') || q.includes('gesture')) rows = rows.filter(item => /study|drawing|sketch|poseuses|figure study/i.test(`${item.title} ${item.medium} ${item.tags.join(' ')}`));
    else if (q.includes('sculpt')) rows = rows.filter(item => /bronze|marble|ceramic|terracotta|wood|ivory|alabaster|sculpture/i.test(`${item.medium} ${item.kind} ${item.tags.join(' ')}`));
    else rows = rows.filter(item => normalise([item.title, item.artist, item.year, item.medium, ...item.tags].join(' ')).includes(q));
    return rows;
  }

  function uniqueKey(item) { return `${normalise(item.title)}|${normalise(item.artist)}`; }
  function uniqueImageKey(item) {
    const url = text(item.image).split('?')[0];
    const iiif = url.match(/\/iiif\/2\/([^/]+)/i);
    if (iiif) return `iiif:${iiif[1].toLowerCase()}`;
    const filename = url.split('/').pop();
    return filename ? `file:${normalise(filename)}` : `url:${normalise(url)}`;
  }
  function addResults(items) {
    let added = 0;
    for (const item of items) {
      if (!item || !item.title || !item.image || !item.thumb || blockedStarterIds.has(item.id)) continue;
      if (state.seenIds.has(item.id)) continue;
      const workKey = uniqueKey(item);
      const imageKey = uniqueImageKey(item);
      if (state.seenWorks.has(workKey) || state.seenImages.has(imageKey)) continue;
      state.seenIds.add(item.id);
      state.seenWorks.add(workKey);
      state.seenImages.add(imageKey);
      state.results.push(item);
      added++;
    }
    return added;
  }

  function isCollectionSaved(id) {
    try { return JSON.parse(localStorage.getItem('naked-canvas-phase2-favourites') || '[]').some(item => item.id === id); }
    catch { return false; }
  }

  function visibleResults() {
    let rows = [...state.results];
    const q = normalise($('collectionSearch').value);
    if (q && q !== normalise(state.query)) {
      rows = rows.filter(item => normalise([item.title, item.artist, item.year, item.medium, item.museum, ...(item.tags || [])].join(' ')).includes(q));
    }
    const source = $('collectionSource').value;
    if (source !== 'all') rows = rows.filter(item => item.museumKey === source);
    const sort = $('collectionSort').value;
    if (sort === 'title') rows.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'artist') rows.sort((a, b) => a.artist.localeCompare(b.artist));
    return rows;
  }

  function render() {
    const rows = visibleResults();
    $('collectionGrid').innerHTML = rows.map(item => {
      const saved = isCollectionSaved(item.id);
      return `<article class="collection-card" data-collection-id="${safe(item.id)}" tabindex="0" role="button" aria-label="Open ${safe(item.title)} by ${safe(item.artist)}">
        <div class="collection-card-image"><img class="${item.id.startsWith('artflip-') && String(item.thumb).startsWith('assets/') ? 'local-preview' : ''}" loading="lazy" decoding="async" fetchpriority="low" width="640" height="800" src="${safe(item.thumb)}" data-full="${safe(item.image)}" alt="${safe(item.title)} by ${safe(item.artist)}"><span class="collection-source-tag">${safe(item.museum)}</span><button class="heart-button ${saved ? 'saved' : ''}" type="button" data-save-collection="${safe(item.id)}" aria-label="Save artwork">♡</button></div>
        <div class="collection-card-info"><h3>${safe(item.title)}</h3><p>${safe(item.artist)} · ${safe(item.year)}</p><div class="card-foot"><span>${safe(item.kind)}</span><span>OPEN ↗</span></div></div>
      </article>`;
    }).join('');
    $('collectionLoaded').textContent = String(state.results.length);
    $('collectionEmpty').classList.toggle('hidden', rows.length !== 0 || state.loading);
    $('collectionGrid').querySelectorAll('img').forEach(img => img.addEventListener('error', () => {
      img.classList.add('image-error');
      const frame = img.closest('.collection-card-image');
      if (frame) frame.classList.add('load-failed');
    }, { once: true }));
    const source = $('collectionSource').value;
    const notes = [];
    if (source === 'all' || source === 'artflip') notes.push(`ArtFlip picks loaded: ${state.results.filter(item => item.museumKey === 'artflip').length}`);
    if (source === 'all' || source === 'met') notes.push(`Met: ${state.totals.met ?? '—'}`);
    if (source === 'all' || source === 'aic') notes.push(`Chicago: ${state.totals.aic ?? '—'}`);
    if (source === 'all' || source === 'cma') notes.push(`Cleveland: ${state.totals.cma ?? '—'}`);
    $('collectionMoreNote').textContent = `Eligible search matches: ${notes.join(' · ')}. Your nineteen ChatGPT Library studio artworks are bundled locally in optimized WebP; museum images remain linked to their source collections.`;
  }

  function setStatus(message, kind = '') {
    $('collectionStatus').textContent = message;
    $('collectionStatus').className = `collection-status ${kind}`.trim();
  }

  async function loadBatch(reset = false) {
    if (state.loading) return;
    state.loading = true;
    $('collectionLoadMore').disabled = true;
    $('collectionLoadMore').textContent = 'Loading museum records…';
    if (reset) {
      state.controllers.forEach(controller => controller.abort());
      state.results = [];
      state.seenIds.clear();
      state.seenWorks.clear();
      state.seenImages.clear();
      state.offsets = { met: 0, aic: 1, cma: 0 };
      state.totals = { artflip: artflipSeed.length, met: null, aic: null, cma: null };
      $('collectionGrid').innerHTML = '';
    }
    const query = state.query.trim() || 'nude';
    const selected = state.source === 'all' ? ['met', 'aic', 'cma'] : (state.source === 'artflip' ? [] : [state.source]);
    let added = 0;
    if (state.source === 'all' || state.source === 'artflip') added += addResults(artflipSeedsForQuery(query));
    setStatus(state.source === 'artflip' ? `Loading ArtFlip’s verified figure-art index for “${query}”…` : `Searching ${selected.length} open-access museum ${selected.length === 1 ? 'catalogue' : 'catalogues'} and the ArtFlip index for “${query}”…`);
    const tasks = selected.map(source => {
      if (source === 'met') return searchMet(query).then(items => ({ source, items }));
      if (source === 'aic') return searchAic(query, state.offsets.aic).then(items => ({ source, items }));
      return searchCma(query).then(items => ({ source, items }));
    });
    const settled = await Promise.allSettled(tasks);
    const failures = [];
    for (let i = 0; i < settled.length; i++) {
      const result = settled[i];
      const fallbackSource = selected[i];
      if (result.status === 'fulfilled') added += addResults(result.value.items);
      else failures.push(`${fallbackSource.toUpperCase()}: ${result.reason?.message || 'request failed'}`);
    }
    state.loading = false;
    $('collectionLoadMore').disabled = state.source === 'artflip';
    $('collectionLoadMore').textContent = state.source === 'artflip' ? 'ArtFlip index loaded' : 'Load more artworks ↓';
    render();
    if (failures.length && added) setStatus(`${added} new eligible works loaded. One or more sources could not respond: ${failures.join('; ')}.`, 'partial');
    else if (failures.length) setStatus(`Museum search could not complete: ${failures.join('; ')}. Check your connection and try again.`, 'error');
    else if (added) setStatus(`${added} new public-domain / CC0 artworks loaded. Duplicate starter works and repeated records were skipped.`, 'success');
    else setStatus('No new eligible results in this batch. Try another subject or source.', 'partial');
  }

  function openItem(item) {
    state.activeItem = item;
    $('collectionModalImage').src = item.image;
    $('collectionModalImage').alt = `${item.title} by ${item.artist}`;
    $('collectionModalImage').onerror = () => $('collectionModalImage').classList.add('image-error');
    $('collectionModalMuseum').textContent = item.museum.toUpperCase();
    $('collectionModalTitle').textContent = item.title;
    $('collectionModalArtist').textContent = `${item.artist} · ${item.year}`;
    const indexRow = item.metadataUrl ? `<dt>Metadata index</dt><dd><a href="${safe(item.metadataUrl)}" target="_blank" rel="noopener noreferrer">ArtFlip source JSON ↗</a></dd>` : '';
    $('collectionModalMeta').innerHTML = `<dt>Medium</dt><dd>${safe(item.medium)}</dd><dt>Collection</dt><dd>${safe(item.museum)}</dd><dt>Type</dt><dd>${safe(item.kind)}</dd>${indexRow}`;
    $('collectionModalRights').textContent = item.rights;
    $('collectionModalSource').href = item.sourceUrl;
    $('collectionModalSave').textContent = isCollectionSaved(item.id) ? '♥ Saved' : '♡ Save artwork';
    $('collectionModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    $('collectionModal').classList.add('hidden');
    if ($('artModal').classList.contains('hidden') && $('poseModal').classList.contains('hidden')) document.body.style.overflow = '';
  }

  $('collectionFilters').addEventListener('click', event => {
    const button = event.target.closest('[data-query]');
    if (!button) return;
    $('collectionFilters').querySelectorAll('[data-query]').forEach(item => item.classList.toggle('active', item === button));
    $('collectionSearch').value = '';
    state.query = button.dataset.query;
    loadBatch(true);
  });
  $('collectionSource').addEventListener('change', () => { state.source = $('collectionSource').value; loadBatch(true); });
  $('collectionSort').addEventListener('change', render);
  $('runCollectionSearch').addEventListener('click', () => {
    const query = $('collectionSearch').value.trim();
    if (!query) return;
    $('collectionFilters').querySelectorAll('[data-query]').forEach(item => item.classList.remove('active'));
    state.query = query;
    loadBatch(true);
  });
  $('collectionSearch').addEventListener('keydown', event => {
    if (event.key === 'Enter') $('runCollectionSearch').click();
  });
  $('collectionLoadMore').addEventListener('click', () => loadBatch(false));
  $('collectionGrid').addEventListener('click', event => {
    const saveButton = event.target.closest('[data-save-collection]');
    if (saveButton) {
      event.stopPropagation();
      const item = state.results.find(result => result.id === saveButton.dataset.saveCollection);
      if (item && window.nakedCanvasSave) {
        window.nakedCanvasSave({ id: item.id, title: item.title, artist: item.artist, thumb: item.thumb, type: 'art' });
        const saved = isCollectionSaved(item.id);
        saveButton.classList.toggle('saved', saved);
        saveButton.textContent = saved ? '♥' : '♡';
        saveButton.setAttribute('aria-label', saved ? 'Remove saved artwork' : 'Save artwork');
      }
      return;
    }
    const card = event.target.closest('[data-collection-id]');
    if (card) {
      const item = state.results.find(result => result.id === card.dataset.collectionId);
      if (item) openItem(item);
    }
  });
  $('collectionGrid').addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-collection-id]')) {
      event.preventDefault();
      const item = state.results.find(result => result.id === event.target.dataset.collectionId);
      if (item) openItem(item);
    }
  });
  $('collectionModalSave').addEventListener('click', () => {
    const item = state.activeItem;
    if (!item || !window.nakedCanvasSave) return;
    window.nakedCanvasSave({ id: item.id, title: item.title, artist: item.artist, thumb: item.thumb, type: 'art' });
    $('collectionModalSave').textContent = isCollectionSaved(item.id) ? '♥ Saved' : '♡ Save artwork';
  });
  $('closeCollectionModal').addEventListener('click', closeModal);
  $('collectionModal').addEventListener('click', event => { if (event.target === $('collectionModal')) closeModal(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

  // Lazy discovery: query museum endpoints only when Collections scrolls into view.
  const collectionSection = $('collection-section');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting) && !state.results.length && !state.loading) {
        observer.disconnect();
        loadBatch(true);
      }
    }, { rootMargin: '180px 0px' });
    observer.observe(collectionSection);
  } else {
    window.addEventListener('load', () => { if (!state.results.length && !state.loading) loadBatch(true); }, { once: true });
  }
})();
