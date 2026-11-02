/* Naked Canvas Phase 6 — versioned, same-origin cache only. Third-party API/token traffic is never cached. */
'use strict';
const CACHE_NAME = 'naked-canvas-shell-v6';
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./creator.js",
  "./artflip-figure-index.js",
  "./collections.js",
  "./brand-voice.js",
  "./library-art.js",
  "./pwa.js",
  "./manifest.webmanifest",
  "./icons/app-192.png",
  "./icons/app-512.png",
  "./assets/my-studio/classical-couple-figure-study.webp",
  "./assets/my-studio/classical-figure-study-triad.webp",
  "./assets/my-studio/classical-sculptors-studio.webp",
  "./assets/my-studio/graphite-figure-study-collage.webp",
  "./assets/my-studio/renaissance-figure-study-collage.webp",
  "./assets/my-studio/sepia-classical-figure-study.webp",
  "./assets/my-studio/sepia-female-figure-study.webp",
  "./assets/my-studio/sepia-life-drawing-study.webp",
  "./assets/artflip-thumbs/13070.webp",
  "./assets/artflip-thumbs/247117.webp",
  "./assets/artflip-thumbs/256403.webp",
  "./assets/artflip-thumbs/314826.webp",
  "./assets/artflip-thumbs/334002.webp",
  "./assets/artflip-thumbs/435739.webp",
  "./assets/artflip-thumbs/435829.webp",
  "./assets/artflip-thumbs/435831.webp",
  "./assets/artflip-thumbs/435963.webp",
  "./assets/artflip-thumbs/435965.webp",
  "./assets/artflip-thumbs/436002.webp",
  "./assets/artflip-thumbs/436003.webp",
  "./assets/artflip-thumbs/436004.webp",
  "./assets/artflip-thumbs/436022.webp",
  "./assets/artflip-thumbs/436173.webp",
  "./assets/artflip-thumbs/437784.webp",
  "./assets/artflip-thumbs/437827.webp",
  "./assets/artflip-thumbs/459191.webp",
  "./assets/artflip-thumbs/64916.webp",
  "./assets/artflip-thumbs/835151.webp",
  "./assets/my-studio/graphite-couple-figure-study.webp",
  "./assets/my-studio/charcoal-figure-study-collage.webp",
  "./assets/my-studio/classical-boudoir-reclining-study.webp"
];
self.addEventListener('install',event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate',event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('naked-canvas-shell-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch',event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // Never intercept Pollinations OAuth/API or museum traffic.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response && response.ok) caches.open(CACHE_NAME).then(cache => cache.put('./index.html',response.clone()));
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match('./index.html')) || new Response('Naked Canvas is offline. Reconnect and reload.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}})));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response && response.ok && response.type === 'basic') caches.open(CACHE_NAME).then(cache => cache.put(request,response.clone()));
    return response;
  }).catch(() => new Response('',{status:504,statusText:'Offline'}))));
});
