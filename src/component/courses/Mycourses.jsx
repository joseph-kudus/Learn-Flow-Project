import React, { useMemo, useRef } from "react";
import { FaArrowLeftLong, FaArrowRight, FaStar } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import "../../styles/mycourse.css";
import Button from "../ui/Button/Button";

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

  const date = new Date(dateStr);

  if (date.toDateString() === today) {
    return `Today, ${date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;
  }

  if (date.toDateString() === yesterday) {
    return `Yesterday, ${date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;
  }

  return date.toLocaleDateString("en-GB", {
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

const CourseCard = ({ enrollment, variant = "resume", navigate }) => {
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
            e.currentTarget.src = "/placeholder.jpg";
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
            <FaStar />
            {enrollment.rating} ratings
          </p>
        )}
      </div>

      <div className="resume-btn">
        <Button
          variant={variant === "start" ? "primary" : "secondary"}
          className={variant === "start" ? "resume-btn-start" : ""}
          onClick={() => navigate(`/learn/${enrollment.courseId}`)}
        >
          {variant === "start" ? "Start Course" : "Resume Classes"}
        </Button>

        <Button
          variant="primary"
          className="arrow-btn"
          rightIcon={<FaArrowRight />}
          onClick={() => navigate(`/learn/${enrollment.courseId}`)}
        />
      </div>
    </div>
  );
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

        const completedLessons =
          e.completedLessons ?? e.completedLessonIds?.length ?? 0;

        const progress = totalLessons
          ? Math.round((completedLessons / totalLessons) * 100)
          : e.progress || 0;

        return {
          ...e,

          courseId: String(e.courseId),

          title: course.title,

          category: course.category,

          image: course.image,

          rating: course.rating,

          totalLessons,

          completedLessons,

          progress,
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

  const groupedActivities = useMemo(() => {
    return generateActivities(enrollmentData).reduce((acc, item) => {
      const key = item.date.split("T")[0];

      if (!acc[key]) acc[key] = [];

      acc[key].push(item);

      return acc;
    }, {});
  }, [enrollmentData]);

  return (
    <div className="myclass">
      <div className="Course-Content-Container">
        <div className="active-course">
          <h3>Active Courses</h3>

          <div className="arrows">
            <Button
              variant="outline"
              className="carousel"
              leftIcon={<FaArrowLeftLong />}
              onClick={() => scroll(activeRef, "left")}
            />

            <Button
              variant="outline"
              className="carousel"
              rightIcon={<FaArrowRight />}
              onClick={() => scroll(activeRef, "right")}
            />
          </div>
        </div>

        <div className="active-cours" ref={activeRef}>
          {activeCourses.length ? (
            activeCourses.map((e) => (
              <CourseCard key={e.courseId} enrollment={e} navigate={navigate} />
            ))
          ) : (
            <p className="empty-state">No active courses yet.</p>
          )}
        </div>

        <div className="active-course">
          <h3>Recently Enrolled</h3>

          <div className="arrows">
            <Button
              variant="outline"
              leftIcon={<FaArrowLeftLong />}
              onClick={() => scroll(recentRef, "left")}
            />

            <Button
              variant="outline"
              rightIcon={<FaArrowRight />}
              onClick={() => scroll(recentRef, "right")}
            />
          </div>
        </div>

        <div className="active-cours" ref={recentRef}>
          {recentCourses.map((e) => (
            <CourseCard
              key={e.courseId}
              enrollment={e}
              variant="start"
              navigate={navigate}
            />
          ))}
        </div>
      </div>

      <div className="active-course-activ">
        <div className="active-course-active">
          <h3>Recent Activities</h3>

          <Button variant="outline" rightIcon={<IoIosMore />} />
        </div>

        <div className="actives-wrapper">
          {Object.entries(groupedActivities)
            .sort(([a], [b]) => new Date(b) - new Date(a))
            .map(([date, items]) => (
              <div className="todays_activies" key={date}>
                <p>{formatDateLabel(date)}</p>

                {items.map((act, index) => (
                  <div className="lesson_schedule" key={`${act.type}-${index}`}>
                    <strong>{act.time}</strong>

                    <div className="classes_view">
                      <p>{act.title}</p>

                      <p>{act.type}</p>
                    </div>

                    {act.status === "graded" ? (
                      <p className="graded-text">Graded {act.grade}</p>
                    ) : (
                      <span className={statusClassMap[act.status]}>
                        {act.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Mycourses;
