importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBNYpqpen3n_UwrP4k1wQaengh8174lIxGU",
  authDomain: "ketoca-notifications.firebaseapp.com",
  projectId: "ketoca-notifications",
  storageBucket: "ketoca-notifications.firebasestorage.app",
  messagingSenderId: "114583896401",
  appId: "1:114583896401:web:8e040b1302a59b9f61d370"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification ? payload.notification.title : 'Notificación de KETOCA';
  const notificationOptions = {
    body: payload.notification ? payload.notification.body : '',
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});