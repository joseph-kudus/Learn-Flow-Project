import React, { useEffect, useState, useRef } from "react"; // <-- removed useCallback
import UseuserRole from "../UserData/UseuserRole";
import { Navigate } from "react-router-dom";
import DashboardContent from "../Layout/DashboardContent";
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

  const unsubRef = useRef(null); // <-- 1. Store unsub so we don't remake it

  // 2. No useCallback. Stable function that checks if already subscribed
  const subscribeEnrollments = () => {
    if (!user?.uid) {
      setEnrollmentsLoading(false);
      return;
    }
    if (unsubRef.current) return; // <-- already listening, don't resub

    setEnrollmentsLoading(true);
    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", user.uid),
    );

    unsubRef.current = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        console.log("DashboardMain got:", data.length); // Should log max 2x: cache + server
        setEnrollmentData(data);
        setEnrollmentsLoading(false);
      },
      (err) => {
        console.error("onSnapshot error:", err);
        setEnrollmentData([]);
        setEnrollmentsLoading(false);
      },
    );
  };

  useEffect(() => {
    subscribeEnrollments();
    return () => {
      unsubRef.current?.(); // <-- 3. Cleanup once on unmount
      unsubRef.current = null;
    };
  }, [user?.uid]); // <-- only re-run if uid changes, not on every render

  if (authLoading || enrollmentsLoading)
    return <div style={{ padding: 24 }}>Loading dashboard...</div>;
  if (!user) return <Navigate to="/login" />;

  const role = (user.role || "learner").toLowerCase();

  const completedCourses = enrollmentData
    .filter((e) => e.status === "completed")
    .map((e) => {
      const course = allEnrollments.find(
        (c) => String(c.id) === String(e.courseId),
      );
      return {
        id: e.id || e.courseId,
        code: course?.code || course?.id,
        title: course?.title || "Course",
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
        // 4. Don't pass onRefresh, or pass a stable one:
        onRefresh={() => {}} // <-- no-op, because we already listen live
      />
    );
  }

  return <WelcomeLearner user={user} />;
};
export default DashboardMain;
