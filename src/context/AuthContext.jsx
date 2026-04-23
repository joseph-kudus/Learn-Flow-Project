import React, { createContext, useContext, useState, useEffect } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, onSnapshot, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseconfig";

const AuthContext = createContext();
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function signup(email, password) {
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", cred.user.uid), {
        email: cred.user.email,
        firstName: "",
        lastName: "",
        nickname: "",
        photoURL: "",
        createdAt: new Date(),
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
    try {
      return await signOut(auth);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  const forgotPassword = async (email) => {
    if (!email) throw new Error("Please enter email to reset password");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Check your email for reset link");
    } catch (err) {
      throw err;
    }
  };

  const refreshUserData = async () => {
    if (!currentUser) return;
    const docSnap = await getDoc(doc(db, "users", currentUser.uid));
    if (docSnap.exists()) setUserData(docSnap.data());
  };

  useEffect(() => {
    let unsubscribeDoc = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      unsubscribeDoc();

      if (user) {
        const userRef = doc(db, "users", user.uid);
        unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          setUserData(docSnap.exists() ? docSnap.data() : null);
          setLoading(false);
        });
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
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
