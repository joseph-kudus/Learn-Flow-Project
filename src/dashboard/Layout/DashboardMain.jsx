import React from "react";
import UseuserRole from "../UserData/UseuserRole";
import { Navigate } from "react-router-dom";
import DashboardContent from "../Layout/DashboardContent"; // View Learner
import WelcomeStudent from "../Layout/WelcomeStudent"; // View Student
import WelcomeInstructor from "../Layout/WelcomeInstructor"; // View Instructors
import WelcomeLearner from "./WelcomeLearner";

const DashboardMain = () => {
  const { user, loading } = UseuserRole();
  if (loading) return <div>checking user data</div>;
  if (!user) return <Navigate to="/login" />;

  const role = (user.role || "learner").toLowerCase();

  if (role === "instructor") {
    return <DashboardContent user={user} />;
  }
  if (role === "student") {
    return <WelcomeStudent user={user} />;
  }

  //default =learners
  // return <DashboardContent user={user} />;
  return <WelcomeLearner user={user} />;
};
export default DashboardMain;
