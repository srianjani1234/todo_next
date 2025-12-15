




// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyCJWu0BbG3wYh1OA5v26YiblD68W34sBWY",
  authDomain: "todoapp-715a2.firebaseapp.com",
  projectId: "todoapp-715a2",
  storageBucket: "todoapp-715a2.firebasestorage.app",
  messagingSenderId: "629103261484",
  appId: "1:629103261484:web:9b8a70526549e4ad8e1e89",
  measurementId: "G-FCX4C5ZE55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Named exports (important!)
export const auth = getAuth(app);
export const db = getFirestore(app);
