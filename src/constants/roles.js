import WelcomeStudent from "../component/dashboard/WelcomeStudent";

export const ROLES = {
  STUDENT: "student",
  LEARNER: "learner",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
};
if (role = ROLES.STUDENT) {
    return <WelcomeStudent/>
}