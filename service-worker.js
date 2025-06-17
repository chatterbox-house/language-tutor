const CACHE_NAME = 'nandomode-cache-v1';
const urlsToCache = [
  './',
  'index.html',
  'vocab.js',
  'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
  // Placeholder images for icons (replace with real icons in a production app)
  'https://placehold.co/48x48/1a1a2e/ffffff?text=N',
  'https://placehold.co/72x72/1a1a2e/ffffff?text=N',
  'https://placehold.co/96x96/1a1a2e/ffffff?text=N',
  'https://placehold.co/144x144/1a1a2e/ffffff?text=N',
  'https://placehold.co/168x168/1a1a2e/ffffff?text=N',
  'https://placehold.co/192x192/1a1a2e/ffffff?text=N',
  'https://placehold.co/512x512/1a1a2e/ffffff?text=N'
];

// Install event: cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serve from cache or fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
        return fetch(event.request).catch(() => {
          // If network also fails, you can return a fallback page
          // For now, it will just throw a network error
          console.error('Fetch failed and no cache match for:', event.request.url);
          // Example: return caches.match('offline.html'); if you have an offline page
        });
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
