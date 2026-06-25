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
    img: courseImages[1],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 2,
    title: "Advance Rush",
    category: "BLOCKCHAIN",
    img: courseImages[2],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 3,
    title: "Robotics & Machine Learning",
    category: "ARTIFICIAL INTELLIGENCE",
    img: courseImages[3],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 4,
    title: "Intro to Python",
    category: "Coding",
    img: courseImages[4],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 5,
    title: "Intro to Javascript",
    category: "Coding",
    img: courseImages[5],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 6,
    title: "Ethical Hacking",
    category: "Coding",
    img: courseImages[6],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 7,
    title: "Intro to C++",
    category: "Coding",
    img: courseImages[7],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 8,
    title: "Intro to Programming",
    category: "Language",
    img: courseImages[8],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 9,
    title: "Intro to C",
    category: "Coding",
    img: courseImages[9],
    allowedRoles: ["learner", "student"],
  },
  {
    id: 10,
    category: "Javascript",
    img: courseImages[10],
    title: "JavaScript for Frontend Developers",
    allowedRoles: ["learner", "student"],
  },
  {
    id: 11,
    category: "React JS",
    img: courseImages[11],
    title: "React JS Fundamentals",
    allowedRoles: ["learner", "student"],
  },
  {
    id: 12,
    category: "Python",
    img: courseImages[12],
    title: "Python for Web Development",
    allowedRoles: ["learner", "student"],
  },
  {
    id: 13,
    title: "Beginner’s Guide to Software Engineering",
    img: courseImages[13],
    category: "Software Engineering",
    allowedRoles: ["learner", "student"],
  },
];

//...rest of your functions unchanged
export const getUserEnrollments = async (firebaseUid) => {
  const q = query(
    collection(db, "enrollments"),
    where("userId", "==", firebaseUid),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => Number(doc.data().courseId));
};

export const getUserByEmail = async (email) => {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id,...snapshot.docs[0].data() };
};

export const validateEnrollment = async (email, courseId) => {
  const user = await getUserByEmail(email);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const course = allEnrollments.find((c) => Number(c.id) === Number(courseId));
  if (!course) {
    return { success: false, message: "Course not found" };
  }

  const userRole = user.role || "student"; // Fixed: default role
  if (!course.allowedRoles.includes(userRole)) {
    return {
      success: false,
      message: `${userRole} cannot enroll in ${course.title}`,
    };
  }
  return { success: true, user, course };
};

export const enrollStudent = async (firebaseUid, email, courseId) => {
  const validation = await validateEnrollment(email, courseId);
  if (!validation.success) return validation;

  const { user, course } = validation;

  const enrollmentQuery = query(
    collection(db, "enrollments"),
    where("userId", "==", firebaseUid),
    where("courseId", "==", course.id),
  );

  const enrollmentSnapshot = await getDocs(enrollmentQuery);
  if (!enrollmentSnapshot.empty) {
    return { success: false, message: "You are already enrolled in this course" };
  }

  await addDoc(collection(db, "enrollments"), {
    userId: firebaseUid,
    userName: user.displayname || user.nickname || user.email?.split("@")[0], // Fixed
    email: user.email,
    courseId: course.id,
    courseTitle: course.title,
    category: course.category,
    status: "active",
    enrolledAt: serverTimestamp(),
  });

  return {
    success: true,
    message: `Successfully enrolled in ${course.title}`,
  };
};