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

export const allEnrollments = [
  {
    id: 1,
    title: "People Management",
    category: "MANAGEMENT",
    image: courseImages[1],
    description:
      "Learn how to lead teams, delegate tasks, and manage people effectively in tech.", // NEW
    allowedRoles: ["learner", "student"],
  },
  //... repeat for all 13
  {
    id: 2,
    title: "Advance Rush",
    category: "BLOCKCHAIN",
    image: courseImages[2],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 3,
    title: "Robotics & Machine Learning",
    category: "ARTIFICIAL INTELLIGENCE",
    image: courseImages[3],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 4,
    title: "Intro to Python",
    category: "Coding",
    image: courseImages[4],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 5,
    title: "Intro to Javascript",
    category: "Coding",
    image: courseImages[5],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 6,
    title: "Ethical Hacking",
    category: "Coding",
    image: courseImages[6],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 7,
    title: "Intro to C++",
    category: "Coding",
    image: courseImages[7],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 8,
    title: "Intro to Programming",
    category: "Language",
    image: courseImages[8],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 9,
    title: "Intro to C",
    category: "Coding",
    image: courseImages[9],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 10,
    title: "JavaScript for Frontend Developers",
    category: "Javascript",
    image: courseImages[10],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 11,
    title: "React JS Fundamentals",
    category: "React JS",
    image: courseImages[11],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 12,
    title: "Python for Web Development",
    category: "Python",
    image: courseImages[12],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 13,
    title: "Beginner's Guide to Software Engineering",
    category: "Software Engineering",
    image: courseImages[13],
    allowedRoles: ["learner", "student"],
  },
];

/* ===========================
   GET USER ENROLLMENTS
=========================== */

export const getUserEnrollments = async (firebaseUid) => {
  try {
    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", firebaseUid),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => Number(doc.data().courseId));
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return [];
  }
};

/* ===========================
   GET USER BY EMAIL
=========================== */

export const getUserByEmail = async (email) => {
  const q = query(collection(db, "users"), where("email", "==", email));

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
};

/* ===========================
   VALIDATE ENROLLMENT
=========================== */

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

/* ===========================
   ENROLL STUDENT
=========================== */

export const enrollStudent = async (firebaseUid, email, courseId) => {
  const validation = await validateEnrollment(email, courseId);

  if (!validation.success) {
    return validation;
  }

  const { user, course } = validation;

  // Check if already enrolled
  const enrollmentQuery = query(
    collection(db, "enrollments"),
    where("userId", "==", firebaseUid),
    where("courseId", "==", course.id),
  );

  const enrollmentSnapshot = await getDocs(enrollmentQuery);

  if (!enrollmentSnapshot.empty) {
    return {
      success: false,
      message: "You are already enrolled in this course.",
    };
  }

  // Save enrollment
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

    status: "active",

    enrolledAt: serverTimestamp(),
  });

  return {
    success: true,
    message: `Successfully enrolled in "${course.title}".`,
  };
};
