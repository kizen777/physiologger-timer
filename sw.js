// PhysioPacer Service Worker (PWA Offline Audio Cache)
const CACHE_NAME = 'physiopacer-cache-v1';
const ASSETS_TO_CACHE = [
  './timer.html',
  './audio/stage1_marcello_adagio.mp3',
  './audio/stage2_carefree.mp3',
  './audio/stage3_electro_cabello.mp3',
  './audio/stage4_movement_proposition.mp3',
  './audio/stage5_bossa_antigua.mp3',
  './audio/stage6_the_swan.mp3',
  './audio/rest_albinoni_adagio.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline audio and timer assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // キャッシュにあればキャッシュを返し、なければネットワークへ
      return response || fetch(event.request);
    })
  );
});
