// A simple service worker to satisfy PWA requirements
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
  // We just let the request through. This is enough for Chrome to show the Install prompt.
  e.respondWith(fetch(e.request));
});
