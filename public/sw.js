const CACHE_NAME = 'umi-matcha-v1';
const STATIC_CACHE = 'umi-static-v1';
const DYNAMIC_CACHE = 'umi-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Cache strategies
const CACHE_STRATEGIES = {
  images: 'cache-first',
  fonts: 'cache-first', 
  api: 'network-first',
  pages: 'stale-while-revalidate'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE;
            })
            .map((cacheName) => {
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip media files that use range requests
  if (isMedia(request)) return;

  // Handle different resource types
  if (isImage(request)) {
    event.respondWith(cacheFirst(request));
  } else if (isFont(request)) {
    event.respondWith(cacheFirst(request));
  } else if (isAPI(request)) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Helper function to check if response is cacheable
function isCacheable(response) {
  return response && 
         response.ok && 
         response.status >= 200 && 
         response.status < 300 && 
         response.status !== 206 && // Exclude partial content
         response.type !== 'opaque'; // Exclude opaque responses
}

// Cache strategies implementation
async function cacheFirst(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (isCacheable(response)) {
      // Clone response before caching (responses can only be consumed once)
      const responseToCache = response.clone();
      await cache.put(request, responseToCache);
    }
    return response;
  } catch (error) {
    console.error('Cache first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const response = await fetch(request);
    if (isCacheable(response)) {
      // Clone response before caching
      const responseToCache = response.clone();
      await cache.put(request, responseToCache);
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(async (response) => {
    if (isCacheable(response)) {
      // Clone response before caching
      const responseToCache = response.clone();
      await cache.put(request, responseToCache);
    }
    return response;
  }).catch(() => null);
  
  return cached || await fetchPromise || new Response('Offline', { status: 503 });
}

// Helper functions
function isImage(request) {
  return request.destination === 'image' || 
         request.headers.get('accept')?.includes('image');
}

function isFont(request) {
  return request.destination === 'font' ||
         request.url.includes('.woff') ||
         request.url.includes('.ttf');
}

function isAPI(request) {
  return request.url.includes('/api/') ||
         request.url.includes('shopify.com');
}

function isMedia(request) {
  return request.destination === 'video' ||
         request.destination === 'audio' ||
         request.url.includes('.mp4') ||
         request.url.includes('.webm') ||
         request.url.includes('.mp3') ||
         request.url.includes('.wav');
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Retry failed API calls
      retryFailedRequests()
    );
  }
});

async function retryFailedRequests() {
  // Implementation for retrying failed requests
  // This could include cart updates, form submissions, etc.
}
