<script>
  // Register service worker for push
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }

  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }

  socket.on("chat", function(data) {
    if (Notification.permission === "granted" && data.user !== "<%= user %>") {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification("Love se message aaya 💌", {
          body: `${data.user}: ${data.msg || 'Sent something'}`,
          icon: "/icons/app-icon.png",
          badge: "/icons/app-icon.png",
          data: {
            url: "/chat" // App open path on notification click
          }
        });
      });
    }
  });
</script>
