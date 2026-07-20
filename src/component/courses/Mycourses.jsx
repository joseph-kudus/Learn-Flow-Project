import React, { useRef, useMemo, useEffect } from "react";
import { FaArrowLeftLong, FaArrowRight, FaStar } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "../../styles/mycourse.css";
const statusClassMap = {
  upcoming: "upcoming",
  submitted: "submitted",
  missed: "missed",
  attended: "attended",
  graded: "graded",
};

const formatDateLabel = (dateStr) => {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const d = new Date(dateStr).toDateString();

  if (d === today)
    return `Today, ${new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;

  if (d === yesterday)
    return `Yesterday, ${new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;

  return new Date(dateStr).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getDate = (value) => {
  if (!value) return new Date();

  return value.toDate ? value.toDate() : new Date(value);
};

const generateActivities = (enrollmentData) => {
  const activities = [];

  enrollmentData.forEach((course) => {
    // 1. Enrollment activity
    if (course.enrolledAt) {
      const date = getDate(course.enrolledAt);

      activities.push({
        date: date.toISOString(),
        time: date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        title: course.courseTitle,
        type: "Course Enrollment",
        status: "attended",
      });
    }

    // 2. Lesson completed activities
    if (
      Array.isArray(course.completedLessonIds) &&
      course.completedLessonIds.length
    ) {
      course.completedLessonIds.forEach((lessonIndex) => {
        const date = getDate(course.lastAccessed);

        activities.push({
          date: date.toISOString(),

          time: date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),

          title: course.courseTitle,

          type: `Lesson ${lessonIndex + 1} Completed`,

          status: "submitted",
        });
      });
    }

    // 3. Course completed
    if (course.status === "completed" && course.lastAccessed) {
      const date = getDate(course.lastAccessed);

      activities.push({
        date: date.toISOString(),

        time: date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),

        title: course.courseTitle,

        type: "Course Completed",

        status: "graded",

        grade: "100%",
      });
    }
  });

  return activities;
};

const Mycourses = ({ allEnrollments = [], enrollmentData = [] }) => {
  const navigate = useNavigate();

  const activeRef = useRef(null);
  const recentRef = useRef(null);

  const scroll = (ref, dir) => {
    if (!ref.current) return;

    ref.current.scrollBy({
      left: dir === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  const courseMap = useMemo(
    () => new Map(allEnrollments.map((c) => [String(c.id), c])),
    [allEnrollments],
  );

  const myCourses = useMemo(() => {
    return enrollmentData
      .map((e) => {
        const course = courseMap.get(String(e.courseId));

        if (!course) return null;

        const totalLessons = Array.isArray(course.lessons)
          ? course.lessons.length
          : Number(course.lessons) || course.totalLessons || 0;

        const completedLessons = e.completedLessons || 0;

        const percent = totalLessons
          ? Math.round((completedLessons / totalLessons) * 100)
          : e.progress || 0;

        return {
          ...e,
          courseId: String(e.courseId),
          title: course.title,
          category: course.category,
          image: course.image,
          rating: course.rating,
          lessons: totalLessons,
          lessonList: Array.isArray(course.lessons) ? course.lessons : [],
          totalLessons,
          progress: percent,
        };
      })
      .filter(Boolean);
  }, [enrollmentData, courseMap]);

  const activeCourses = useMemo(
    () => myCourses.filter((e) => e.progress > 0 && e.progress < 100),
    [myCourses],
  );

  const recentCourses = useMemo(
    () => myCourses.filter((e) => e.progress === 0).slice(0, 4),
    [myCourses],
  );

  const realActivities = useMemo(() => {
    return generateActivities(enrollmentData);
  }, [enrollmentData]);

  const groupedActivities = useMemo(() => {
    return realActivities.reduce((acc, item) => {
      const key = item.date.split("T")[0];
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
  }, [realActivities]);

  const CourseCard = ({ enrollment, variant = "resume" }) => {
    const percent = enrollment.progress || 0;
    return (
      <div className="course-card">
        <div
          className={
            variant === "start" ? "card_container_start" : "card_container"
          }
        >
          <img
            src={enrollment.image}
            alt={enrollment.title}
            onError={(e) => {
              e.target.src = "/placeholder.jpg";
            }}
          />

          <div className="intro">
            <p>
              <strong>{enrollment.title}</strong>
            </p>

            <p>{enrollment.category}</p>
          </div>
        </div>

        {variant === "resume" && (
          <>
            <div
              className="progress-bar"
              style={{
                "--progress": `${percent}%`,
              }}
            />

            <hr />
          </>
        )}

        <div className="card_details">
          <p>
            {enrollment.completedLessons || 0}/{enrollment.totalLessons || 0}{" "}
            Classes
          </p>

          <p>{enrollment.timeSpent || "1hr 45 Minutes"}</p>

          {variant === "start" && (
            <p>
              <FaStar
                style={{
                  color: "#FFD166",
                  marginRight: 4,
                }}
              />
              {enrollment.rating} ratings
            </p>
          )}
        </div>

        <div className="resume-btn">
          <button
            className={variant === "start" ? "resume-btn-start" : ""}
            onClick={() => navigate(`/learn/${enrollment.courseId}`)}
          >
            {variant === "start" ? "Start Course" : "Resume Classes"}
          </button>

          <button onClick={() => navigate(`/learn/${enrollment.courseId}`)}>
            <FaArrowRight />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="myclass">
      <div className="Course-Content-Container">
        <div className="active-course">
          <h3>Active Courses</h3>

          {activeCourses.length > 1 && (
            <div className="arrows">
              <button onClick={() => scroll(activeRef, "left")}>
                <FaArrowLeftLong />
              </button>

              <button onClick={() => scroll(activeRef, "right")}>
                <FaArrowRight />
              </button>
            </div>
          )}
        </div>

        <div className="active-cours" ref={activeRef}>
          {activeCourses.length ? (
            activeCourses.map((e) => (
              <CourseCard key={e.courseId} enrollment={e} variant="resume" />
            ))
          ) : (
            <p style={{ padding: "12px", color: "#666" }}>
              No active courses yet.
            </p>
          )}
        </div>

        <div className="active-course">
          <h3>Recently Enrolled</h3>

          {recentCourses.length > 1 && (
            <div className="arrows">
              <button onClick={() => scroll(recentRef, "left")}>
                <FaArrowLeftLong />
              </button>

              <button onClick={() => scroll(recentRef, "right")}>
                <FaArrowRight />
              </button>
            </div>
          )}
        </div>

        <div className="active-cours" ref={recentRef}>
          {recentCourses.length ? (
            recentCourses.map((e) => (
              <CourseCard key={e.courseId} enrollment={e} variant="start" />
            ))
          ) : (
            <p style={{ padding: "12px", color: "#666" }}>
              No recent enrollments.
            </p>
          )}
        </div>
      </div>

      <div className="active-course-activ">
        <div className="active-course-active">
          <h3>Recent Activities</h3>

          <div className="arrows">
            <button>
              <IoIosMore />
            </button>
          </div>
        </div>

        <div className="actives-wrapper">
          {Object.keys(groupedActivities).length ? (
            Object.entries(groupedActivities)

              .sort(([a], [b]) => new Date(b) - new Date(a))

              .map(([date, items]) => (
                <div className="todays_activies" key={date}>
                  <p>{formatDateLabel(date)}</p>

                  {items.map((act, index) => (
                    <div className="lesson_schedule" key={index}>
                      <p>
                        <strong>{act.time}</strong>
                      </p>

                      <div className="classes_view">
                        <p>{act.title}</p>

                        <p>{act.type}</p>
                      </div>

                      {act.status === "graded" ? (
                        <p className="graded-text">Graded {act.grade}</p>
                      ) : (
                        <button className={statusClassMap[act.status]}>
                          {act.status.charAt(0).toUpperCase() +
                            act.status.slice(1)}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ))
          ) : (
            <p style={{ padding: "12px", color: "#666" }}>
              No recent activities.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Mycourses;
