// FlatSplit service worker — v4 refreshes the app shell after the Individual feature update.
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const CACHE_NAME='flatsplit-v4';
const APP_SHELL=['./index.html','./manifest.json','./icon-192.png','./icon-512.png'];

firebase.initializeApp({apiKey:"AIzaSyBuRU5IDAYW7vuB1YGepz6AFOx4sbdL_3M",projectId:"flatsplit-2ed50",messagingSenderId:"67580521737",appId:"1:67580521737:web:281f9c287b83ec398d37d8"});
const messaging=firebase.messaging();
messaging.onBackgroundMessage((p)=>{
  self.registration.showNotification(p.notification.title||'FlatSplit',{body:p.notification.body,icon:'./icon-192.png'});
});

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{const clone=r.clone();caches.open(CACHE_NAME).then(cache=>cache.put(e.request,clone));return r;})));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(let i=0;i<list.length;i++){if('focus' in list[i])return list[i].focus();}
    return clients.openWindow('./index.html');
  }));
});
