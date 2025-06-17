const CACHE_NAME = 'nandomode-cache-v1';
const urlsToCache = [
  './',
  'index.html',
  'vocab.js',
  'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
  // Real but vaguely related images for icons
  'https://cdn.pixabay.com/photo/2016/11/18/19/07/abstract-1836798_960_720.png', // Example 48x48 suitable
  'https://cdn.pixabay.com/photo/2017/08/30/01/05/abstract-2694154_960_720.png', // Example 72x72 suitable
  'https://cdn.pixabay.com/photo/2017/06/07/19/27/fantasy-2381283_960_720.png', // Example 96x96 suitable
  'https://cdn.pixabay.com/photo/2017/02/08/17/24/fantasy-2049567_960_720.jpg', // Example 144x144 suitable
  'https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3083283_960_720.jpg', // Example 168x168 suitable
  'https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_960_720.jpg', // Example 192x192 suitable
  'https://cdn.pixabay.com/photo/2016/06/25/12/52/galaxy-1479836_960_720.jpg'  // Example 512x512 suitable
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
