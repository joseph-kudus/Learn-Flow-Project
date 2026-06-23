import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebaseconfig";
import { useAuth } from "../../context/AuthContext";

export const allEnrollments = [
  {
    id: 1,
    title: "People Management",
    category: "MANAGEMENT",
    img: "",
    allowedRoles: ["learner", "student"],
  },
  {
    id: 2,
    title: "Advance Rush",
    category: "BLOCKCHAIN",
    img: "",
    allowedRoles: ["learner", "student"],
  },
  {
    id: 3,
    title: "Robotics & Machine Learning",
    category: "ARTIFICIAL INTELLIGENCE",
    img: "",
    allowedRoles: ["learner", "student"],
  },
  {
    id: 4,
    title: "Intro to Python",
    category: "Coding",
    img: "",
    allowedRoles: ["learner", "student"],
  },
  {
    id: 5,
    title: "Intro to Javascript",
    category: "Coding",
    img: "",
    allowedRoles: ["learner", "student"],
  },
  {
    id: 6,
    title: "Ethical Hacking",
    category: "Coding",
    img: "",
    allowedRoles: ["learner", "student"],
  },
  {
    id: 7,
    title: "Intro to C++",
    category: "Coding",
    img: "",
    allowedRoles: ["learner", "student"],
  },
  {
    id: 8,
    title: "Intro to Programming",
    category: "Language",
    img: "",
    allowedRoles: ["learner", "student"],
  },
  {
    id: 9,
    title: "Intro to C",
    category: "Coding",
    img: "",
    allowedRoles: ["learner", "student"],
  },
  {
    id: 10,
    category: "Javascript",
    img: "",
    title: "Beginner’s Guide to becoming a professional frontend developer",
    allowedRoles: ["learner", "student"],
  },
  {
    id: 11,
    category: "React JS",
    img: "",
    title: "Beginner’s Guide to becoming a professional frontend developer",
    allowedRoles: ["learner", "student"],
  },
  {
    id: 12,
    category: "Python",
    img: "",
    title: "Beginner’s Guide to bec a professional frontend developer",
    allowedRoles: ["learner", "student"],
  },
  {
    id: 13,
    title: "Beginner’s Guide to becoming a professional Software Engineer.",
    img: "",
    category: "Software Engineering",
    allowedRoles: ["learner", "student"],
  },
];

//Fetch users from firebase
export const getUserByEmail = async (email) => {
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }
  return {
    id: snapshot.docs[0].id,
    ...snapshot.docs[0].data(),
  };
};

// Validate courses and user roles

export const validateEnrollment = async (email, courseId) => {
  //const user = await getUserByEmail(email);
  const { userData, currentUser } = useAuth();

  if (!currentUser) {
    return {
      success: false,
      message: "user not found",
    };
  }
  const course = allEnrollments.find((c) => Number(c.id) === Number(courseId));
  if (!course) {
    return {
      success: false,
      message: "course not found",
    };
  }

  if (!course.allowedRoles.includes(user.role)) {
    return {
      success: false,
      message: `${user.role} cannot enroll in ${course.title}`,
    };
  }
  return {
    success: true,
    user,
    course,
  };
};
//validate user and course
export const enrollStudent = async (email, courseId) => {
  const validation = await validateEnrollment(email, courseId);
  if (!validation.success) {
    return validation;
  }
  const { user, course } = validation;
  //check if alredy enrolled
  const enrollmentQuery = query(
    collection(db, "enrollments"),
    where("userId", "==", user.id),
    where("courseId", "==", course.id),
  );

  const enrollmentSnapshot = await getDocs(enrollmentQuery);
  if (!enrollmentSnapshot.empty) {
    return {
      success: false,
      message: "you are already enrolled in course",
    };
  }
  //save enrollment
  await addDoc(collection(db, "enrollments"), {
    userId: currentUser.uid,
    userName:
      user.username || `${user.firstname || ""} ${user.lastname || ""}`.trim(),
    email: user.email,

    courseId: course.id,
    courseTitle: course.title,
    category: course.category,
    status: "active",
    enrolledAt: serverTimestamp(),
  });
  return {
    success: true,
    message: `successfully enrolled in ${course.title}`,
  };
};
