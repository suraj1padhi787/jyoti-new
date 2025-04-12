// ✅ Cache static files for offline use
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('chat-cache').then(cache => {
      return cache.addAll([
        '/',
        '/css/style.css',
        '/manifest.json'
        // ❌ '/chat' deliberately removed to avoid stale HTML
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

// ✅ Handle push notifications (background messages)
self.addEventListener('push', e => {
  const data = e.data.json();

  const options = {
    body: data.body,
    icon: '/icons/app-icon.png',
    badge: '/icons/app-icon.png',
    data: {
      url: data.url || '/' // Open app on click
    }
  };

  e.waitUntil(
    self.registration.showNotification("Love se message aaya 💌", options)
  );
});

// ✅ When user clicks on notification
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.openWindow(e.notification.data.url || '/')
  );
});

// ✅ Optional: Clear old caches on version change
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== 'chat-cache') {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});
