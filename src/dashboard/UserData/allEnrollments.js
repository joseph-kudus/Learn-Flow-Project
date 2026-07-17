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
import { id } from "date-fns/locale";

/* ======================================================
   COURSE DATA
====================================================== */

export const allEnrollments = [
  {
    id: 1,
    title: "People Management",
    category: "Management",
    image: courseImages[1],
    video: "/videos/people-management.mp4",
    description:
      "Beginner's Guide to becoming a professional frontend developer.",
    durationWeeks: 8,
    lessons: [
      {
        title: "Introduction to People Management",
        video: "/videos/people-management-intro.mp4",
        notes: "...",
        assignment: "...",
      },
      {
        title: "Leadership Skills",
        video: "/videos/leadership-skills.mp4",
        notes: "...",
        assignment: "...",
      },
      {
        title: "Team Communication",
        video: "/videos/team-communication.mp4",
        notes: "...",
        assignment: "...",
      },
    ],
    rating: 4.8,
    allowedRoles: ["learner", "student"],
  },

  {
    id: 2,
    title: "Advance Rush",
    category: "BLOCKCHAIN",
    image: courseImages[2],
    video: "/videos/advance-rush.mp4",
    description:
      "Learn blockchain development from beginner to advanced level.",
    durationWeeks: 7,
    lessons: [
      {
        title: "Blockchain Introduction",
        video: "/videos/blockchain-introduction.mp4",
        notes: "...",
        assignment: "...",
      },
      {
        title: "Blockchain Architecture",
        video: "/videos/blockchain-architecture.mp4",
        notes: "...",
        assignment: "...",
      },
      {
        title: "Smart Contracts",
        video: "/videos/smart-contracts.mp4",
        notes: "...",
        assignment: "...",
      },
    ],
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
    durationWeeks: 12,
    lessons: [
      {
        title: "Introduction to Robotics",
        video: "/videos/robotics-introduction.mp4",
        notes: "...",
        assignment: "...",
      },
      {
        title: "Machine Learning Basics",
        video: "/videos/machine-learning-basics.mp4",
        notes: "...",
        assignment: "...",
      },
      {
        title: "Building Intelligent Systems",
        video: "/videos/intelligent-systems.mp4",
        notes: "...",
        assignment: "...",
      },
    ],
    rating: 4.9,
    allowedRoles: ["learner", "student"],
  },

  {
    id: 4,
    title: "Intro to Python",
    category: "Coding",
    image: courseImages[4],
    description: "Learn Python programming from absolute beginner level.",
    durationWeeks: 6,
    lessons: [
      {
        title: "Python Introduction",
        video: "/videos/python-introduction.mp4",
        notes: "...",
        assignment: "...",
      },
      {
        title: "Python Variables",
        video: "/videos/python-variables.mp4",
        notes: "...",
        assignment: "...",
      },
      {
        title: "Python Functions",
        video: "/videos/python-functions.mp4",
        notes: "...",
        assignment: "...",
      },
    ],
    rating: 4.8,
    allowedRoles: ["learner", "student"],
  },

  {
    id: 5,
    title: "Intro to Javascript",
    category: "Coding",
    image: courseImages[5],
    description: "Master JavaScript fundamentals for web development.",
    durationWeeks: 7,
    lessons: [
      {
        title: "JavaScript Introduction",
        video: "/videos/javascript-introduction.mp4",
        notes: "...",
        assignment: "...",
      },
      {
        title: "JavaScript Variables",
        video: "/videos/javascript-variables.mp4",
        notes: "...",
        assignment: "...",
      },
      {
        title: "DOM Manipulation",
        video: "/videos/javascript-dom.mp4",
        notes: "...",
        assignment: "...",
      },
    ],
    rating: 4.7,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 6,
    title: "Ethical Hacking",
    category: "Coding",
    image: courseImages[6],
    description: "Introduction to penetration testing and cybersecurity.",
    durationWeeks: 9,
    totalLessons: 28,
    lessons: [
      {
        title: "DEFINING ETHICAL HACKING",
        video: "",
        notes:
          "Ethical hackers are usually security professionals or network penetration testers who use their hacking skills and toolsets for defensive and protective purposes. ● Test their network and systems        security for vulnerabilities using the same tools that a hacker might use to compromise the network. ● Any computer professional can learn the skills of ethical hacking",
        assignment: "..",
      },
      {
        title: "UNDERSTANDING THE PURPOSE OF ETHICAL HACKING",
        video: "",
        notes: "..",
        assignment: "..",
      },
      {
        title: "AN ETHICAL HACKER’S SKILL SET",
        video: " ",
        notes: " ",
        assignment: " ",
      },
      {
        title: "ETHICAL HACKING TERMINOLOGY",
        video: " ",
        notes: " ",
        assignment: " ",
      },
      {
        title: "THE PHASES OF ETHICAL HACKING",
        video: " ",
        notes: " ",
        assignment: "",
      },
      {
        title: "IDENTIFYING TYPES OF HACKING TECHNOLOGIES",
        video: "",
        notes: "",
        assignment: "",
      },
    ],
    rating: 4.9,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 7,
    title: "Intro to C++",
    category: "Programming",
    image: courseImages[7],
    description: "Learn object-oriented programming using C++.",
    durationWeeks: 8,
    totalLessons: 24,
    lessons: [
      {
        title: "The Introduction",
        video: "...",
        notes: "...",
        assignment: "...",
      },
      {
        title: "C++ Foundation",
        video: "...",
        notes: "...",
        assignment: "...",
      },
      {
        title: "C++ 101",
        video: "...",
        notes: "...",
        assignment: "...",
      },
      {
        title: "C++ 102",
        video: "...",
        notes: "...",
        assignment: "...",
      },
    ],
    rating: 4.6,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 8,
    title: "Intro to Programming",
    category: "Language",
    image: courseImages[8],
    description: "Understand programming fundamentals and logical thinking.",
    durationWeeks: 5,
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
    durationWeeks: 6,
    totalLessons: 21,
    rating: 4.6,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 10,
    title: "JavaScript for Frontend Developers",
    category: "Javascript",
    image: courseImages[10],
    description: "Become a frontend JavaScript developer.",
    durationWeeks: 8,
    totalLessons: 26,
    rating: 4.9,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 11,
    title: "React JS Fundamentals",
    category: "React JS",
    image: courseImages[11],
    description: "Build modern React applications.",
    durationWeeks: 8,
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
    durationWeeks: 10,
    lessons: 34,
    rating: 4.8,
    allowedRoles: ["learner", "student"],
  },
  {
    id: 13,
    title: "Beginner's Guide to Software Engineering",
    category: "Software Engineering",
    image: courseImages[13],
    description:
      "Software engineering is the systematic process of designing, building, testing, and maintaining computer programs. Core pillars include learning programming languages like Python or JavaScript, mastering data structures, and practicing version control.",
    durationWeeks: 14,
    totalLessons: 45,
    lessons: [
      {
        title: "Understanding user needs",
        video: "",
        notes: "",
        assignment: " ",
      },
      {
        title: "Designing systems that solve real problems",
        video: "",
        notes: "",
        assignment: "",
      },
    ],
    rating: 5.0,
    allowedRoles: ["learner", "student"],
  },
];

/* ======================================================
   USER ENROLLMENTS (IDs ONLY)
====================================================== */

export const getUserEnrollments = async (firebaseUid) => {
  if (!firebaseUid) return [];
  try {
    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", firebaseUid),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => Number(doc.data().courseId)); // 1. Only return IDs [1, 5, 11]
  } catch (error) {
    console.error("getUserEnrollments error:", error);
    return [];
  }
};

/* ======================================================
   FULL ENROLLMENT DETAILS
====================================================== */

export const getEnrollmentDetails = async (firebaseUid) => {
  if (!firebaseUid) return [];
  try {
    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", firebaseUid),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id, // Firestore doc id, needed for updateDoc later
      ...doc.data(),
      courseId: Number(doc.data().courseId), // 2. Ensure number for Map lookups
    }));
  } catch (error) {
    console.error("getEnrollmentDetails error:", error);
    return [];
  }
};

/* ======================================================
   MARK LESSON COMPLETE - NEW HELPER FOR CoursePlayer
====================================================== */

export const markLessonComplete = async (enrollmentDocId, totalLessons) => {
  try {
    const ref = doc(db, "enrollments", enrollmentDocId);

    // 3. Atomic update: +1 lesson, recalc progress, update lastAccessed
    await updateDoc(ref, {
      completedLessons: increment(1),
      progress: increment(Math.round(100 / totalLessons)), // approx. clamp in UI
      lastAccessed: serverTimestamp(),
    });

    // Clamp to 100% if we overshoot
    const snap = await getDocs(
      query(
        collection(db, "enrollments"),
        where("__name__", "==", enrollmentDocId),
      ),
    );
    const data = snap.docs[0]?.data();
    if (data && data.progress > 100) {
      await updateDoc(ref, { progress: 100, status: "completed" });
    }

    return { success: true };
  } catch (error) {
    console.error("markLessonComplete error:", error);
    return { success: false, message: "Failed to update progress" };
  }
};

/* ======================================================
   GET USER
====================================================== */

export const getUserByEmail = async (email) => {
  if (!email) return null;
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

/* ======================================================
   VALIDATE ENROLLMENT
====================================================== */

export const validateEnrollment = async (email, courseId) => {
  const user = await getUserByEmail(email);
  if (!user) return { success: false, message: "User not found" };

  const course = allEnrollments.find((c) => Number(c.id) === Number(courseId));
  if (!course) return { success: false, message: "Course not found" };

  const role = user.role || "student";
  if (!course.allowedRoles.includes(role)) {
    return {
      success: false,
      message: `${role} cannot enroll in ${course.title}`,
    };
  }
  return { success: true, user, course };
};

/* ======================================================
   ENROLL STUDENT
====================================================== */

export const enrollStudent = async (firebaseUid, email, courseId) => {
  try {
    const validation = await validateEnrollment(email, courseId);
    if (!validation.success) return validation;

    const { user, course } = validation;

    const existingQ = query(
      collection(db, "enrollments"),
      where("userId", "==", firebaseUid),
      where("courseId", "==", Number(course.id)),
    );

    const snapshot = await getDocs(existingQ);
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
      courseId: Number(course.id),
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
    console.error("enrollStudent error:", error);
    return { success: false, message: "Enrollment failed. Please try again." };
  }
};
