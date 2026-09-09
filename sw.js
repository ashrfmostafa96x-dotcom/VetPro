// Minimal service worker — just enough to satisfy PWA/store requirements.
// It caches the app shell so the page still loads (from cache) if opened
// without internet, though the app's actual data/sync features still need a
// real connection as usual.
const CACHE_NAME = 'vetpro-shell-v3';
const SHELL_FILES = ['./index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // `cache: 'reload'` forces this fetch to bypass the browser's own HTTP
  // cache and always hit the real network — without it, "network-first"
  // here was still silently served a stale HTTP-cached copy of index.html
  // by the browser itself (independent of this Cache Storage / Service
  // Worker layer entirely), which is exactly what kept showing an old
  // version after every update no matter how many times the cache above
  // was bumped or cleared.
  event.respondWith(
    fetch(event.request, { cache: 'reload' }).catch(() => caches.match(event.request))
  );
});
