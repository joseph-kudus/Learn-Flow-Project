import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, onSnapshot, getDoc, setDoc, updateDoc } from "firebase/firestore";
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

  async function signup(email, password, username = "") {
    setError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // 1. Update Firebase Auth profile
      await updateProfile(cred.user, {
        displayName: username,
      });

      // 2. Send verification email
      await sendEmailVerification(cred.user);

      // 3. Create Firestore user doc
      await setDoc(doc(db, "users", cred.user.uid), {
        email: cred.user.email,
        username: username,
        firstName: "",
        lastName: "",
        nickname: username,
        photoURL: "",
        emailVerified: false,
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
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // Remove or comment this block for testing
      // if (!cred.user.emailVerified) {
      //   await signOut(auth);
      //   throw new Error("Please verify your email before logging in. Check your inbox.");
      // }

      return cred;
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
    } catch (err) {
      throw err;
    }
  };

  const resendVerification = async () => {
    if (!currentUser) throw new Error("No user logged in");
    try {
      await sendEmailVerification(currentUser);
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

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      unsubscribeDoc();

      if (user) {
        const userRef = doc(db, "users", user.uid);

        try {
          // Create doc if missing - fixes old users
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
              createdAt: new Date(),
            });
          }

          unsubscribeDoc = onSnapshot(
            userRef,
            async (snap) => {
              if (snap.exists()) {
                const data = snap.data();
                // Sync emailVerified
                if (data.emailVerified !== user.emailVerified) {
                  await updateDoc(userRef, {
                    emailVerified: user.emailVerified,
                  });
                  data.emailVerified = user.emailVerified;
                }
                setUserData(data);
              }
              setLoading(false);
            },
            (err) => {
              console.error("Firestore listen error:", err);
              setError(err.message);
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
    resendVerification,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
