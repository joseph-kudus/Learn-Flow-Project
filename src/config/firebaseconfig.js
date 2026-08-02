// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import env from "./env";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
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
