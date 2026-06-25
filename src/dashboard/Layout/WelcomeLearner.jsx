import React, { useState, useEffect } from "react";
import "./learnerdashboard.css";
import { useAuth } from "../../context/AuthContext";
import { allEnrollments, getUserEnrollments } from "../UserData/allEnrollments";
import StudentEnrollment from "../UserData/StudentEnrollment";

const WelcomeLearner = () => {
  const { userData } = useAuth();

  const displayusername =
    userData?.nickname ||
    userData?.displayname ||
    userData?.email?.split("@")[0] ||
    "learner";

  return (
    <div className="course-container">
      <div className="course-wrapper">
        <div className="welcome-click">
          <div className="welcome-text">
            <h1>Welcome Back {displayusername}!</h1>
            <p>Let's boost your knowledge and learn new things today.</p>
            <button>Join</button>
          </div>
        </div>

        <StudentEnrollment
          filter="enrolled"
          title="My Active Courses"
        />

        <StudentEnrollment
          filter="recommended"
          title="Recommended For You"
          limit={3}
        />
      </div>

      <CourseStats />
    </div>
  );
};

// Stats component with proper imports
const CourseStats = () => {
  const { currentUser } = useAuth();
  const [myCourseIds, setMyCourseIds] = useState([]);

  useEffect(() => {
    if (!currentUser?.uid) return;
    getUserEnrollments(currentUser.uid).then(setMyCourseIds);
  }, [currentUser]);

  return (
    <div className="coursecompletion">
      <div className="overview">
        <h1>Course Completion overview</h1>
        <ol>
          <li>Completed: {myCourseIds.length}</li>
          <li>In Progress: 0</li>
          <li>Not Started: {allEnrollments.length - myCourseIds.length}</li>
        </ol>
      </div>
      <div className="achievement">
        <h5>
          Celebrate Your Learning Journey with {myCourseIds.length}/10 badges earned.
        </h5>
        <div className="badges">
          {[...Array(10)].map((_, i) => (
            <img
              key={i}
              src={`/badges/badge${i + 1}.svg`}
              alt={`badge${i + 1}`}
              className={i < myCourseIds.length? "earned" : "locked"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeLearner;