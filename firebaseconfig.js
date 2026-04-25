// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4I3wYX25b4m3gWJYN_uzNGP18EHdRSWA",
  authDomain: "learnflow-1f4fb.firebaseapp.com",
  projectId: "learnflow-1f4fb",
  storageBucket: "learnflow-1f4fb.firebasestorage.app",
  messagingSenderId: "798764517036",
  appId: "1:798764517036:web:1d5b2a82ad228910960109",
};

// 1. Initialize app FIRST
const app = initializeApp(firebaseConfig);

// 2. Create auth + db instances ONCE
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 3. Set persistence AFTER auth exists
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Auth persistence error:", err);
});

// 4. Export once at bottom
export { auth, db, storage };