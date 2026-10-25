/* ============================================================
   Elliana The Shop — service worker (offline support)
   ------------------------------------------------------------
   Caches the app shell so it opens with no network. Sales data
   still syncs through Supabase when a connection is available.
   Bump CACHE_VERSION whenever you change the app files, so
   devices pull the new version instead of a stale cache.
   ============================================================ */
const CACHE_VERSION = 'elliana-v1';
const APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './logo.png',
  './manifest.json',
  './supabase-config.js'
];

/* Install: pre-cache the app shell. */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

/* Activate: remove old caches. */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Fetch strategy:
   - Never cache Supabase / cross-origin API calls — always go to network.
   - For same-origin app files: network-first, fall back to cache offline. */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Let Supabase (and any other cross-origin) requests pass straight through.
  if (!sameOrigin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
  );
});
