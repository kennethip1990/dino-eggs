/* 離線支援：cache-first。更新內容 → 改 js/version.js 個數字 */
importScripts('js/version.js', 'js/voices.js');
const CACHE = 'dino-eggs-v' + self.APP_VERSION;
const CORE = [
  './', 'index.html', 'css/style.css', 'manifest.webmanifest',
  'js/version.js', 'js/voices.js', 'js/art.js', 'js/audio.js', 'js/game.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    // 錄音：有就 cache，冇就算（之後用內置語音）
    const keys = Object.keys(self.VOICES.clips);
    await Promise.all(keys.map(async (k) => {
      try {
        const url = self.VOICES.audioDir + k + self.VOICES.ext;
        const res = await fetch(url, { cache: 'no-cache' });
        if (res.ok) await cache.put(url, res);
      } catch (err) {}
    }));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res.ok) cache.put(req, res.clone());
      return res;
    } catch (err) {
      if (req.mode === 'navigate') return (await cache.match('index.html')) || Response.error();
      return Response.error();
    }
  })());
});
