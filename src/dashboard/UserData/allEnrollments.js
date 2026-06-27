import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebaseconfig";
import { courseImages } from "../../assets/courses/courseImages";

/* ======================================================
   COURSE DATA
====================================================== */

export const allEnrollments = [
  {
    id: 1,
    title: "People Management",
    category: "MANAGEMENT",
    image: courseImages[1],
    description:
      "Beginner's Guide to becoming a professional frontend developer.",
    duration: "8 Weeks",
    lessons: 24,
    rating: 4.8,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 2,
    title: "Advance Rush",
    category: "BLOCKCHAIN",
    image: courseImages[2],
    description:
      "Learn blockchain development from beginner to advanced level.",
    duration: "10 Weeks",
    lessons: 30,
    rating: 4.7,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 3,
    title: "Robotics & Machine Learning",
    category: "ARTIFICIAL INTELLIGENCE",
    image: courseImages[3],
    description:
      "Build intelligent robotics and machine learning applications.",
    duration: "12 Weeks",
    lessons: 40,
    rating: 4.9,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 4,
    title: "Intro to Python",
    category: "Coding",
    image: courseImages[4],
    description: "Learn Python programming from absolute beginner level.",
    duration: "6 Weeks",
    lessons: 20,
    rating: 4.8,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 5,
    title: "Intro to Javascript",
    category: "Coding",
    image: courseImages[5],
    description: "Master JavaScript fundamentals for web development.",
    duration: "7 Weeks",
    lessons: 22,
    rating: 4.7,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 6,
    title: "Ethical Hacking",
    category: "Coding",
    image: courseImages[6],
    description: "Introduction to penetration testing and cybersecurity.",
    duration: "9 Weeks",
    lessons: 28,
    rating: 4.9,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 7,
    title: "Intro to C++",
    category: "Coding",
    image: courseImages[7],
    description: "Learn object-oriented programming using C++.",
    duration: "8 Weeks",
    lessons: 24,
    rating: 4.6,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 8,
    title: "Intro to Programming",
    category: "Language",
    image: courseImages[8],
    description: "Understand programming fundamentals and logical thinking.",
    duration: "5 Weeks",
    lessons: 18,
    rating: 4.5,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 9,
    title: "Intro to C",
    category: "Coding",
    image: courseImages[9],
    description: "Learn the C programming language from scratch.",
    duration: "6 Weeks",
    lessons: 21,
    rating: 4.6,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 10,
    title: "JavaScript for Frontend Developers",
    category: "Javascript",
    image: courseImages[10],
    description: "Become a frontend JavaScript developer.",
    duration: "8 Weeks",
    lessons: 26,
    rating: 4.9,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 11,
    title: "React JS Fundamentals",
    category: "React JS",
    image: courseImages[11],
    description: "Build modern React applications.",
    duration: "8 Weeks",
    lessons: 25,
    rating: 4.9,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 12,
    title: "Python for Web Development",
    category: "Python",
    image: courseImages[12],
    description: "Develop backend web applications using Python.",
    duration: "10 Weeks",
    lessons: 34,
    rating: 4.8,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 13,
    title: "Beginner's Guide to Software Engineering",
    category: "Software Engineering",
    image: courseImages[13],
    description: "Everything you need to become a software engineer.",
    duration: "14 Weeks",
    lessons: 45,
    rating: 5.0,
    allowedRoles: ["learner", "student"],
  },
];

/* ======================================================
   USER ENROLLMENTS (IDs ONLY)
====================================================== */

export const getUserEnrollments = async (firebaseUid) => {
  try {
    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", firebaseUid),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => Number(doc.data().courseId));
  } catch (error) {
    console.error(error);
    return [];
  }
};

/* ======================================================
   FULL ENROLLMENT DETAILS
====================================================== */

export const getEnrollmentDetails = async (firebaseUid) => {
  try {
    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", firebaseUid),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

/* ======================================================
   GET USER
====================================================== */

export const getUserByEmail = async (email) => {
  const q = query(collection(db, "users"), where("email", "==", email));

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
};

/* ======================================================
   VALIDATE ENROLLMENT
====================================================== */

export const validateEnrollment = async (email, courseId) => {
  const user = await getUserByEmail(email);

  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  const course = allEnrollments.find((c) => Number(c.id) === Number(courseId));

  if (!course) {
    return {
      success: false,
      message: "Course not found",
    };
  }

  const role = user.role || "student";

  if (!course.allowedRoles.includes(role)) {
    return {
      success: false,
      message: `${role} cannot enroll in ${course.title}`,
    };
  }

  return {
    success: true,
    user,
    course,
  };
};

/* ======================================================
   ENROLL STUDENT
====================================================== */

export const enrollStudent = async (firebaseUid, email, courseId) => {
  try {
    const validation = await validateEnrollment(email, courseId);

    if (!validation.success) {
      return validation;
    }

    const { user, course } = validation;

    const existing = query(
      collection(db, "enrollments"),
      where("userId", "==", firebaseUid),
      where("courseId", "==", course.id),
    );

    const snapshot = await getDocs(existing);

    if (!snapshot.empty) {
      return {
        success: false,
        message: "You are already enrolled in this course.",
      };
    }

    await addDoc(collection(db, "enrollments"), {
      userId: firebaseUid,

      userName:
        user.username ||
        user.nickname ||
        user.displayName ||
        user.email.split("@")[0],

      email: user.email,

      courseId: course.id,
      courseTitle: course.title,
      category: course.category,

      progress: 0,
      completedLessons: 0,
      totalLessons: course.lessons,

      status: "active",

      certificateIssued: false,

      lastAccessed: serverTimestamp(),

      enrolledAt: serverTimestamp(),
    });

    return {
      success: true,
      course,
      message: `Successfully enrolled in "${course.title}".`,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Enrollment failed. Please try again.",
    };
  }
};
