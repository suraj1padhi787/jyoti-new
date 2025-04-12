// ✅ Cache for offline PWA support
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('chat-cache').then(cache => {
      return cache.addAll([
        '/',
        '/chat',
        '/css/style.css',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});

// ✅ Push Notification Handler
self.addEventListener('push', e => {
  const data = e.data.json();
  const options = {
    body: data.body,
    icon: '/icons/app-icon.png',
    badge: '/icons/app-icon.png',
    data: { url: data.url || '/' }
  };
  e.waitUntil(
    self.registration.showNotification("Love se message aaya 💌", options)
  );
});

// ✅ On Notification Click → Open app
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.openWindow(e.notification.data.url || '/')
  );
});
