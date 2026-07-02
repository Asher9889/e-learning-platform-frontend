import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBmck8I8EKpxJhke8sK6p-cUi3H3iry1zk",
  authDomain: "e-learning-8ffa2.firebaseapp.com",
  projectId: "e-learning-8ffa2",
  storageBucket: "e-learning-8ffa2.firebasestorage.app",
  messagingSenderId: "935087162923",
  appId: "1:935087162923:web:e785a613a73bb3b8654c6e",
  measurementId: "G-WMMN8GRXC9"
};

const app = initializeApp(firebaseConfig);

// FCM instance
export const messaging = getMessaging(app);