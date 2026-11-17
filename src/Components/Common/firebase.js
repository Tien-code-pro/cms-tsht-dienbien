// import { initializeApp } from "firebase/app";

// import { getMessaging, onMessage, getToken } from "firebase/messaging";

// // Initialize the Firebase app in the service worker by passing in
// // your app's Firebase config object.
// // https://firebase.google.com/docs/web/setup#config-object

// const firebaseApp = initializeApp({
//   apiKey: "AIzaSyBHmYmXO1pS0pT0i9K1e0ViTRnIkYvl82E",
//   authDomain: "vtc-digital-notification.firebaseapp.com",
//   projectId: "vtc-digital-notification",
//   storageBucket: "vtc-digital-notification.appspot.com",
//   messagingSenderId: "345992558411",
//   appId: "1:345992558411:web:4e6595d7126338ef86dace",
//   measurementId: "G-0LC4RWQCHN",
// });
// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// export const messaging = getMessaging(firebaseApp);
// export const getFCMToken = async (setTokenFount) => {
//   let currentToken = "";
//   try {
//     currentToken = await getToken(messaging, {
//       vapidKey:
//         "BK8YC4xjmYwUSoKlmlqt0cjv2JYklPsosEPPiJhbjweltu-KFE5mqIfH1S5plj2sjBqvtFASjOeVNrYa419Tpms",
//     });
//     if (currentToken) {
//       setTokenFount(true);
//     } else {
//       setTokenFount(false);
//     }
//   } catch (error) {
//     console.log(`An error while retrieving token: ${error}`);
//   }
//   return currentToken;
// };
// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       resolve(payload);
//     });
//   });
