import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebaseconfig";



/**
 * Get all courses
 */
export const getCourses = async () => {
  try {
    const snapshot = await getDocs(collection(db, "courses"));

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting courses:", error);
    throw error;
  }
};

/**
 * Get one course
 */
export const getCourse = async (courseId) => {
  try {
    const snapshot = await getDoc(doc(db, "courses", courseId));

    if (!snapshot.exists()) return null;

    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (error) {
    console.error("Error getting course:", error);
    throw error;
  }
};

/**
 * Create course
 */
export const createCourse = async (courseData) => {
  try {
    const courseRef = await addDoc(collection(db, "courses"), {
      ...courseData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return courseRef.id;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

/**
 * Update course
 */
export const updateCourse = async (courseId, data) => {
  try {
    await updateDoc(doc(db, "courses", courseId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

/**
 * Delete course
 */
export const deleteCourse = async (courseId) => {
  try {
    await deleteDoc(doc(db, "courses", courseId));
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};
