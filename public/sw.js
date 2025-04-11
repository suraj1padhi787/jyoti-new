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

// ✅ Handle push notification
self.addEventListener('push', e => {
  const data = e.data.json();
  self.registration.showNotification("Love se message aaya 💌", {
    body: data.body,
    icon: '/icons/app-icon.png'
  });
});
