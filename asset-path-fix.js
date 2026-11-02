/* Repair legacy nested asset URLs against the actual root-level WebP inventory. */
'use strict';
(() => {
  const rootImages = new Set([
    '13070.webp','247117.webp','256403.webp','314826.webp','334002.webp','435739.webp','435829.webp','435831.webp','435963.webp','435965.webp',
    '436002.webp','436003.webp','436004.webp','436022.webp','436173.webp','437784.webp','437827.webp','459191.webp','64916.webp','835151.webp',
    'charcoal-figure-study-collage.webp','classical-atelier-figure-study.webp','classical-boudoir-reclining-study.webp','classical-charcoal-two-poses.webp',
    'classical-couple-figure-study.webp','classical-figure-study-triad.webp','classical-male-anatomy-sheet.webp','classical-sculptors-studio.webp',
    'classical-triptych-life-drawing.webp','graphite-anatomy-ideas-8-9.webp','graphite-couple-figure-study.webp','graphite-figure-study-collage.webp',
    'monochrome-figure-sketchbook.webp','renaissance-figure-study-collage.webp','sepia-bathhouse-figure-studies.webp','sepia-classical-figure-study.webp',
    'sepia-female-figure-study.webp','sepia-life-drawing-study.webp','vintage-graphite-figure-sheet.webp'
  ]);

  const records = window.NAKED_CANVAS_ARTFLIP_FIGURES;
  if (Array.isArray(records)) {
    records.forEach(record => {
      if (typeof record.thumb !== 'string') return;
      const match = record.thumb.match(/(?:^|\/)assets\/artflip-thumbs\/([^/]+\.webp)$/);
      if (match && rootImages.has(match[1])) record.thumb = `./${match[1]}`;
    });
  }

  function normaliseSource(value) {
    if (!value || typeof value !== 'string') return null;
    let url;
    try { url = new URL(value, document.baseURI); } catch { return null; }
    if (url.origin !== location.origin) return null;
    const match = url.pathname.match(/\/assets\/(?:my-studio|artflip-thumbs)\/([^/]+\.webp)$/);
    if (!match || !rootImages.has(match[1])) return null;
    return new URL(`./${match[1]}`, document.baseURI).href;
  }

  function repairImage(image) {
    if (!(image instanceof HTMLImageElement)) return;
    const corrected = normaliseSource(image.getAttribute('src') || '');
    if (corrected) image.setAttribute('src', corrected);
  }

  function repairTree(node) {
    if (!(node instanceof Element)) return;
    if (node.matches('img')) repairImage(node);
    node.querySelectorAll?.('img').forEach(repairImage);
  }

  // Also fixes old localStorage Saved Shelf entries which still contain pre-audit nested paths.
  document.querySelectorAll('img').forEach(repairImage);
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.target instanceof HTMLImageElement) repairImage(mutation.target);
      mutation.addedNodes?.forEach(repairTree);
    });
  });
  observer.observe(document.documentElement, { subtree:true, childList:true, attributes:true, attributeFilter:['src'] });
})();
