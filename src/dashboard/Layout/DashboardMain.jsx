import React, { useEffect, useState } from "react";
import UseuserRole from "../UserData/UseuserRole";
import { Navigate } from "react-router-dom";
import WelcomeStudent from "../Layout/WelcomeStudent";
import WelcomeInstructor from "../Layout/WelcomeInstructor";
import WelcomeLearner from "./WelcomeLearner";

import { allEnrollments } from "../../dashboard/UserData/allEnrollments";

import { db } from "../../../firebaseconfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const DashboardMain = () => {
  const { user, loading: authLoading } = UseuserRole();

  const [enrollmentData, setEnrollmentData] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setEnrollmentData([]);
      setEnrollmentsLoading(false);
      return;
    }

    setEnrollmentsLoading(true);

    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Dashboard enrollments:", data);

        setEnrollmentData(data);
        setEnrollmentsLoading(false);
      },

      (error) => {
        console.error("Enrollment listener error:", error);

        setEnrollmentData([]);
        setEnrollmentsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user?.uid]);

  if (authLoading || enrollmentsLoading) {
    return <div style={{ padding: 24 }}>Loading dashboard...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const role = (user.role || user.userRole || "learner").toLowerCase();

  const completedCourses = enrollmentData

    .filter((e) => e.status === "completed")

    .map((e) => {
      const course = allEnrollments.find(
        (c) => String(c.id) === String(e.courseId),
      );

      return {
        id: e.id || e.courseId,

        code: course?.code || course?.id,

        title: course?.title || e.courseTitle || "Course",

        grade: e.grade || "N/A",

        date: e.completedAt || e.date,

        status: e.passed === false ? "fail" : "pass",
      };
    });

  if (role === "instructor") {
    return <WelcomeInstructor user={user} />;
  }

  if (role === "student") {
    return (
      <WelcomeStudent
        user={user}
        allEnrollments={allEnrollments}
        enrollmentData={enrollmentData}
        completedCourses={completedCourses}
      />
    );
  }

  return <WelcomeLearner user={user} />;
};

export default DashboardMain;
