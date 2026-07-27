const CACHE_NAME = 'nyaya-setu-v1';
const APP_SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event - Pre-cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching Nyaya Setu app shell');
      return cache.addAll(APP_SHELL_ASSETS).catch((err) => {
        console.warn('[Service Worker] Pre-cache partial fail:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean up stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Serve cached app shell or network fallback
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Handle API request when offline
  if (requestUrl.pathname === '/api/chat' && event.request.method === 'POST') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Return offline JSON response
        const offlineReply = {
          reply: `Aap abhi Offline Mode mein hain. Internet connectivity waapas aane par full AI search kaam karega.

Aap abhi bhi app mein zaroori Helpline Numbers aur BNS Knowledge Base dekh sakte hain:
• Police Emergency: 112
• Cyber Fraud Helpline: 1930
• Women Helpline: 1091 ya 181
• Child Helpline: 1098
• Legal Aid Helpline: 15100

Aap Upar 'BNS Knowledge Base' aur 'Emergency Help' buttons par click karke offline legal guides padh sakte hain.

I am an AI assistant, not a lawyer. For court cases, consult a legal professional.`
        };
        return new Response(JSON.stringify(offlineReply), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Network-first for html/app shell with cache fallback
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
          return caches.match('/index.html') || caches.match('/');
        })
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Update cache in background
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {/* Ignore network errors when fetching asset background update */});

        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
