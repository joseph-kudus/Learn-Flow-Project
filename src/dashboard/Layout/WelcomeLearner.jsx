import React, { useState, useEffect, useMemo, useCallback } from "react"; // 1. useCallback
import { useNavigate } from "react-router-dom";
import "./learnerdashboard.css";
import { useAuth } from "../../context/AuthContext";
import {
  allEnrollments,
  getUserEnrollments,
  getEnrollmentDetails,
} from "../UserData/allEnrollments";
import StudentEnrollment from "../UserData/StudentEnrollment";

const WelcomeLearner = () => {
  const { userData, currentUser } = useAuth();
  const navigate = useNavigate();

  const [myCourseIds, setMyCourseIds] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Extract fetch to reuse after enroll
  const refetchEnrollments = useCallback(async () => {
    if (!currentUser?.uid) return;
    try {
      const [ids, details] = await Promise.all([
        getUserEnrollments(currentUser.uid),
        getEnrollmentDetails(currentUser.uid),
      ]);
      setMyCourseIds(ids);
      setEnrollmentData(details);
    } catch (error) {
      console.error("Failed to load enrollments:", error);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await refetchEnrollments();
      setLoading(false);
    };
    init();
  }, [refetchEnrollments]);

  const displayUsername =
    userData?.nickname ||
    userData?.displayName ||
    userData?.username ||
    userData?.email?.split("@")[0] ||
    "Learner";

  const totalCourses = allEnrollments.length;
  const enrolledCourses = myCourseIds.length;

  const stats = useMemo(() => {
    const completed = enrollmentData.filter((e) => e.progress >= 100).length;
    const inProgress = enrollmentData.filter(
      (e) => e.progress > 0 && e.progress < 100,
    ).length;
    const notStarted = Math.max(0, enrolledCourses - inProgress - completed); // 3. Clamp to 0
    return { completed, inProgress, notStarted };
  }, [enrollmentData, enrolledCourses]);

  const courseToContinue = useMemo(() => {
    if (enrollmentData.length === 0) return null;
    const sorted = [...enrollmentData].sort((a, b) => b.progress - a.progress);
    return sorted.find((e) => e.progress < 100) ?? sorted[0];
  }, [enrollmentData]);

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

            <button
              className="welcome-text-btn"
              disabled={!courseToContinue}
              onClick={() =>
                courseToContinue &&
                navigate(`/learn/${courseToContinue.courseId}`)
              }
            >
              {courseToContinue ? "Continue Learning" : "Browse Courses"}
            </button>
          </div>
        </div>

        {/* MY COURSES */}
        <StudentEnrollment
          title="My Courses"
          filter="enrolled"
          myCourseIds={myCourseIds}
          setMyCourseIds={setMyCourseIds}
          enrollmentData={enrollmentData}
          setEnrollmentData={setEnrollmentData}
          onRefresh={refetchEnrollments} // 4. Let child trigger refresh
        />

        {/* RECOMMENDED */}
        <StudentEnrollment
          title="Recommended For You"
          filter="recommended"
          limit={3}
          myCourseIds={myCourseIds}
          setMyCourseIds={setMyCourseIds}
          enrollmentData={enrollmentData}
          setEnrollmentData={setEnrollmentData}
          onRefresh={refetchEnrollments} // 4. Same here
        />
      </div>

      {/* RIGHT COLUMN */}
      <div className="coursecompletion">
        <div className="overview">
          <h1>Course Completion Overview</h1>
          <ol>
            <li>
              <strong>Completed:</strong> {stats.completed}
            </li>
            <li>
              <strong>In Progress:</strong> {stats.inProgress}
            </li>
            <li>
              <strong>Not Started:</strong> {stats.notStarted}
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
