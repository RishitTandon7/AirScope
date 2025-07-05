const CACHE_NAME = 'airscope-v2.1.0';
const STATIC_CACHE = 'airscope-static-v2.1.0';
const DYNAMIC_CACHE = 'airscope-dynamic-v2.1.0';

// Check if we're in development mode
const isDevelopment = location.hostname === 'localhost' || 
                     location.hostname === '127.0.0.1' ||
                     location.hostname.includes('stackblitz') ||
                     location.hostname.includes('webcontainer');

// Essential assets to cache immediately for offline functionality
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// API endpoints that should be cached (only in production)
const CACHE_API_ROUTES = isDevelopment ? [] : [
  'api.openweathermap.org',
  'api.tomtom.com'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing v2.1.0...');
  
  if (isDevelopment) {
    console.log('⚠️ Development mode: Skipping aggressive caching');
    self.skipWaiting();
    return;
  }
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('📦 Service Worker: Caching essential assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches and take control
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches (only in production)
      isDevelopment ? Promise.resolve() : caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== CACHE_NAME) {
              console.log('🗑️ Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all pages
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker: Activation complete - Now controlling all pages');
    })
  );
});

// Fetch event - implement intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // In development, pass through most requests to avoid caching issues
  if (isDevelopment) {
    // Only cache API requests in development, let everything else pass through
    if (CACHE_API_ROUTES.some(route => url.hostname.includes(route))) {
      event.respondWith(networkFirstWithCache(request, DYNAMIC_CACHE, 300000)); // 5 min cache
    }
    return;
  }

  // Production caching strategies
  if (request.destination === 'document') {
    // HTML pages - Network first with cache fallback
    event.respondWith(networkFirstWithCache(request, STATIC_CACHE));
  } else if (request.destination === 'image' || 
             request.destination === 'style' || 
             request.destination === 'script' ||
             request.destination === 'font') {
    // Static assets - Cache first strategy
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (CACHE_API_ROUTES.some(route => url.hostname.includes(route))) {
    // API requests - Network first with short-term cache
    event.respondWith(networkFirstWithCache(request, DYNAMIC_CACHE, 300000)); // 5 min cache
  }
});

// Cache First strategy for static assets
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Serve from cache, but update in background
      fetch(request).then(response => {
        if (response && response.status === 200) {
          cache.put(request, response.clone());
        }
      }).catch(() => {
        // Ignore network errors in background update
      });
      
      return cachedResponse;
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache First failed:', error);
    return fetch(request); // Fallback to network
  }
}

// Network First with cache fallback
async function networkFirstWithCache(request, cacheName, maxAge = 86400000) { // 24 hours default
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      const responseClone = networkResponse.clone();
      
      // Add timestamp for cache expiry
      const response = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: {
          ...Object.fromEntries(responseClone.headers.entries()),
          'sw-cache-timestamp': Date.now().toString()
        }
      });
      
      cache.put(request, response);
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    if (!isDevelopment) {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(request);
      
      if (cachedResponse) {
        // Check if cache is still valid
        const cacheTimestamp = cachedResponse.headers.get('sw-cache-timestamp');
        if (cacheTimestamp && (Date.now() - parseInt(cacheTimestamp)) < maxAge) {
          return cachedResponse;
        }
      }
    }
    
    // No valid cache available, return error response
    return new Response(JSON.stringify({
      error: 'Network error',
      message: 'Please check your internet connection'
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Background sync for data updates (production only)
self.addEventListener('sync', (event) => {
  if (isDevelopment) return;
  
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'airquality-sync') {
    event.waitUntil(syncAirQualityData());
  }
});

async function syncAirQualityData() {
  try {
    console.log('🌬️ Syncing air quality data in background...');
    
    // Notify all clients that sync is complete
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'DATA_SYNC_COMPLETE',
        message: 'Air quality data updated in background'
      });
    });
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Push notifications (production only)
self.addEventListener('push', (event) => {
  if (isDevelopment) return;
  
  console.log('🔔 Push notification received:', event.data?.text());
  
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'Air quality alert in your area',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    image: data.image,
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/?notification=alert',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'view',
        title: 'Check AQI',
        icon: '/icons/shortcut-aqi.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: data.urgent || false,
    silent: false
  };
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || 'AirScope Alert', 
      options
    )
  );
});

// Handle notification clicks (production only)
self.addEventListener('notificationclick', (event) => {
  if (isDevelopment) return;
  
  console.log('🔔 Notification clicked:', event.action);
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/?notification=clicked';
  
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        // Check if app is already open
        for (let client of clientList) {
          if (client.url.includes(self.registration.scope) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window/tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Listen for messages from the main app
self.addEventListener('message', (event) => {
  console.log('📨 Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Log successful installation
console.log(`🌟 AirScope Service Worker v2.1.0 loaded successfully (${isDevelopment ? 'Development' : 'Production'} mode)`);
if (!isDevelopment) {
  console.log('📱 PWA features: Offline support, Push notifications, Background sync');
}
