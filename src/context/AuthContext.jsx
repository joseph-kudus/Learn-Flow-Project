import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../../firebaseconfig"; 
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  doc,
  onSnapshot,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

// 1. Create the context
const AuthContext = createContext();

// 2. Export the hook - this is what Login.jsx imports
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Export the Provider component - wrap your App with this in main.jsx
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Creates new user in Firebase Auth + Firestore doc
  async function signup(email, password, username, role = "student") {
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: username });
      await sendEmailVerification(cred.user);

      await setDoc(doc(db, "users", cred.user.uid), {
        email: cred.user.email,
        username: username,
        firstName: "",
        lastName: "",
        nickname: username,
        photoURL: "",
        emailVerified: false,
        role: role,
        createdAt: serverTimestamp(),
      });
      return cred;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function login(email, password) {
    setError("");
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function logout() {
    setError("");
    return signOut(auth);
  }

  async function forgotPassword(email) {
    setError("");
    try {
      return await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Listen to auth state + sync Firestore user doc in real-time
  useEffect(() => {
    let unsubscribeDoc = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      unsubscribeDoc();

      if (user) {
        const userRef = doc(db, "users", user.uid);

        try {
          const docSnap = await getDoc(userRef);
          if (!docSnap.exists()) {
            await setDoc(userRef, {
              email: user.email,
              username: user.displayName || "",
              firstName: "",
              lastName: "",
              nickname: user.displayName || "",
              photoURL: user.photoURL || "",
              emailVerified: user.emailVerified,
              role: "student",
              createdAt: serverTimestamp(),
            });
          }

          unsubscribeDoc = onSnapshot(
            userRef,
            async (snap) => {
              if (snap.exists()) {
                const data = snap.data();
                if (data.emailVerified !== user.emailVerified) {
                  try {
                    await updateDoc(userRef, {
                      emailVerified: user.emailVerified,
                    });
                    data.emailVerified = user.emailVerified;
                  } catch (err) {
                    console.warn("Couldn't sync emailVerified:", err.message);
                  }
                }
                setUserData(data);
                setLoading(false);
              } else {
                setUserData(null);
                setLoading(false);
              }
            },
            (err) => {
              console.error("Firestore listen error:", err);
              setError(err.message);
              setUserData(null);
              setLoading(false);
            },
          );
        } catch (err) {
          console.error("Error setting up user doc:", err);
          setError(err.message);
          setLoading(false);
        }
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeDoc();
    };
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    error,
    signup,
    login,
    logout,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}


