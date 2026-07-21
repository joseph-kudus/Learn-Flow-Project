import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/learnerdashboard.css";
import StudentEnrollment from "../../component/courses/StudentEnrollment";
import Button from "../ui/Button/Button";

const WelcomeLearner = ({
  user,
  allEnrollments,
  enrollmentData = [],
  enrollmentsLoading,
}) => {
  const navigate = useNavigate();

  const myCourseIds = useMemo(
    () => enrollmentData.map((e) => e.courseId),
    [enrollmentData],
  );

  const displayUsername =
    user?.nickname ||
    user?.displayName ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "learner";

  const enrolledCourses = enrollmentData.length;

  const isNewLearner = !enrollmentsLoading && enrolledCourses === 0;

  const stats = useMemo(() => {
    const completed = enrollmentData.filter((e) => e.progress >= 100).length;

    const inProgress = enrollmentData.filter(
      (e) => e.progress > 0 && e.progress < 100,
    ).length;

    const notStarted = Math.max(0, enrolledCourses - completed - inProgress);

    return {
      completed,
      inProgress,
      notStarted,
    };
  }, [enrollmentData, enrolledCourses]);

  const courseToContinue = useMemo(() => {
    if (!enrollmentData.length) return null;

    return (
      [...enrollmentData]
        .sort((a, b) => b.progress - a.progress)
        .find((e) => e.progress < 100) || enrollmentData[0]
    );
  }, [enrollmentData]);

  return (
    <div className="course-container">
      <div className="course-wrapper">
        <div className="welcome-click">
          <div className="welcome-text">
            <h1>
              {isNewLearner
                ? `Welcome to LearnFlow, ${displayUsername}`
                : `Welcome Back, ${displayUsername}`}
            </h1>

            <p>
              {isNewLearner
                ? "Start your learning journey by choosing one of the recommended courses below."
                : "Let's continue your learning journey today."}
            </p>

            <Button
              variant="primary"
              className="welcome-text-btn"
              onClick={() =>
                courseToContinue
                  ? navigate(`/learn/${courseToContinue.courseId}`)
                  : navigate("/catalog")
              }
            >
              {courseToContinue ? "Continue Learning" : "Browse All Courses"}
            </Button>
          </div>
        </div>

        {/* Recommended Courses always visible */}

        <StudentEnrollment
          title="Recommended For You"
          filter="recommended"
          limit={6}
          myCourseIds={myCourseIds}
          allEnrollments={allEnrollments}
        />

        {/* Empty state */}

        {isNewLearner && (
          <div className="empty-state">
            <h2>🚀 Pick Your First Course</h2>

            <p>
              You haven't enrolled in any courses yet. Start with one of the
              recommendations above.
            </p>
          </div>
        )}

        {/* My Courses */}

        {!enrollmentsLoading && enrolledCourses > 0 && (
          <StudentEnrollment
            title="My Courses"
            filter="enrolled"
            myCourseIds={myCourseIds}
            enrollmentData={enrollmentData}
          />
        )}
      </div>

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
