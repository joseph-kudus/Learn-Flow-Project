import React, { useState, useEffect } from "react";
import "./learnerdashboard.css";
import { useAuth } from "../../context/AuthContext";
import { allEnrollments, getUserEnrollments } from "../UserData/allEnrollments";
import StudentEnrollment from "../UserData/StudentEnrollment";

const WelcomeLearner = () => {
  const { userData, currentUser } = useAuth();

  const [myCourseIds, setMyCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }

      try {
        const ids = await getUserEnrollments(currentUser.uid);
        setMyCourseIds(ids);
      } catch (error) {
        console.error("Failed to load enrollments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [currentUser]);

  const displayUsername =
    userData?.nickname ||
    userData?.displayName ||
    userData?.username ||
    userData?.email?.split("@")[0] ||
    "Learner";

  const totalCourses = allEnrollments.length;
  const enrolledCourses = myCourseIds.length;

  // Temporary statistics
  const completedCourses = 0;
  const inProgressCourses = enrolledCourses;
  const notStartedCourses = totalCourses - enrolledCourses;

  if (loading) {
    return <p>Loading learner dashboard...</p>;
  }

  return (
    <div className="course-container">
      {/* LEFT COLUMN */}
      <div className="course-wrapper">
        <div className="welcome-click">
          <div className="welcome-text">
            <h1>Welcome Back, {displayUsername}</h1>

            <p>Lets boost your knowledge and learn new things today.</p>

            <button className="welcome-text-btn">Continue Learning</button>
          </div>
        </div>

        {/* MY COURSES */}
        <StudentEnrollment
          title="My Courses"
          filter="enrolled"
          myCourseIds={myCourseIds}
          setMyCourseIds={setMyCourseIds}
        />

        {/* RECOMMENDED */}
        <StudentEnrollment
          title="Recommended For You"
          filter="recommended"
          limit={3}
          myCourseIds={myCourseIds}
          setMyCourseIds={setMyCourseIds}
        />
      </div>

      {/* RIGHT COLUMN */}
      <div className="coursecompletion">
        <div className="overview">
          <h1>Course Completion Overview</h1>

          <ol>
            <li>
              <strong>Completed:</strong> {completedCourses}
            </li>

            <li>
              <strong>In Progress:</strong> {inProgressCourses}
            </li>

            <li>
              <strong>Not Started:</strong> {notStartedCourses}
            </li>
          </ol>
        </div>

        <div className="achievement">
          <h2>Your Achievements</h2>

          <h5>
            Celebrate your learning journey with {Math.min(enrolledCourses, 10)}
            /10 badges earned.
          </h5>

          <div className="badges">
            {[...Array(10)].map((_, index) => (
              <img
                key={index}
                src={`/badges/badge${index + 1}.svg`}
                alt={`Badge ${index + 1}`}
                className={
                  index < Math.min(enrolledCourses, 10) ? "earned" : "locked"
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeLearner;
