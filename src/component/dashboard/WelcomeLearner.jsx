import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/learnerdashboard.css";
import StudentEnrollment from "../../component/courses/StudentEnrollment";
import Button from "../ui/Button/Button";

import { getAvailableCourses } from "../../services/allEnrollments";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const WelcomeLearner = ({
  user,
  allEnrollments,
  enrollmentData = [],
  enrollmentsLoading,
}) => {
  const navigate = useNavigate();

  /* ======================================================
     AVAILABLE COURSES

     Static courses + published Firestore courses
  ====================================================== */

  const [availableCourses, setAvailableCourses] = useState(
    allEnrollments || [],
  );

  const [coursesLoading, setCoursesLoading] = useState(true);

  /* ======================================================
     USER COURSE IDS
  ====================================================== */

  const myCourseIds = useMemo(
    () => enrollmentData.map((e) => String(e.courseId)),
    [enrollmentData],
  );

  /* ======================================================
     USERNAME
  ====================================================== */

  const displayUsername =
    user?.nickname ||
    user?.displayName ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "learner";

  const enrolledCourses = enrollmentData.length;

  const isNewLearner = !enrollmentsLoading && enrolledCourses === 0;

  /* ======================================================
  COURSE STATS
====================================================== */

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

  /* ======================================================
  COURSE COMPLETION CHART
====================================================== */

  const completionData = useMemo(() => {
    const total = enrolledCourses;

    if (total === 0) {
      return [
        {
          name: "Not Started",
          value: 100,
          count: 0,
        },
      ];
    }

    return [
      {
        name: "Completed",
        value: Math.round((stats.completed / total) * 100),
        count: stats.completed,
      },
      {
        name: "In Progress",
        value: Math.round((stats.inProgress / total) * 100),
        count: stats.inProgress,
      },
      {
        name: "Not Started",
        value: Math.round((stats.notStarted / total) * 100),
        count: stats.notStarted,
      },
    ];
  }, [stats, enrolledCourses]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setCoursesLoading(true);

        const courses = await getAvailableCourses();

        setAvailableCourses(courses);
      } catch (error) {
        console.error("Failed loading learner courses:", error);

        // Keep static courses available if Firestore fails
        setAvailableCourses(allEnrollments || []);
      } finally {
        setCoursesLoading(false);
      }
    };

    loadCourses();
  }, [allEnrollments]);

  /* ======================================================
     COURSE TO CONTINUE
  ====================================================== */

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

        {/* ======================================================
            RECOMMENDED COURSES

            Static + published Firestore courses
        ====================================================== */}

        {!coursesLoading && (
          <StudentEnrollment
            title="Recommended For You"
            filter="recommended"
            limit={6}
            myCourseIds={myCourseIds}
            allEnrollments={availableCourses}
          />
        )}

        {/* ======================================================
            EMPTY STATE
        ====================================================== */}

        {isNewLearner && (
          <div className="empty-state">
            <h2>Pick Your First Course</h2>

            <p>
              You haven't enrolled in any courses yet. Start with one of the
              recommendations above.
            </p>
          </div>
        )}

        {/* ======================================================
            MY COURSES
        ====================================================== */}

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

          <div className="completion-chart">
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={completionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={6}
                    stroke="none"
                  >
                    {completionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name === "Completed"
                            ? "#4CAF50"
                            : entry.name === "In Progress"
                              ? "#F7CA4E"
                              : "#D9DDE5"
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>

              <div className="chart-center">
                <strong>
                  {enrolledCourses > 0
                    ? Math.round((stats.completed / enrolledCourses) * 100)
                    : 0}
                  %
                </strong>
                <span>Completed</span>
              </div>
            </div>

            <div className="completion-legend">
              {completionData.map((item) => (
                <div className="completion-item" key={item.name}>
                  <div className="completion-label">
                    <span
                      className={`completion-dot ${item.name
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    />

                    <span>{item.name}</span>
                  </div>

                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
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
};;

export default WelcomeLearner;
