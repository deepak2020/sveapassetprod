// Sveapasset push notification service worker
// Handles incoming push messages and routes clicks back into the app.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: 'Sveapasset', body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'Sveapasset';
  const options = {
    body: data.body || 'Dags att öva svenska!',
    icon: data.icon || 'https://base44.com/logo_v2.svg',
    badge: data.badge || 'https://base44.com/logo_v2.svg',
    tag: data.tag || 'sveapasset-reminder',
    renotify: true,
    data: {
      url: data.url || '/dashboard',
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/dashboard';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Focus an existing tab if open
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
