// FlatSplit Service Worker v2
var CACHE = 'flatsplit-v2';
var FILES = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install - cache all files
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return Promise.allSettled(
        FILES.map(function(f) { return cache.add(f).catch(function(){}) })
      );
    }).then(function() { return self.skipWaiting(); })
  );
});

// Activate - clean old caches
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', function(e) {
  // Skip non-GET and Firebase requests
  if (e.request.method !== 'GET') return;
  if (e.request.url.indexOf('firebaseio.com') > -1) return;
  if (e.request.url.indexOf('googleapis.com') > -1) return;
  if (e.request.url.indexOf('gstatic.com') > -1) return;

  e.respondWith(
    caches.match(e.request).then(function(cached) {
      var network = fetch(e.request).then(function(res) {
        if (res && res.status === 200 && res.type !== 'opaque') {
          var clone = res.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return res;
      }).catch(function() { return cached; });
      return cached || network;
    })
  );
});

// Show notification
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data ? e.data.json() : {}; } catch(x) {}
  e.waitUntil(
    self.registration.showNotification(data.title || 'FlatSplit', {
      body: data.body || '',
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: 'flatsplit'
    })
  );
});

// Notification click - open app
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.indexOf('FlatSplit') > -1) return list[i].focus();
      }
      return clients.openWindow('./index.html');
    })
  );
});
