/* PHASE 7 — nineteen original ChatGPT Library artworks, optimized and bundled locally */
'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const works = [
    {id:'studio-sepia-classical',title:'Sepia Classical Figure Study Sheet',style:'Sepia pencil · academic study',file:'./sepia-classical-figure-study.webp',width:1024,height:1536,alt:'AI-generated classical figure-study sheet in sepia pencil with adult models in varied standing and seated poses.',medium:'Sepia pencil and charcoal study',description:'A multi-pose academic figure-study sheet with warm paper texture and a classical atelier mood.'},
    {id:'studio-renaissance-collage',title:'Renaissance Figure Study Collage',style:'Renaissance atelier · sepia',file:'./renaissance-figure-study-collage.webp',width:1024,height:1536,alt:'AI-generated Renaissance-inspired figure-study collage with adult models, pose details and warm sepia tones.',medium:'Renaissance-inspired sepia illustration',description:'A vertical collage of full-body figure studies and smaller pose details in a warm Renaissance-inspired setting.'},
    {id:'studio-sculptors-studio',title:'Classical Sculptor’s Studio Studies',style:'Sculptor studio · classical',file:'./classical-sculptors-studio.webp',width:1024,height:1536,alt:'AI-generated classical sculptor studio figure-study collage with adult models and sculptural details.',medium:'Sepia atelier illustration',description:'A studio-inspired composition combining classical figure references, sculptural forms and sketchbook details.'},
    {id:'studio-graphite-collage',title:'Vintage Graphite Figure Study Collage',style:'Graphite · monochrome',file:'./graphite-figure-study-collage.webp',width:1024,height:1536,alt:'AI-generated graphite figure-study collage with adult models, anatomy and gesture references on paper.',medium:'Graphite pencil on textured paper',description:'A monochrome study sheet focused on gesture, proportion and varied figure poses.'},
    {id:'studio-classical-couple',title:'Classical Couple Figure Study',style:'Paired composition · sepia',file:'./classical-couple-figure-study.webp',width:1086,height:1448,alt:'AI-generated classical paired adult figure-study collage in sepia pencil, presented as non-explicit fine art.',medium:'Sepia pencil and charcoal illustration',description:'A paired figure-study sheet exploring balance, posture and composition in a classical drawing-room style.'},
    {id:'studio-life-drawing',title:'Sepia Life Drawing Study Sheet',style:'Life drawing · warm sepia',file:'./sepia-life-drawing-study.webp',width:1086,height:1448,alt:'AI-generated life-drawing reference sheet with adult models in multiple academic poses.',medium:'Sepia life-drawing illustration',description:'A multi-model study sheet arranged as a life-drawing reference board with a warm archival palette.'},
    {id:'studio-figure-triad',title:'Classical Figure Study Triad',style:'Three-figure composition · sepia',file:'./classical-figure-study-triad.webp',width:1086,height:1448,alt:'AI-generated classical three-figure study composition with adult models in a non-explicit fine-art setting.',medium:'Classical sepia figure illustration',description:'A three-figure atelier composition with gesture details and a restrained, museum-study aesthetic.'},
    {id:'studio-female-figure',title:'Sepia Female Figure Study Collage',style:'Figure drawing · sepia',file:'./sepia-female-figure-study.webp',width:1086,height:1448,alt:'AI-generated sepia figure-study collage of adult female models in varied academic drawing poses.',medium:'Sepia pencil figure illustration',description:'A figure-study collage with varied adult poses, expressive silhouettes and warm sepia paper texture.'},
    {id:'studio-graphite-couple',title:'Graphite Couple Figure Study Sheet',style:'Graphite · paired figure studies',file:'./graphite-couple-figure-study.webp',width:1024,height:1536,alt:'AI-generated graphite study sheet showing adult models in paired and individual academic figure poses.',medium:'Graphite pencil on textured paper',description:'A monochrome atelier sheet that contrasts paired compositions with individual full-body reference poses.'},
    {id:'studio-charcoal-collage',title:'Charcoal Figure Study Collage',style:'Charcoal · group reference',file:'./charcoal-figure-study-collage.webp',width:1086,height:1448,alt:'AI-generated charcoal collage of adult models in varied non-explicit classical figure-study poses.',medium:'Charcoal and graphite illustration',description:'A broad multi-figure reference board with varied poses, portrait details and a charcoal-on-paper finish.'},
    {id:'studio-boudoir-reclining',title:'Classical Boudoir Reclining Study',style:'Classical painting · reclining pose',file:'./classical-boudoir-reclining-study.webp',width:1024,height:1536,alt:'AI-generated non-explicit classical fine-art painting of an adult reclining figure on a chaise in a warm sepia room.',medium:'Classical sepia painting study',description:'A single-figure reclining composition with soft studio lighting and an old-master inspired interior.'},
    {id:'studio-classical-male-anatomy',title:'Classical Male Anatomy Study Sheet',style:'Anatomy reference · warm sepia',file:'./classical-male-anatomy-sheet.webp',width:800,height:1200,alt:'AI-generated non-explicit academic anatomy reference sheet showing adult male figure proportions and muscle studies.',medium:'Sepia anatomical pencil illustration',description:'A structured anatomy board with adult male figure views, proportion notes and grouped muscle studies.'},
    {id:'studio-vintage-graphite-sheet',title:'Vintage Graphite Figure Study Sheet',style:'Graphite · portrait and full figure',file:'./vintage-graphite-figure-sheet.webp',width:800,height:1200,alt:'AI-generated non-explicit graphite figure-study sheet with adult models, portrait details and gesture references.',medium:'Graphite pencil on textured paper',description:'A monochrome reference sheet pairing full-figure studies with facial, hand and gesture details.'},
    {id:'studio-sepia-bathhouse',title:'Sepia Bathhouse Figure Studies',style:'Bathhouse · classical study',file:'./sepia-bathhouse-figure-studies.webp',width:800,height:1200,alt:'AI-generated non-explicit classical bathhouse figure-study collage with clearly adult subjects in an academic fine-art setting.',medium:'Sepia classical illustration',description:'A warm bathhouse-themed study board with adult figures, architectural details and smaller pose panels.'},
    {id:'studio-classical-atelier',title:'Classical Atelier Figure Study Sheet',style:'Atelier · multi-pose studies',file:'./classical-atelier-figure-study.webp',width:800,height:1200,alt:'AI-generated non-explicit classical atelier figure-study board with adult models and varied academic poses.',medium:'Sepia pencil and charcoal illustration',description:'A vertical artist-studio reference board combining standing, seated and reclining adult figure studies.'},
    {id:'studio-classical-triptych',title:'Classical Triptych Life Drawing Studies',style:'Life drawing · triptych',file:'./classical-triptych-life-drawing.webp',width:1200,height:800,alt:'AI-generated non-explicit triptych of classical adult life-drawing studies in sepia.',medium:'Sepia life-drawing illustration',description:'Three side-by-side figure-study panels that compare posture, balance and gesture.'},
    {id:'studio-monochrome-sketchbook',title:'Monochrome Figure Study Sketchbook',style:'Monochrome · sketchbook',file:'./monochrome-figure-sketchbook.webp',width:800,height:1200,alt:'AI-generated non-explicit monochrome sketchbook page with adult figure studies and gesture details.',medium:'Graphite and charcoal sketchbook art',description:'A sketchbook-style composition with multiple adult figures, small pose panels and observational drawing details.'},
    {id:'studio-charcoal-two-poses',title:'Classical Charcoal Study of Two Poses',style:'Charcoal · paired studies',file:'./classical-charcoal-two-poses.webp',width:800,height:1200,alt:'AI-generated non-explicit charcoal study showing two adult figure poses on warm paper.',medium:'Charcoal on archival paper',description:'A paired-pose composition focused on gesture, silhouette and weight distribution.'},
    {id:'studio-graphite-anatomy-89',title:'Graphite Anatomy Study · Ideas 8 and 9',style:'Graphite · paired anatomy boards',file:'./graphite-anatomy-ideas-8-9.webp',width:1200,height:800,alt:'AI-generated non-explicit graphite anatomy study boards with adult figure poses and proportional references.',medium:'Graphite anatomy illustration',description:'Two adjacent graphite study boards presenting adult figure proportion, gesture and anatomy references.'}
  ];
  let active = 0;
  let lastTrigger = null;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const isSaved = id => typeof window.nakedCanvasIsSaved === 'function' && window.nakedCanvasIsSaved(id);
  function render() {
    const grid = $('studioArtGrid');
    if (!grid) return;
    grid.innerHTML = works.map((work,index) => {
      const saved = isSaved(work.id);
      return `<article class="studio-art-card">
        <div class="studio-art-image">
          <button class="studio-art-preview" type="button" data-studio-card="${esc(work.id)}" aria-label="Open ${esc(work.title)}">
            <img loading="lazy" decoding="async" fetchpriority="low" width="${work.width}" height="${work.height}" src="${esc(work.file)}" alt="${esc(work.alt)}">
          </button>
          <span class="studio-art-label">CHATGPT LIBRARY</span>
          <button class="studio-art-save ${saved?'saved':''}" type="button" data-save-studio="${esc(work.id)}" aria-label="${saved?'Remove from My Shelf':'Save to My Shelf'}">${saved?'♥':'♡'}</button>
        </div>
        <div class="studio-art-info"><strong>${esc(work.title)}</strong><small>${esc(work.style)}</small><div class="studio-art-meta"><span>AI-GENERATED</span><button class="text-button" type="button" data-studio-card="${esc(work.id)}">VIEW ↗</button></div></div>
      </article>`;
    }).join('');
    grid.querySelectorAll('img').forEach(img => img.addEventListener('error', () => img.closest('.studio-art-image')?.classList.add('load-failed'), {once:true}));
  }
  function open(index, trigger = document.activeElement) {
    const modal = $('studioArtModal');
    // Keep the original outside trigger; prev/next buttons live inside the modal.
    if (trigger && modal && !modal.contains(trigger)) lastTrigger = trigger;
    active = (index + works.length) % works.length;
    const work = works[active];
    $('studioArtModalImage').src = work.file;
    $('studioArtModalImage').alt = work.alt;
    $('studioArtModalImage').width = work.width;
    $('studioArtModalImage').height = work.height;
    $('studioArtModalTitle').textContent = work.title;
    $('studioArtModalStyle').textContent = work.style;
    $('studioArtModalMeta').innerHTML = `<dt>Medium</dt><dd>${esc(work.medium)}</dd><dt>Source</dt><dd>ChatGPT Library · your generated image</dd><dt>Format</dt><dd>Optimized WebP · stored in this app</dd>`;
    $('studioArtOpenImage').href = work.file;
    $('studioArtDownload').href = work.file;
    $('studioArtDownload').download = `${work.id}.webp`;
    $('studioArtModalSave').textContent = isSaved(work.id) ? '♥ Saved to My Shelf' : '♡ Save to My Shelf';
    $('studioArtModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    $('closeStudioArtModal').focus();
  }
  function close() {
    $('studioArtModal').classList.add('hidden');
    if ($('artModal').classList.contains('hidden') && $('poseModal').classList.contains('hidden') && $('collectionModal').classList.contains('hidden')) document.body.style.overflow = '';
    if (lastTrigger && typeof lastTrigger.focus === 'function' && lastTrigger.isConnected) lastTrigger.focus();
  }
  function saveCurrent() {
    const work = works[active];
    if (!work || typeof window.nakedCanvasSave !== 'function') return;
    window.nakedCanvasSave({id:work.id,title:work.title,artist:'ChatGPT Library · Generated artwork',thumb:work.file,type:'studio-art'});
    $('studioArtModalSave').textContent = isSaved(work.id) ? '♥ Saved to My Shelf' : '♡ Save to My Shelf';
    const btn = document.querySelector(`[data-save-studio="${CSS.escape(work.id)}"]`);
    if (btn) { btn.classList.toggle('saved',isSaved(work.id)); btn.textContent = isSaved(work.id) ? '♥' : '♡'; }
  }
  const grid = $('studioArtGrid');
  grid?.addEventListener('click', event => {
    const save = event.target.closest('[data-save-studio]');
    if (save) {
      event.stopPropagation();
      const work = works.find(item => item.id === save.dataset.saveStudio);
      if (work && typeof window.nakedCanvasSave === 'function') window.nakedCanvasSave({id:work.id,title:work.title,artist:'ChatGPT Library · Generated artwork',thumb:work.file,type:'studio-art'});
      save.classList.toggle('saved',isSaved(save.dataset.saveStudio));
      save.textContent = isSaved(save.dataset.saveStudio) ? '♥' : '♡';
      return;
    }
    const card = event.target.closest('[data-studio-card]');
    if (card) open(works.findIndex(item => item.id === card.dataset.studioCard), card);
  });
  $('studioArtModalSave')?.addEventListener('click', saveCurrent);
  $('closeStudioArtModal')?.addEventListener('click', close);
  $('studioArtModal')?.addEventListener('click', event => { if (event.target === $('studioArtModal')) close(); });
  $('prevStudioArt')?.addEventListener('click', () => open(active - 1));
  $('nextStudioArt')?.addEventListener('click', () => open(active + 1));
  document.addEventListener('keydown', event => {
    if ($('studioArtModal')?.classList.contains('hidden')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'Tab') {
      const modal = $('studioArtModal');
      const focusable = [...modal.querySelectorAll('button:not([disabled]),a[href]')].filter(el => !el.classList.contains('hidden'));
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    if (event.key === 'ArrowLeft') open(active - 1);
    if (event.key === 'ArrowRight') open(active + 1);
  });
  $('studioArtModalImage')?.addEventListener('pointerdown', event => { $('studioArtModalImage').dataset.startX = String(event.clientX); });
  $('studioArtModalImage')?.addEventListener('pointerup', event => {
    const start = Number($('studioArtModalImage').dataset.startX || 0);
    const dx = event.clientX - start;
    if (Math.abs(dx) > 55) open(active + (dx < 0 ? 1 : -1));
  });
  window.addEventListener('nakedcanvas:saved-change', () => {
    grid?.querySelectorAll('[data-save-studio]').forEach(btn => {
      const saved = isSaved(btn.dataset.saveStudio);
      btn.classList.toggle('saved',saved); btn.textContent = saved ? '♥' : '♡';
      btn.setAttribute('aria-label',saved?'Remove from My Shelf':'Save to My Shelf');
    });
    if (!$('studioArtModal').classList.contains('hidden')) $('studioArtModalSave').textContent = isSaved(works[active].id) ? '♥ Saved to My Shelf' : '♡ Save to My Shelf';
  });
  render();
})();
