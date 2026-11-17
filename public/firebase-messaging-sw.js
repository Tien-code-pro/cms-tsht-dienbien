importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

 //the Firebase config object 
const firebaseConfig = {
    apiKey: "AIzaSyBHmYmXO1pS0pT0i9K1e0ViTRnIkYvl82E",
  authDomain: "vtc-digital-notification.firebaseapp.com",
  projectId: "vtc-digital-notification",
  storageBucket: "vtc-digital-notification.appspot.com",
  messagingSenderId: "345992558411",
  appId: "1:345992558411:web:4e6595d7126338ef86dace",
  measurementId: "G-0LC4RWQCHN",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();


messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png",
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});