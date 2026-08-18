// FlatSplit service worker — caches the app shell so the UI still loads offline.
// Expense data itself lives in Firebase + localStorage, not in this cache.
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');
const CACHE_NAME='flatsplit-v2';
const APP_SHELL=['./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
firebase.initializeApp({apiKey:"AIzaSyBuRU5IDAYW7vuB1YGepz6AFOx4sbdL_3M",projectId:"flatsplit-2ed50",messagingSenderId:"67580521737",appId:"1:67580521737:web:281f9c287b83ec398d37d8"});
const messaging=firebase.messaging();
messaging.onBackgroundMessage((p)=>{
  self.registration.showNotification(p.notification.title||"FlatSplit",{body:p.notification.body,icon:'./icon-192.png'});
});
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{
  var req=e.request;if(req.method!=='GET')return;
  e.respondWith(caches.match(req).then(c=>c||fetch(req).then(r=>{var cl=r.clone();caches.open(CACHE_NAME).then(ch=>ch.put(req,cl));return r;})));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{
    for(var i=0;i<l.length;i++){if('focus'in l[i])return l[i].focus();}
    return clients.openWindow('./index.html');
  }));
});
