/* Naked Canvas Phase 7 — versioned same-origin cache; optional artwork failures never block the core app. */
'use strict';
const CACHE_NAME = 'naked-canvas-shell-v7';
const CORE_SHELL = [
  './', './index.html', './styles.css', './app.js', './creator.js',
  './artflip-figure-index.js', './collections.js', './brand-voice.js',
  './library-art.js', './pwa.js', './manifest.webmanifest',
  './icons/app-192.png', './icons/app-512.png'
];
const LOCAL_ART = [
  './assets/my-studio/classical-couple-figure-study.webp',
  './assets/my-studio/classical-figure-study-triad.webp',
  './assets/my-studio/classical-sculptors-studio.webp',
  './assets/my-studio/graphite-figure-study-collage.webp',
  './assets/my-studio/renaissance-figure-study-collage.webp',
  './assets/my-studio/sepia-classical-figure-study.webp',
  './assets/my-studio/sepia-female-figure-study.webp',
  './assets/my-studio/sepia-life-drawing-study.webp',
  './assets/my-studio/graphite-couple-figure-study.webp',
  './assets/my-studio/charcoal-figure-study-collage.webp',
  './assets/my-studio/classical-boudoir-reclining-study.webp',
  './assets/my-studio/classical-male-anatomy-sheet.webp',
  './assets/my-studio/vintage-graphite-figure-sheet.webp',
  './assets/my-studio/sepia-bathhouse-figure-studies.webp',
  './assets/my-studio/classical-atelier-figure-study.webp',
  './assets/my-studio/classical-triptych-life-drawing.webp',
  './assets/my-studio/monochrome-figure-sketchbook.webp',
  './assets/my-studio/classical-charcoal-two-poses.webp',
  './assets/my-studio/graphite-anatomy-ideas-8-9.webp',
  './assets/artflip-thumbs/13070.webp', './assets/artflip-thumbs/247117.webp',
  './assets/artflip-thumbs/256403.webp', './assets/artflip-thumbs/314826.webp',
  './assets/artflip-thumbs/334002.webp', './assets/artflip-thumbs/435739.webp',
  './assets/artflip-thumbs/435829.webp', './assets/artflip-thumbs/435831.webp',
  './assets/artflip-thumbs/435963.webp', './assets/artflip-thumbs/435965.webp',
  './assets/artflip-thumbs/436002.webp', './assets/artflip-thumbs/436003.webp',
  './assets/artflip-thumbs/436004.webp', './assets/artflip-thumbs/436022.webp',
  './assets/artflip-thumbs/436173.webp', './assets/artflip-thumbs/437784.webp',
  './assets/artflip-thumbs/437827.webp', './assets/artflip-thumbs/459191.webp',
  './assets/artflip-thumbs/64916.webp', './assets/artflip-thumbs/835151.webp'
];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_SHELL);
    // Optional artwork cache misses must not block the application shell update.
    await Promise.allSettled(LOCAL_ART.map(asset => cache.add(asset)));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('naked-canvas-shell-') && key !== CACHE_NAME).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Provider, museum APIs and remote image hosts are never cached here.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put('./index.html', response.clone()));
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match('./index.html')) || new Response('Naked Canvas is offline. Reconnect and reload.', { status: 503, headers: { 'Content-Type': 'text/plain;charset=utf-8' } })));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response && response.ok && response.type === 'basic') caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    return response;
  }).catch(() => new Response('', { status: 504, statusText: 'Offline' }))));
});
