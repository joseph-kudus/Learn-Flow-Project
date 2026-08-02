import { db } from "../config/firebaseconfig";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Get a user's profile
 */
export const getUser = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      return null;
    }
    return snap.data();
  } catch (err) {
    console.error("error getting user:", uid);
    throw err;
  }
};

/**
 * Create or update a user
 */
export const saveUser = async (uid, data) => {
  try {
    await setDoc(
      doc(db, "users", uid),
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Failed to save user:", error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (uid, data) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
};

/**
 * Update avatar only
 */
export const updateUserAvatar = async (uid, photoURL) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      photoURL,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to update user avatar:", error);
    throw error;
  }
};

/**
 * Update user role
 */
export const updateUserRole = async (uid, role) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      role,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw error;
  }
};

/**
 * Delete user document
 */
export const deleteUser = async (uid) => {
  try {
    await deleteDoc(doc(db, "users", uid));
  } catch (err) {
    console.error("Failed to delete user:", error);
    throw err;
  }
};
