// Minimal service worker — just enough to satisfy PWA/store requirements.
// It caches the app shell so the page still loads (from cache) if opened
// without internet, though the app's actual data/sync features still need a
// real connection as usual.
const CACHE_NAME = 'vetpro-shell-v1';
const SHELL_FILES = ['/index.html', '/manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
