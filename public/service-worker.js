// Service Worker for Push-up Journey App

const CACHE_NAME = 'pushup-journey-v2'; // Increment cache version
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/vite.svg',
  '/manifest.json'
];

// Log any errors that occur in the service worker
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('Service Worker: Installed');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        console.log('Service Worker: Activating');
        return Promise.all(
          cacheNames.filter((name) => {
            return name !== CACHE_NAME;
          }).map((name) => {
            console.log('Service Worker: Clearing old cache:', name);
            return caches.delete(name);
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
      .catch(error => {
        console.error('Service Worker: Activation failed:', error);
      })
  );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response because it's a one-time use stream
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.error('Service Worker: Cache write failed:', error);
              });
              
            return response;
          })
          .catch(error => {
            console.error('Service Worker: Fetch failed:', error);
            // Return a fallback response or the error
            return new Response('Network error occurred', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Push event - handle push notifications
self.addEventListener('push', (event) => {
  try {
    let data = {};
    if (event.data) {
      try {
        data = event.data.json();
      } catch (e) {
        console.log('Service Worker: Push data is not JSON, using text');
        data = {
          title: 'Push-up Journey',
          body: event.data.text()
        };
      }
    }

    const title = data.title || 'Push-up Journey Reminder';
    const options = {
      body: data.body || 'Time to do your push-ups!',
      icon: data.icon || '/vite.svg',
      badge: data.badge || '/vite.svg',
      data: data.data || {},
      requireInteraction: data.requireInteraction || true
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
        .catch(error => {
          console.error('Service Worker: Notification failed:', error);
        })
    );
  } catch (error) {
    console.error('Service Worker: Push event handling failed:', error);
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  try {
    event.notification.close();

    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then((clientList) => {
          // If a window client is already open, focus it
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus();
            }
          }
          // Otherwise open a new window
          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
        .catch(error => {
          console.error('Service Worker: Notification click handling failed:', error);
        })
    );
  } catch (error) {
    console.error('Service Worker: Notification click event failed:', error);
  }
}); 