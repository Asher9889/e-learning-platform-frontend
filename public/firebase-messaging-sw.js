importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
   apiKey: "AIzaSyBmck8I8EKpxJhke8sK6p-cUi3H3iry1zk",
  authDomain: "e-learning-8ffa2.firebaseapp.com",
  projectId: "e-learning-8ffa2",
  storageBucket: "e-learning-8ffa2.firebasestorage.app",
  messagingSenderId: "935087162923",
  appId: "1:935087162923:web:e785a613a73bb3b8654c6e",
  measurementId: "G-WMMN8GRXC9"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received: ", payload);

  self.registration.showNotification(
    payload.notification?.title || "Notification",
    {
      body: payload.notification?.body || "",
      icon: "/icon.png",
    }
  );
});