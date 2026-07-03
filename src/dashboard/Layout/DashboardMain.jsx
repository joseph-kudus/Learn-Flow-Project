import React, { useCallback, useEffect, useState } from "react";
import UseuserRole from "../UserData/UseuserRole";
import { Navigate } from "react-router-dom";
import DashboardContent from "../Layout/DashboardContent"; // View Learner
import WelcomeStudent from "../Layout/WelcomeStudent"; // View Student
import WelcomeInstructor from "../Layout/WelcomeInstructor"; // View Instructors
import WelcomeLearner from "./WelcomeLearner";
import { getEnrollmentDetails, allEnrollments } from "../../dashboard/UserData/allEnrollments";

const DashboardMain = () => {
  const { user, loading } = UseuserRole();
  const [enrollmentData, setEnrollmentData] = useState([]); 

  const loadEnrollments = useCallback(async () => {
    if (!user?.uid) return;
    const data = await getEnrollmentDetails(user.uid);
    console.log("DashboardMain got:", data); 
    setEnrollmentData(data);
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) loadEnrollments(); // <-- fetch on login/role change
  }, [user?.uid, loadEnrollments]);

  if (loading) return <div>checking user data</div>;
  if (!user) return <Navigate to="/login" />;

  const role = (user.role || "learner").toLowerCase();

  if (role === "instructor") {
    return <DashboardContent user={user} />;
  }
  if (role === "student") {
    return (
      <WelcomeStudent
        user={user}
        allEnrollments={allEnrollments} // <-- pass catalog
        enrollmentData={enrollmentData} // <-- pass firestore data
        onRefresh={loadEnrollments} // <-- optional: let child refresh
      />
    );
  }

  return <WelcomeLearner user={user} />;
};
export default DashboardMain;
