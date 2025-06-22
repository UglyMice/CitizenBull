// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmDUPGTqLLkHNvOtK4anULYv_LRWZ9dhw",
  authDomain: "citizenbull-fa4ca.firebaseapp.com",
  projectId: "citizenbull-fa4ca",
  storageBucket: "citizenbull-fa4ca.firebasestorage.com",
  messagingSenderId: "445613857535",
  appId: "1:445613857535:web:75f7403759a7cc7357caca",
  measurementId: "G-4F4QBL4J6Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { auth, db };