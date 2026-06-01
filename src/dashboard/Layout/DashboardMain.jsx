import React from "react";
import UseuserRole from "../../dashboard/userdata/UseuserRole";
import { Navigate } from "react-router-dom";
import DashboardContent from "../Layout/DashboardContent"; // View Learner
import WelcomeStudent from "../Layout/WelcomeStudent"; // View Student
import WelcomeInstructor from "../Layout/WelcomeInstructor"; // View Instructors

const DashboardMain = () => {
  const { user, loading } = UseuserRole();
  if (loading) return <div>Loading ,,,,</div>;

  const role = (user.role || "learner").toLowerCase();
  if (!user) return <Navigate to="/register" />;

  if (role === "instructor") {
    return <WelcomeInstructor user={user} />;
  }
  if (role === "student") {
    return <WelcomeStudent user={user} />;
  }

  //default =learners
  return <DashboardContent user={user} />;
};
export default DashboardMain;
