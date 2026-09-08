// A simple service worker to satisfy PWA requirements
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
  // We just let the request through, but catch network errors to prevent console spam
  e.respondWith(
    fetch(e.request).catch((err) => {
      console.log('[Service Worker] Network request failed:', err);
      // Return a simple offline response to avoid Uncaught Promise TypeError
      return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    })
  );
});
