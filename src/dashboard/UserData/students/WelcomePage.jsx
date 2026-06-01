import React from "react";
import UseuserRole from "../UseuserRole";

const WelcomePage = () => {
    const {user}=UseuserRole
  return (
    <div>
          <h1>welcome to Kudovia { user?.role}</h1>
    </div>
  );
};
export default WelcomePage;
