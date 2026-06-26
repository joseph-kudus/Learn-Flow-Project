import React, { useState, useEffect } from "react";
import "./learnerdashboard.css";
import { useAuth } from "../../context/AuthContext";
import { allEnrollments, getUserEnrollments } from "../UserData/allEnrollments";
import StudentEnrollment from "../UserData/StudentEnrollment";

const WelcomeLearner = () => {
  const { userData, currentUser } = useAuth();
  const [myCourseIds, setMyCourseIds] = useState([]);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const fetchEnrollments = async () => {
      const ids = await getUserEnrollments(currentUser.uid);
      setMyCourseIds(ids);
    };

    fetchEnrollments();
  }, [currentUser]);

  const displayusername =
    userData?.nickname ||
    userData?.displayname ||
    userData?.email?.split("@")[0] ||
    "learner";

  const totalCourses = allEnrollments.length;
  const completed = myCourseIds.length;
  const notStarted = Math.max(0, totalCourses - completed);

  return (
    <div className="course-container">
      {/* Left Column */}
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
          title="My Courses"
          myCourseIds={myCourseIds}
          setMyCourseIds={setMyCourseIds}
        />

        <StudentEnrollment
          filter="recommended"
          title="Recommended For You"
          limit={3}
          myCourseIds={myCourseIds}
          setMyCourseIds={setMyCourseIds}
        />
      </div>

      {/* Right Column */}
      <div className="coursecompletion">
        <div className="overview">
          <h1>Course Completion Overview</h1>
          <ol>
            <li>Completed: {completed}</li>
            <li>In Progress: 0</li>
            <li>Not Started: {notStarted}</li>
          </ol>
        </div>

        <div className="achievement">
          <h5>
            Celebrate Your Learning Journey with {completed}/10 badges earned.
          </h5>
          <div className="badges">
            {[...Array(10)].map((_, index) => (
              <img
                key={index}
                src={`/badges/badge${index + 1}.svg`}
                alt={`badge${index + 1}`}
                className={index < completed ? "earned" : "locked"}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeLearner;
