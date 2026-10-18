/* 離線支援：cache-first。更新內容 → 改 js/version.js 個數字 */
importScripts('js/version.js', 'js/words.js', 'js/animals.js', 'js/voices.js');
const CACHE = 'dino-eggs-v' + self.APP_VERSION;
const CORE = [
  './', 'index.html', 'css/style.css', 'manifest.webmanifest',
  'css/hero.css', 'css/rex.css', 'css/endings.css', 'css/snake.css', 'fonts/wenkai-subset.woff2', 'fonts/andika-subset.woff2',
  'js/version.js', 'js/words.js', 'js/animals.js', 'js/voices.js', 'js/art.js', 'js/audio.js',
  'js/hero-art.js', 'js/hero.js', 'js/rex-art.js', 'js/rex.js',
  'js/snake-art.js', 'js/snake.js',
  'js/endings-art.js', 'js/rewards.js', 'js/boss.js', 'js/game.js',
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

// 程式檔：有網就攞最新（network-first），冇網先用 cache —— 咁更新一 push 就見到
// 錄音 mp3：cache-first（大、少改）
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const isAudio = new URL(req.url).pathname.endsWith('.mp3');
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    if (isAudio) {
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
    }
    try {
      const res = await fetch(req, isAudio ? undefined : { cache: 'no-cache' });
      if (res.ok) cache.put(req, res.clone());
      return res;
    } catch (err) {
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      if (req.mode === 'navigate') return (await cache.match('index.html')) || Response.error();
      return Response.error();
    }
  })());
});
