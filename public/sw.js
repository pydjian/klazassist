/* ============================================================================
   KlazAssist — Service Worker
   Strategy:
     • App shell (HTML, JS, CSS, fonts, icons) → cache-first
     • CDN libraries (pdf.js, mammoth, pptxgen, xlsx) → stale-while-revalidate
     • Google Fonts → cache-first (with network fallback)
     • API calls (Gemini, Pollinations, Kavel, Web3Forms) → network-only
     • Everything else → network, then cache
   ============================================================================ */

const VERSION    = 'klaz-v1.0.0';           // bump this on every release
const STATIC     = `${VERSION}-static`;
const RUNTIME    = `${VERSION}-runtime`;

// Files that make up the app shell. Vite hashes the built JS/CSS, so we
// can't list them exactly — we rely on the runtime cache for those.
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon/icon.svg',
  './icon/icon-192.png',
  './icon/icon-512.png',
  './icon/deped.webp'
];

// Hosts we never cache — auth'd and dynamic content
const NETWORK_ONLY_HOSTS = [
  'generativelanguage.googleapis.com',
  'api.web3forms.com',
  'api.kavel.ai'
];

// Hosts we treat as "asset libraries" → stale-while-revalidate
const SWR_HOSTS = [
  'cdnjs.cloudflare.com',
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

/* ---------------- Install ---------------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC)
      .then((cache) => cache.addAll(PRECACHE.map(u => new Request(u, { cache: 'reload' }))))
      .catch((err) => console.warn('[SW] Precache partial failure:', err))
      .then(() => self.skipWaiting())
  );
});

/* ---------------- Activate ---------------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('klaz-') && k !== STATIC && k !== RUNTIME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ---------------- Fetch ---------------- */
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET. POST/PUT (Gemini, Web3Forms) pass straight through.
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 1. Never cache API calls
  if (NETWORK_ONLY_HOSTS.includes(url.hostname)) return;

  // 2. Asset libraries — stale-while-revalidate
  if (SWR_HOSTS.includes(url.hostname)) {
    event.respondWith(staleWhileRevalidate(req, RUNTIME));
    return;
  }

  // 3. Same-origin navigation → SPA fallback to index.html
  if (url.origin === self.location.origin && req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match('./index.html')))
    );
    return;
  }

  // 4. Same-origin assets → cache-first, then network, then cache network response
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(req, RUNTIME));
    return;
  }

  // 5. Anything else — try network, fall back to cache
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});

/* ---------------- Helpers ---------------- */
async function cacheFirst(req, cacheName) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.status === 200 && res.type !== 'opaque') {
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone());
    }
    return res;
  } catch (err) {
    // Offline and not cached — return a minimal fallback for images
    if (req.destination === 'image') {
      return new Response('', { status: 204 });
    }
    throw err;
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);

  const fetchPromise = fetch(req)
    .then((res) => {
      if (res && res.status === 200) cache.put(req, res.clone());
      return res;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

/* ---------------- Message bridge (for "update available") ---------------- */
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});