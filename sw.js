/* BLACKED PUSSY Phase 3 — versioned same-origin cache; optional artwork failures never block the app shell. */
'use strict';
const CACHE_NAME = 'naked-canvas-shell-v8';
const CORE_SHELL = [
  './', './index.html', './styles.css', './halloween.css', './halloween.js', './app.js', './creator.js',
  './artflip-figure-index.js', './asset-path-fix.js', './collections.js', './brand-voice.js',
  './library-art.js', './pwa.js', './manifest.webmanifest',
  './app-192.png', './app-512.png'
];
const LOCAL_ART = [
  './13070.webp',
  './247117.webp',
  './256403.webp',
  './314826.webp',
  './334002.webp',
  './435739.webp',
  './435829.webp',
  './435831.webp',
  './435963.webp',
  './435965.webp',
  './436002.webp',
  './436003.webp',
  './436004.webp',
  './436022.webp',
  './436173.webp',
  './437784.webp',
  './437827.webp',
  './459191.webp',
  './64916.webp',
  './835151.webp',
  './charcoal-figure-study-collage.webp',
  './classical-atelier-figure-study.webp',
  './classical-boudoir-reclining-study.webp',
  './classical-charcoal-two-poses.webp',
  './classical-couple-figure-study.webp',
  './classical-figure-study-triad.webp',
  './classical-male-anatomy-sheet.webp',
  './classical-sculptors-studio.webp',
  './classical-triptych-life-drawing.webp',
  './graphite-anatomy-ideas-8-9.webp',
  './graphite-couple-figure-study.webp',
  './graphite-figure-study-collage.webp',
  './monochrome-figure-sketchbook.webp',
  './renaissance-figure-study-collage.webp',
  './sepia-bathhouse-figure-studies.webp',
  './sepia-classical-figure-study.webp',
  './sepia-female-figure-study.webp',
  './sepia-life-drawing-study.webp',
  './vintage-graphite-figure-sheet.webp'
];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_SHELL);
    // Optional local artwork cache misses must not block the core application shell.
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
  if (url.origin !== self.location.origin) return; // Pollinations, museum APIs and campaign image hosts are never cached here.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put('./index.html', response.clone()));
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match('./index.html')) || new Response('BLACKED PUSSY is offline. Reconnect and reload.', { status: 503, headers: { 'Content-Type': 'text/plain;charset=utf-8' } })));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response && response.ok && response.type === 'basic') caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    return response;
  }).catch(() => new Response('', { status: 504, statusText: 'Offline' }))));
});
