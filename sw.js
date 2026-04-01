const CACHE_NAME = 'g2g-v16';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  // Chapters
  './chapters/ch1.html',
  './chapters/ch2.html',
  './chapters/ch3.html',
  './chapters/ch4.html',
  './chapters/ch5.html',
  './chapters/ch6.html',
  './chapters/ch7.html',
  './chapters/ch8.html',
  './chapters/ch9.html',
  './chapters/ch10.html',
  './chapters/ch11.html',
  './chapters/ch12.html',
  './chapters/ch13.html',
  './chapters/ch14.html',
  './chapters/ch15.html',
  './chapters/ch16.html',
  './chapters/ch17.html',
  './chapters/ch18.html',
  './chapters/ch19.html',
  './chapters/ch20.html',
  './chapters/ch21.html',
  './chapters/ch22.html',
  './chapters/ch23.html',
  './chapters/ch24.html',
  './chapters/ch25.html',
  './chapters/ch26.html',
  './chapters/ch27.html',
  './chapters/ch28.html',
  // Images
  './images/le-pitch.jpg',
  './images/trace.jpg',
  './images/haircut.jpg',
  './images/wilhelm.jpg',
  './images/magda.jpg',
  './images/og-preview.png',
  // Icons
  './icons/favicon-32x32.png',
  './icons/favicon-16x16.png',
  './icons/apple-touch-icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  // Fonts
  'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap'
];

// Install: cache all core assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for assets, network-first for pages
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request).then(r => r || caches.match('./')))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      }))
    );
  }
});
