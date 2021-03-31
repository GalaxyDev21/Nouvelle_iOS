import * as firebase from 'firebase';
import 'firebase/firestore';
//import 'firebase/messaging';
const firebaseConfig = {
  apiKey: "AIzaSyDAzXzmnHzFroUPePZs4Ds-PN6VVbfKBXc",
  authDomain: "nouvelle-3abdc.firebaseapp.com",
  databaseURL: "https://nouvelle-3abdc.firebaseio.com",
  projectId: "nouvelle-3abdc",
  storageBucket: "nouvelle-3abdc.appspot.com",
  messagingSenderId: "612263948749",
  appId: "1:612263948749:web:03e79975204c54d2fa1484",
  measurementId: "G-BQX9Q7XKD6",
}; 
let fire = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore(fire);

// const messaging = firebase.messaging();
// messaging.requestPermission().then(function () {
//   console.log("Notification permission granted.");
//   return messaging.getToken();
// }).then(function(token) {
//   console.log( "token is : " + token );
//   registerDevice( token );
// })
// .catch(function (err) {
//   console.log("Unable to get permission to notify.", err);
// });

// messaging.onMessage(function(payload) {
//   console.log("Message received. ", payload);
//   if( $('#frontend_notifications_section').length) {
//     reloadNotifications();
//   }
//   else {
//   getNotificationsCount();
//   }
//   //kenng - foreground notifications
//   const {title, ...options} = payload.notification;
//   navigator.serviceWorker.ready.then(registration => {
//   registration.showNotification(title, options);
//   });
//   });