// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4I3wYX25b4m3gWJYN_uzNGP18EHdRSWA",
  authDomain: "learnflow-1f4fb.firebaseapp.com",
  projectId: "learnflow-1f4fb",
  storageBucket: "learnflow-1f4fb.firebasestorage.app",
  messagingSenderId: "798764517036",
  appId: "1:798764517036:web:1d5b2a82ad228910960109"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;