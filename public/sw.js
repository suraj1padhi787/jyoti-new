// ✅ Cache static files for offline use (but NOT /chat)
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('chat-cache-v2').then(cache => {
      return cache.addAll([
        '/', // home page
        '/css/style.css',
        '/manifest.json'
        // ❌ DO NOT cache /chat page to avoid blank refresh
      ]);
    })
  );
});

// ✅ Serve from cache when available
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});

// ✅ Handle push notifications (when app is in background)
self.addEventListener('push', e => {
  const data = e.data.json();

  const options = {
    body: data.body,
    icon: '/icons/app-icon.png',
    badge: '/icons/app-icon.png',
    data: {
      url: data.url || '/' // URL to open when clicked
    }
  };

  e.waitUntil(
    self.registration.showNotification("Love se message aaya 💌", options)
  );
});

// ✅ When user clicks notification → open app
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.openWindow(e.notification.data.url || '/')
  );
});

// ✅ Force clear old caches if version changes
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== 'chat-cache-v2') {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});
