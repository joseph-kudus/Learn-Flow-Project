import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "../../config/firebaseconfig";

import { createNotification } from "../notification/notificationService";

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
      status: "draft",
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

/**
 * Get courses created by an instructor
 */
export const getInstructorCourses = async (userId) => {
  try {
    if (!userId) {
      return [];
    }

    const q = query(collection(db, "courses"), where("authorId", "==", userId));

    const snapshot = await getDocs(q);

    const courses = snapshot.docs.map((courseDoc) => ({
      id: courseDoc.id,
      ...courseDoc.data(),
    }));

    console.log("Instructor UID:", userId);
    console.log("Instructor courses:", courses);

    return courses;
  } catch (error) {
    console.error("Error getting instructor courses:", error);

    throw error;
  }
};

/**
 * Publish an instructor course
 *
 * Publishes the course and sends a course notification
 * to every student.
 */
export const publishCourse = async (courseId, instructorId) => {
  try {
    if (!courseId) {
      throw new Error("Course ID is required.");
    }

    if (!instructorId) {
      throw new Error("Instructor ID is required.");
    }

    const courseRef = doc(db, "courses", courseId);

    const courseSnapshot = await getDoc(courseRef);

    if (!courseSnapshot.exists()) {
      throw new Error("Course not found.");
    }

    const course = courseSnapshot.data();

    /* ==================================================
       CHECK COURSE OWNERSHIP
    ================================================== */

    if (course.authorId !== instructorId) {
      throw new Error("You are not authorized to publish this course.");
    }

    /* ==================================================
       PREVENT DUPLICATE PUBLISHING
    ================================================== */

    if (course.status === "published") {
      return {
        success: false,
        message: "Course is already published.",
      };
    }

    /* ==================================================
       PUBLISH COURSE
    ================================================== */

    await updateDoc(courseRef, {
      status: "published",
      updatedAt: serverTimestamp(),
    });

    /* ==================================================
       FIND STUDENTS
    ================================================== */

    let notificationError = null;

    try {
      const studentsQuery = query(
        collection(db, "users"),
        where("role", "==", "student"),
      );

      const studentsSnapshot = await getDocs(studentsQuery);

      /* ==================================================
         CREATE NOTIFICATION FOR EACH STUDENT
      ================================================== */

      const instructorName =
        course.author?.trim() || course.instructorName?.trim() || "Instructor";

      const courseTitle = course.title?.trim() || "New Course";

      const notificationMessage = `Published a new course: "${courseTitle}"`;

      await Promise.all(
        studentsSnapshot.docs.map(async (studentDoc) => {
          const student = studentDoc.data();

          const studentId = student.uid || studentDoc.id;

          if (!studentId) {
            return;
          }

          await createNotification({
            userId: studentId,
            title: instructorName,
            message: notificationMessage,
            type: "course",
          });
        }),
      );

      console.log(
        `Course notification sent to ${studentsSnapshot.size} student(s).`,
      );
    } catch (error) {
      notificationError = error;

      console.error(
        "Course published successfully, but notifications could not be created:",
        error,
      );
    }

    /* ==================================================
       RETURN RESULT
    ================================================== */

    return {
      success: true,
      message: `"${course.title}" has been published successfully.`,
      notificationSent: !notificationError,
      course: {
        id: courseId,
        ...course,
        status: "published",
      },
    };
  } catch (error) {
    console.error("Error publishing course:", error);

    throw error;
  }
};
