import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import UseuserRole from "../../hooks/UseuserRole";
import WelcomeStudent from "../dashboard/WelcomeStudent";
import WelcomeInstructor from "../dashboard/WelcomeInstructor";
import WelcomeLearner from "../dashboard/WelcomeLearner";

import { allEnrollments } from "../../services/allEnrollments";
import { db} from "../../../firebaseconfig";

const DashboardMain = () => {
  const { user, loading: authLoading } = UseuserRole();

  const [enrollmentData, setEnrollmentData] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);

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
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

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

  // Only wait for authentication
  if (authLoading) {
    return <div style={{ padding: 12 }}>Loading dashboard...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
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

  switch (role) {
    case "instructor":
      return <WelcomeInstructor user={user} />;

    case "student":
      return (
        <WelcomeStudent
          user={user}
          allEnrollments={allEnrollments}
          enrollmentData={enrollmentData}
          completedCourses={completedCourses}
          enrollmentsLoading={enrollmentsLoading}
        />
      );

    default:
      return (
        <WelcomeLearner
          user={user}
          allEnrollments={allEnrollments}
          enrollmentData={enrollmentData}
          enrollmentsLoading={enrollmentsLoading}
        />
      );
  }
};

export default DashboardMain;
