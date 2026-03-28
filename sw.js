// Service Worker for Beauty Bar Salon
const CACHE_NAME = 'beauty-bar-v3';
const OFFLINE_URL = '/offline.html';

// Files to cache for offline access
const urlsToCache = [
  '/',
  '/index.html',
  '/booking.html',
  '/history.html',
  '/gift-card.html',
  '/offline.html',
  '/css/style.css',
  '/js/main.js',
  '/js/auth.js',
  '/js/booking.js',
  '/js/gallery.js',
  '/js/data-service.js',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/sounds/notification.mp3'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }
  
  // For other requests
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200) {
              return response;
            }
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
            return response;
          });
      })
  );
});

// Push Notification Event
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push Received:', event);
  
  let data = {
    title: 'Beauty Bar Salon',
    body: 'New update from Beauty Bar!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    sound: '/sounds/notification.mp3',
    actions: [
      { action: 'view', title: 'View Now' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };
  
  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    vibrate: data.vibrate,
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now()
    },
    actions: data.actions,
    requireInteraction: true,
    tag: 'beauty-bar-notification'
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click:', event);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background Sync for offline bookings
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Sync event:', event.tag);
  
  if (event.tag === 'sync-bookings') {
    event.waitUntil(syncBookings());
  }
});

async function syncBookings() {
  try {
    const clients = await self.clients.matchAll();
    if (clients.length > 0) {
      clients[0].postMessage({
        type: 'SYNC_BOOKINGS',
        data: { timestamp: Date.now() }
      });
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}
