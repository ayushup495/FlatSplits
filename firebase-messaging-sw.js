importScripts('https://www.gstatic.com/firebasejs/10.x/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.x/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  projectId: "flatsplit-2ed50",
  messagingSenderId: "67580521737",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();
