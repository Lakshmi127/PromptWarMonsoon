/**
 * MonsoonGuard AI - Service Worker
 * Provides offline support and PWA functionality
 */

const CACHE_NAME = 'monsoonguard-v1';
const STATIC_CACHE = 'monsoonguard-static-v1';
const DYNAMIC_CACHE = 'monsoonguard-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/components.css',
    '/css/responsive.css',
    '/js/app.js',
    '/js/ai-engine.js',
    '/js/weather.js',
    '/js/geolocation.js',
    '/js/alerts.js',
    '/js/storage.js',
    '/js/i18n.js',
    '/js/maps.js',
    '/js/checklist.js',
    '/js/pdf-export.js',
    '/manifest.json'
];

// External resources to cache
const EXTERNAL_RESOURCES = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&display=swap',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[Service Worker] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[Service Worker] Static assets cached');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Install failed:', error);
            })
    );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Old caches cleaned');
                return self.clients.claim();
            })
    );
});

/**
 * Fetch event - serve from cache with network fallback
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension URLs
    if (request.url.startsWith('chrome-extension://')) {
        return;
    }
    
    // Skip API calls
    if (url.origin.includes('api.open-meteo.com') || 
        url.origin.includes('generativelanguage.googleapis.com') ||
        url.origin.includes('nominatim.openstreetmap.org')) {
        return;
    }
    
    // Handle static assets
    if (STATIC_ASSETS.some(asset => url.pathname === asset || url.pathname.endsWith(asset))) {
        event.respondWith(
            caches.match(request)
                .then((response) => {
                    if (response) {
                        return response;
                    }
                    return fetch(request).then((response) => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        const responseToCache = response.clone();
                        caches.open(STATIC_CACHE)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });
                        
                        return response;
                    });
                })
                .catch((error) => {
                    console.error('[Service Worker] Fetch failed:', error);
                    return new Response('Offline', { status: 503 });
                })
        );
        return;
    }
    
    // Handle external resources (fonts, Leaflet)
    if (EXTERNAL_RESOURCES.some(resource => url.href.includes(resource))) {
        event.respondWith(
            caches.match(request)
                .then((response) => {
                    if (response) {
                        return response;
                    }
                    return fetch(request).then((response) => {
                        if (!response || response.status !== 200) {
                            return response;
                        }
                        
                        const responseToCache = response.clone();
                        caches.open(STATIC_CACHE)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });
                        
                        return response;
                    });
                })
        );
        return;
    }
    
    // Network first, fallback to cache for dynamic content
    event.respondWith(
        fetch(request)
            .then((response) => {
                if (!response || response.status !== 200) {
                    return caches.match(request);
                }
                
                const responseToCache = response.clone();
                caches.open(DYNAMIC_CACHE)
                    .then((cache) => {
                        cache.put(request, responseToCache);
                    });
                
                return response;
            })
            .catch(() => {
                return caches.match(request);
            })
    );
});

/**
 * Message event - handle messages from clients
 */
self.addEventListener('message', (event) => {
    const { data } = event;
    
    if (data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                    return cache.addAll(data.urls);
                })
        );
    }
    
    if (data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys()
                .then((cacheNames) => {
                    return Promise.all(
                        cacheNames.map((cacheName) => caches.delete(cacheName))
                    );
                })
                .then(() => {
                    return self.clients.matchAll();
                })
                .then((clients) => {
                    clients.forEach((client) => {
                        client.postMessage({ type: 'CACHE_CLEARED' });
                    });
                })
        );
    }
});

/**
 * Push event - handle push notifications
 */
self.addEventListener('push', (event) => {
    const options = {
        body: event.data?.text() || 'New weather alert from MonsoonGuard AI',
        icon: '/assets/icons/favicon.svg',
        badge: '/assets/icons/favicon.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'View Details',
                icon: '/assets/icons/favicon.svg'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/assets/icons/favicon.svg'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('MonsoonGuard AI', options)
    );
});

/**
 * Notification click event
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

/**
 * Background sync event
 */
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

/**
 * Sync data with server
 */
async function syncData() {
    try {
        // Implement data sync logic here
        console.log('[Service Worker] Syncing data...');
    } catch (error) {
        console.error('[Service Worker] Sync failed:', error);
    }
}

/**
 * Periodic background sync (if supported)
 */
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'weather-update') {
        event.waitUntil(updateWeatherData());
    }
});

/**
 * Update weather data in background
 */
async function updateWeatherData() {
    try {
        // Implement weather data update logic
        console.log('[Service Worker] Updating weather data...');
    } catch (error) {
        console.error('[Service Worker] Weather update failed:', error);
    }
}
