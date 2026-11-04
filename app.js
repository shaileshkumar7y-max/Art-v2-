'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const ART_KEY = 'after-dark-art-saved-v1';
  const AGE_KEY = 'after-dark-art-adult-v1';
  const ART_RAW = 'https://raw.githubusercontent.com/shaileshkumar7y-max/Art-v2-/main/';
  const SHISEI_RAW = 'https://raw.githubusercontent.com/wquguru/shisei/main/images/line/w600/';
  const STUDIO_FILES = [
    ['charcoal-figure-study-collage.webp','Charcoal Figure Study Collage','Graphite & charcoal','graphite'],
    ['classical-boudoir-reclining-study.webp','Classical Reclining Study','Classical study','classical'],
    ['classical-couple-figure-study.webp','Classical Couple Study','Couple study','classical'],
    ['classical-figure-study-triad.webp','Classical Figure Study Triad','Figure study','classical'],
    ['classical-sculptors-studio.webp','Sculptor’s Studio','Sculpture & atelier','sculpture'],
    ['graphite-couple-figure-study.webp','Graphite Couple Study','Graphite & charcoal','graphite'],
    ['graphite-figure-study-collage.webp','Graphite Figure Collage','Graphite & charcoal','graphite'],
    ['renaissance-figure-study-collage.webp','Renaissance Figure Collage','Classical study','classical'],
    ['sepia-classical-figure-study.webp','Sepia Classical Figure Study','Figure study','classical'],
    ['sepia-female-figure-study.webp','Sepia Figure Study','Figure study','female'],
    ['sepia-life-drawing-study.webp','Sepia Life Drawing','Life drawing','classical']
  ].map((entry, index) => ({
    id: `studio-${index + 1}`, title: entry[1], artist: 'Studio library', year: 'Library artwork', medium: entry[2],
    museum: 'Naked Canvas Studio Library', sourceUrl: 'https://github.com/shaileshkumar7y-max/Art-v2-',
    image: `${ART_RAW}${entry[0]}`, isPublicDomain: false, source: 'studio', category: entry[3], tags: [entry[3], entry[2].toLowerCase()]
  }));

  const POSES = [
    { id:'P001', title:'Sitting, one knee raised', category:'sitting', description:'A relaxed seated pose for studying gesture, balance and the relationship between the torso and legs.', views:{front:'std_P001_front.webp',diag:'std_P001_diag.webp',side:'std_P001_side.webp',above:'std_P001_above.webp',below:'std_P001_below.webp'} },
    { id:'P015', title:'Standing contrapposto', category:'standing', description:'A balanced standing pose with weight shifted to one leg and a natural counter-curve.', views:{front:'std_P015_front.webp',diag:'std_P015_diag.webp',side:'std_P015_side.webp',below:'std_P015_below.webp'} },
    { id:'P032', title:'Kneeling, hands behind head', category:'kneeling', description:'A general kneeling reference for observing shoulder, elbow and torso alignment.', views:{front:'std_P032_front.webp',diag:'std_P032_diag.webp',side:'std_P032_side.webp',above:'std_P032_above.webp'} },
    { id:'P049', title:'Lying on back, arms overhead', category:'lying', description:'A reclining silhouette study that explores line, reach and body balance.', views:{front:'std_P049_front.webp',diag:'std_P049_diag.webp',side:'std_P049_side.webp',below:'std_P049_below.webp'} },
    { id:'P058', title:'Squatting, hands on knees', category:'dynamic', description:'A compact squat useful for studying balance, joint angles and weight distribution.', views:{front:'std_P058_front.webp',diag:'std_P058_diag.webp',side:'std_P058_side.webp',above:'std_P058_above.webp',below:'std_P058_below.webp'} },
    { id:'P064', title:'Bent forward, hands on knees', category:'dynamic', description:'A forward hinge reference for studying the spine line and centre of gravity.', views:{front:'std_P064_front.webp',diag:'std_P064_diag.webp',side:'std_P064_side.webp',above:'std_P064_above.webp',below:'std_P064_below.webp'} },
    { id:'P073', title:'Standing twist, arms spread', category:'dynamic', description:'A twisting standing gesture for studying rotation through the shoulders and waist.', views:{front:'std_P073_front.webp',diag:'std_P073_diag.webp',below:'std_P073_below.webp'} },
    { id:'P070', title:'Standing, arched backward', category:'dynamic', description:'A controlled arch for examining line, balance and the shape of a standing pose.', views:{side:'std_P070_side.webp',below:'std_P070_below.webp'} }
  ];

  let category = 'all';
  let activeSource = 'all';
  let activeArtwork = null;
  let activePose = null;
  let activeAngle = '';
  let visibleCount = 18;
  let toastTimer = 0;
  let saved = loadSaved();

  function loadSaved() {
    try {
      const value = JSON.parse(localStorage.getItem(ART_KEY) || '[]');
      return new Set(Array.isArray(value) ? value.filter(item => typeof item === 'string').slice(0, 300) : []);
    } catch { return new Set(); }
  }
  function persistSaved() {
    try { localStorage.setItem(ART_KEY, JSON.stringify([...saved])); } catch { showToast('Browser storage is full. Remove a few saved items.'); }
    updateSavedCount();
  }
  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }
  function safeHttps(value) {
    try { const url = new URL(String(value || '')); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
  }
  function showToast(message) {
    const toast = $('toast'); toast.textContent = message; toast.classList.add('show');
    window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2300);
  }
  function updateSavedCount() { $('savedCount').textContent = String(saved.size); }
  function museumRecords() {
    const source = Array.isArray(window.NAKED_CANVAS_ARTFLIP_FIGURES) ? window.NAKED_CANVAS_ARTFLIP_FIGURES : [];
    return source.filter(item => item && item.isPublicDomain === true && safeHttps(item.image) && safeHttps(item.sourceUrl)).map(item => ({...item, source:'museum', category:categoryFor(item)}));
  }
  function categoryFor(item) {
    const text = `${item.title || ''} ${item.artist || ''} ${item.medium || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
    if (/male|man |men|serf|male figure/.test(text)) return 'male';
    if (/female|woman|women|bather|venus|diana|nude/.test(text)) return 'female';
    if (/sculpt|bronze|marble|terracotta|ceramic/.test(text)) return 'sculpture';
    if (/graphite|charcoal|drawing|print/.test(text)) return 'graphite';
    return 'classical';
  }
  function allArtworks() { return [...STUDIO_FILES, ...museumRecords()]; }
  function matchesCategory(item) {
    if (category === 'all') return true;
    const values = [item.category, ...(item.tags || []).map(tag => String(tag).toLowerCase())].join(' ');
    if (category === 'classical') return /classical|figure|myth|renaissance/.test(values);
    return values.includes(category);
  }
  function filteredArtworks() {
    const query = $('searchInput').value.trim().toLowerCase();
    return allArtworks().filter(item => {
      const sourceMatch = activeSource === 'all' || item.source === activeSource;
      const categoryMatch = matchesCategory(item);
      const text = [item.title,item.artist,item.year,item.medium,item.museum,...(item.tags || [])].join(' ').toLowerCase();
      return sourceMatch && categoryMatch && (!query || text.includes(query));
    });
  }
  function cardMarkup(item) {
    const image = safeHttps(item.image);
    const sourceLabel = item.source === 'studio' ? 'STUDIO LIBRARY' : 'MUSEUM OPEN ACCESS';
    return `<article class="art-card" data-art-id="${escapeHtml(item.id)}">
      <div class="art-image-wrap"><img src="${escapeHtml(image)}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async"><button class="save-btn${saved.has(String(item.id)) ? ' saved' : ''}" type="button" data-save-art="${escapeHtml(item.id)}" aria-label="${saved.has(String(item.id)) ? 'Remove saved artwork' : 'Save artwork'}">${saved.has(String(item.id)) ? '♥' : '♡'}</button></div>
      <div class="art-info"><span class="tag">${sourceLabel}</span><h3>${escapeHtml(item.title || 'Untitled artwork')}</h3><p>${escapeHtml(item.artist || 'Artist not recorded')} · ${escapeHtml(item.year || 'Date unknown')}</p><button type="button" class="view-link" data-open-art="${escapeHtml(item.id)}">View artwork ↗</button></div>
    </article>`;
  }
  function renderGallery() {
    const filtered = filteredArtworks();
    const shown = filtered.slice(0, visibleCount);
    $('artGrid').innerHTML = shown.map(cardMarkup).join('');
    $('emptyState').hidden = filtered.length > 0;
    $('resultCount').textContent = `${filtered.length} artwork${filtered.length === 1 ? '' : 's'} · showing ${shown.length}`;
    $('loadMore').hidden = filtered.length <= visibleCount;
    $('artCount').textContent = String(allArtworks().length);
    if (!museumRecords().length) $('catalogueNote').textContent = 'Museum catalogue could not be loaded right now. The studio-library artworks remain available; reconnect to view all open-access records.';
    attachImageFallbacks($('artGrid'));
  }
  function attachImageFallbacks(root) {
    root.querySelectorAll('img').forEach(img => img.addEventListener('error', () => {
      img.alt = `${img.alt} (image unavailable)`;
      img.closest('.art-image-wrap')?.classList.add('image-missing');
    }, {once:true}));
  }
  function findArtwork(id) { return allArtworks().find(item => String(item.id) === String(id)) || null; }
  function openArtwork(id) {
    const item = findArtwork(id); if (!item) return;
    activeArtwork = item;
    $('modalImage').src = safeHttps(item.image);
    $('modalImage').alt = item.title || 'Artwork';
    $('modalSource').textContent = item.source === 'studio' ? 'STUDIO LIBRARY / ART-V2' : `${item.museum || 'MUSEUM COLLECTION'} / OPEN ACCESS`;
    $('modalTitle').textContent = item.title || 'Untitled artwork';
    $('modalMeta').textContent = `${item.artist || 'Artist not recorded'} · ${item.year || 'Date unknown'} · ${item.medium || 'Medium not recorded'}`;
    $('modalDescription').textContent = item.source === 'studio' ? 'A locally referenced studio-library study. The original image remains in the Art-v2 repository.' : `Open-access catalogue record from ${item.museum || 'the source museum'}. Check the source record for the museum’s current rights and attribution details.`;
    $('sourceLink').href = safeHttps(item.sourceUrl) || 'https://github.com/shaileshkumar7y-max/Art-v2-';
    $('sourceLink').textContent = item.source === 'studio' ? 'Open studio source ↗' : 'View museum record ↗';
    updateModalSave(); $('detailModal').hidden = false; $('closeModal').focus();
  }
  function updateModalSave() {
    if (!activeArtwork) return;
    const isSaved = saved.has(String(activeArtwork.id));
    $('modalSave').textContent = isSaved ? 'Remove from shelf ♥' : 'Save artwork ♡';
  }
  function toggleSaved(id) {
    const key = String(id);
    if (saved.has(key)) { saved.delete(key); showToast('Removed from your private shelf.'); }
    else { saved.add(key); showToast('Saved to your private shelf.'); }
    persistSaved(); renderGallery(); renderSaved(); updateModalSave();
  }
  function renderSaved() {
    const items = [...saved].map(findArtwork).filter(Boolean);
    $('savedGrid').innerHTML = items.map(cardMarkup).join('');
    $('savedEmpty').hidden = items.length > 0;
    attachImageFallbacks($('savedGrid'));
  }
  function setTab(tab) {
    document.querySelectorAll('.tab').forEach(button => button.classList.toggle('active', button.dataset.tab === tab));
    document.querySelectorAll('.panel').forEach(panel => panel.classList.toggle('active', panel.id === `panel-${tab}`));
    if (tab === 'saved') renderSaved();
    if (tab === 'gallery') renderGallery();
    if (tab === 'poses') renderPoses();
    window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  }
  function poseImage(name) { return `${SHISEI_RAW}${name}`; }
  function renderPoses() {
    const query = $('poseSearch').value.trim().toLowerCase();
    const filter = $('poseFilter').value;
    const items = POSES.filter(pose => (filter === 'all' || pose.category === filter) && `${pose.title} ${pose.description} ${pose.category}`.toLowerCase().includes(query));
    $('poseGrid').innerHTML = items.map(pose => {
      const first = Object.values(pose.views).find(Boolean);
      return `<button class="pose-card" type="button" data-open-pose="${pose.id}"><img src="${poseImage(first)}" alt="${escapeHtml(pose.title)} reference" loading="lazy"><div><span>${pose.category.toUpperCase()} / ${Object.values(pose.views).filter(Boolean).length} VIEWS</span><b>${escapeHtml(pose.title)}</b><small>${escapeHtml(pose.description)}</small></div></button>`;
    }).join('');
  }
  function openPose(id) {
    const pose = POSES.find(item => item.id === id); if (!pose) return;
    activePose = pose; activeAngle = Object.keys(pose.views).find(angle => pose.views[angle]);
    $('poseModalTitle').textContent = pose.title; $('poseModalDescription').textContent = pose.description;
    renderPoseViewer(); $('poseModal').hidden = false; $('closePose').focus();
  }
  function renderPoseViewer() {
    if (!activePose || !activeAngle) return;
    $('poseModalImage').src = poseImage(activePose.views[activeAngle]);
    $('poseModalImage').alt = `${activePose.title} — ${activeAngle} view`;
    $('angleButtons').innerHTML = Object.entries(activePose.views).filter(([,file]) => Boolean(file)).map(([angle]) => `<button type="button" class="angle-btn${angle === activeAngle ? ' active' : ''}" data-angle="${angle}">${angle[0].toUpperCase()}${angle.slice(1)}</button>`).join('');
  }
  function buildPrompt() {
    const subject = $('subject').value;
    const medium = $('medium').value;
    const composition = $('composition').value;
    const lighting = $('lighting').value;
    const palette = $('palette').value;
    const direction = $('direction').value;
    const detail = $('detail').value.trim();
    const extras = detail ? ` Additional direction: ${detail}.` : '';
    $('promptOutput').value = `${direction}. ${subject}; ${composition}. Medium: ${medium}. Lighting: ${lighting}. Palette: ${palette}. Carefully observed proportions, expressive gesture, refined composition and museum-quality craft. Adult subjects only; tasteful, non-explicit fine art; no graphic sexual content, coercion or youth-coded styling.${extras}`;
  }
  function randomisePrompt() {
    const options = {
      subject:['Clearly adult figure study','Clearly adult portrait','Two clearly adult figures, with respectful personal space','Classical sculpture study'],
      medium:['Graphite and charcoal','Sepia pencil study','Oil painting','Watercolour','Marble sculpture','Fine-art photography'],
      composition:['Classical contrapposto, balanced silhouette','Seated pose, calm gesture','Reclining composition, museum-style study','Portrait crop, expressive gaze','Gesture drawing, natural weight distribution','Draped figure, sculptural fabric folds'],
      lighting:['Soft atelier window light','Warm candlelit chiaroscuro','Diffuse museum gallery light','Moonlit dramatic rim light'],
      palette:['Sepia, charcoal and warm ivory','Oxblood, plum and antique gold','Monochrome graphite','Muted Renaissance earth tones'],
      direction:['Academic and historically informed','Gothic editorial, tasteful and non-explicit','Renaissance-inspired fine art','Minimal contemporary studio']
    };
    Object.entries(options).forEach(([id,values]) => { const select = $(id); select.selectedIndex = Math.floor(Math.random() * values.length); });
    buildPrompt();
  }
  function confirmAge() {
    try { localStorage.setItem(AGE_KEY, 'yes'); } catch {}
    $('ageGate').classList.add('hidden');
  }

  $('confirmAge').addEventListener('click', confirmAge);
  if (localStorage.getItem(AGE_KEY) === 'yes') $('ageGate').classList.add('hidden');
  document.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => setTab(button.dataset.tab)));
  document.querySelectorAll('[data-scroll]').forEach(button => button.addEventListener('click', () => setTab(button.dataset.scroll === 'poses' ? 'poses' : 'gallery')));
  $('searchInput').addEventListener('input', () => { visibleCount = 18; renderGallery(); });
  $('sourceFilter').addEventListener('change', event => { activeSource = event.target.value; visibleCount = 18; renderGallery(); });
  $('categoryFilters').addEventListener('click', event => {
    const button = event.target.closest('[data-category]'); if (!button) return;
    category = button.dataset.category; document.querySelectorAll('[data-category]').forEach(item => item.classList.toggle('active', item === button)); visibleCount = 18; renderGallery();
  });
  $('clearFilters').addEventListener('click', () => {
    $('searchInput').value = ''; $('sourceFilter').value = 'all'; activeSource = 'all'; category = 'all'; visibleCount = 18;
    document.querySelectorAll('[data-category]').forEach(item => item.classList.toggle('active', item.dataset.category === 'all')); renderGallery();
  });
  $('loadMore').addEventListener('click', () => { visibleCount += 18; renderGallery(); });
  $('artGrid').addEventListener('click', event => {
    const saveButton = event.target.closest('[data-save-art]'); if (saveButton) { event.stopPropagation(); toggleSaved(saveButton.dataset.saveArt); return; }
    const openButton = event.target.closest('[data-open-art]'); if (openButton) openArtwork(openButton.dataset.openArt);
  });
  $('savedGrid').addEventListener('click', event => {
    const saveButton = event.target.closest('[data-save-art]'); if (saveButton) { toggleSaved(saveButton.dataset.saveArt); return; }
    const openButton = event.target.closest('[data-open-art]'); if (openButton) openArtwork(openButton.dataset.openArt);
  });
  $('modalSave').addEventListener('click', () => { if (activeArtwork) toggleSaved(activeArtwork.id); });
  $('closeModal').addEventListener('click', () => { $('detailModal').hidden = true; activeArtwork = null; });
  $('detailModal').addEventListener('click', event => { if (event.target.hasAttribute('data-close-modal')) $('detailModal').hidden = true; });
  $('poseSearch').addEventListener('input', renderPoses); $('poseFilter').addEventListener('change', renderPoses);
  $('poseGrid').addEventListener('click', event => { const button = event.target.closest('[data-open-pose]'); if (button) openPose(button.dataset.openPose); });
  $('angleButtons').addEventListener('click', event => { const button = event.target.closest('[data-angle]'); if (!button || !activePose) return; activeAngle = button.dataset.angle; renderPoseViewer(); });
  $('closePose').addEventListener('click', () => { $('poseModal').hidden = true; activePose = null; });
  $('poseModal').addEventListener('click', event => { if (event.target.hasAttribute('data-close-pose')) $('poseModal').hidden = true; });
  ['subject','medium','composition','lighting','palette','direction','detail'].forEach(id => $(id).addEventListener('input', buildPrompt));
  $('creatorForm').addEventListener('reset', () => setTimeout(buildPrompt, 0));
  $('shufflePrompt').addEventListener('click', randomisePrompt);
  $('copyPrompt').addEventListener('click', async () => {
    const value = $('promptOutput').value;
    try { await navigator.clipboard.writeText(value); showToast('Prompt copied.'); }
    catch { $('promptOutput').focus(); $('promptOutput').select(); showToast('Prompt selected. Use Copy from your browser.'); }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { $('detailModal').hidden = true; $('poseModal').hidden = true; }
  });

  updateSavedCount(); renderGallery(); renderPoses(); renderSaved(); buildPrompt();
  // The museum list is a deferred remote metadata script. Refresh once after the initial parse.
  window.addEventListener('load', () => { if (museumRecords().length) renderGallery(); });
})();
