
import React, { useEffect, useMemo, useState } from "react";
import { Courseicon } from "../../assets/images/Myimg";
import { book2 } from "../../assets/images/logos";
import "../../styles/welcomeStudent.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdAccessTime } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import FilterButtons from "../ui/Button/FilterButtons";
import StudentEnrollment from "../../component/courses/StudentEnrollment";
import Button from "../ui/Button/Button";

import { getCourses } from "../../services/course/courseService";

const WelcomeStudent = ({
  user,
  allEnrollments = [],
  enrollmentData = [],
  completedCourses = [],
  enrollmentsLoading = false,
  onRefresh,
}) => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [firestoreCourses, setFirestoreCourses] = useState([]);

  const navigate = useNavigate();

  /* ======================================================
     REFRESH ENROLLMENTS
  ====================================================== */

  useEffect(() => {
    onRefresh?.();
  }, [onRefresh]);

  /* ======================================================
     LOAD FIRESTORE COURSES
  ====================================================== */

  useEffect(() => {
    const loadFirestoreCourses = async () => {
      try {
        const courses = await getCourses();

        const publishedCourses = courses.filter(
          (course) => course.status === "published",
        );

        setFirestoreCourses(publishedCourses);
      } catch (error) {
        console.error(
          "Failed to load Firestore courses:",
          error,
        );

        setFirestoreCourses([]);
      }
    };

    loadFirestoreCourses();
  }, []);

  /* ======================================================
     USER DISPLAY
  ====================================================== */

  const firstnamedisplay =
    user?.nickname ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "student";

  const isLoading = enrollmentsLoading;

  /* ======================================================
     COURSE CATALOG
     STATIC + FIRESTORE
  ====================================================== */

  const courseCatalog = useMemo(() => {
    const courseMap = new Map();

    /* STATIC COURSES */

    allEnrollments.forEach((course) => {
      if (course?.id != null) {
        courseMap.set(String(course.id), course);
      }
    });

    /* FIRESTORE COURSES */

    firestoreCourses.forEach((course) => {
      if (course?.id != null) {
        courseMap.set(String(course.id), course);
      }
    });

    return Array.from(courseMap.values());
  }, [allEnrollments, firestoreCourses]);

  /* ======================================================
     CATEGORY OPTIONS
  ====================================================== */

  const categoryOptions = useMemo(() => {
    const PINNED = ["CODING", "PROGRAMMING"];

    const existingCats = new Set(
      courseCatalog
        .map((course) => course?.category)
        .filter(Boolean)
        .map((category) => category.toUpperCase()),
    );

    const pinnedWithData = PINNED.filter((value) =>
      existingCats.has(value),
    );

    const hasOthers = courseCatalog.some((course) => {
      const category = course?.category?.toUpperCase();

      return category && !PINNED.includes(category);
    });

    const options = [
      { label: "All", value: "ALL" },
      ...pinnedWithData.map((value) => ({
        label: value,
        value,
      })),
    ];

    if (hasOthers) {
      options.push({
        label: "More...",
        value: "MORE",
      });
    }

    return options;
  }, [courseCatalog]);

  /* ======================================================
     MAP COURSE IDS
  ====================================================== */

  const courseMap = useMemo(
    () =>
      new Map(
        courseCatalog.map((course) => [
          String(course.id),
          course,
        ]),
      ),
    [courseCatalog],
  );

  /* ======================================================
     ENROLLED COURSES
  ====================================================== */

  const enrolledCourses = useMemo(() => {
    if (enrollmentsLoading) {
      return [];
    }

    return enrollmentData
      .filter(
        (enrollment) =>
          enrollment.courseId &&
          enrollment.status?.toLowerCase() !== "completed",
      )
      .map((enrollment) => {
        const course = courseMap.get(
          String(enrollment.courseId),
        );

        if (!course) {
          console.warn(
            "Missing course:",
            enrollment.courseId,
          );

          return null;
        }

        const totalLessons =
          enrollment.totalLessons ||
          course.totalLessons ||
          course.lessons?.length ||
          1;

        const completedLessons =
          Number(enrollment.completedLessons) || 0;

        const nextLessonIndex =
          enrollment.nextLessonIndex ??
          completedLessons ??
          0;

        return {
          id: course.id,

          title: course.title,

          category:
            course.category?.toUpperCase() ||
            "OTHER",

          img:
            course.image ||
            course.imageUrl ||
            course.img ||
            Courseicon,

          classesCompleted: completedLessons,

          totalClasses: totalLessons,

          duration: `${course.durationWeeks || 6}w`,

          nextLessonIndex,

          progress: Math.min(
            100,
            Math.round(
              (completedLessons / totalLessons) * 100,
            ),
          ),
        };
      })
      .filter(Boolean);
  }, [
    enrollmentData,
    courseMap,
    enrollmentsLoading,
  ]);

  /* ======================================================
     FILTER COURSES
  ====================================================== */

  const filteredCourses = useMemo(() => {
    if (activeCategory === "ALL") {
      return enrolledCourses;
    }

    if (activeCategory === "MORE") {
      return enrolledCourses.filter(
        (course) =>
          !["CODING", "PROGRAMMING"].includes(
            course.category,
          ),
      );
    }

    return enrolledCourses.filter(
      (course) =>
        course.category === activeCategory,
    );
  }, [activeCategory, enrolledCourses]);

  /* ======================================================
     COURSE STATES
  ====================================================== */

  const hasActiveCourses = enrolledCourses.length > 0;

  const hasEnrollmentHistory =
    enrollmentData.length > 0 ||
    completedCourses.length > 0;

  const isNewStudent =
    !enrollmentsLoading &&
    !hasEnrollmentHistory &&
    courseCatalog.length > 0;

  /* ======================================================
     LOADING UI
  ====================================================== */

  if (isLoading) {
    return (
      <section className="content-section">
        <p className="coursent">
          Loading courses...
        </p>
      </section>
    );
  }

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <section className="content-section">
      <div className="welcome-banner">
        <div className="greet-banner">
          <h1>Hello {firstnamedisplay}</h1>
          <p>
            Let's learn something exciting today!
          </p>
        </div>

        <FilterButtons
          activeFilter={activeCategory}
          setActiveFilter={setActiveCategory}
          options={categoryOptions}
        />
      </div>

      <div className="card-container">
        {isNewStudent ? (
          <StudentEnrollment
            title="Recommended For You"
            filter="recommended"
            limit={6}
            myCourseIds={[]}
            allEnrollments={courseCatalog}
          />
        ) : hasActiveCourses ? (
          filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="course-card-container"
              >
                <div className="card-header">
                  <img
                    src={course.img}
                    alt={course.title}
                    className="card-image"
                  />

                  <div className="bek">
                    <h3>{course.title}</h3>

                    <span className="card-category">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="progress-section">
                  <div className="progress-bard">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${course.progress}%`,
                      }}
                    />
                  </div>

                  <span className="progress-text">
                    {course.progress}%
                  </span>
                </div>

                <div className="lessons">
                  <div className="lessons-logo">
                    <img src={book2} alt="ff" />

                    <p>
                      {course.classesCompleted}/
                      {course.totalClasses} Classes
                    </p>
                  </div>

                  <div className="durationy">
                    <MdAccessTime size={20} />

                    <p>{course.duration}</p>
                  </div>
                </div>

                <hr />

                <div className="card-footer">
                  <Button
                    variant="primary"
                    onClick={() =>
                      navigate(
                        `/dashboard/course/${course.id}`,
                        {
                          state: {
                            lessonIndex:
                              course.nextLessonIndex,
                          },
                        },
                      )
                    }
                  >
                    Resume Classes
                  </Button>

                  <Button
                    variant="primary"
                    className="arrow-btn"
                    rightIcon={
                      <FaArrowRightLong />
                    }
                    onClick={() =>
                      navigate(
                        `/dashboard/course/${course.id}`,
                        {
                          state: {
                            lessonIndex:
                              course.nextLessonIndex,
                          },
                        },
                      )
                    }
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="coursent">
              No courses in this category.
            </p>
          )
        ) : (
          <p className="coursent">
            No active courses found.
          </p>
        )}
      </div>

      {/* ==================================================
          COMPLETED COURSES TABLE
      ================================================== */}

      <div className="course-main">
        <div className="table-header">
          <h3>Completed courses</h3>

          <button className="view-all">
            View All
          </button>
        </div>

        <table className="courses-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Grade Score</th>
              <th>Completion Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {completedCourses.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "12px",
                    color: "#666",
                  }}
                >
                  No completed courses yet.
                </td>
              </tr>
            ) : (
              completedCourses.map((course) => (
                <tr key={course.id}>
                  <td>
                    {course.code ||
                      course.courseCode}
                  </td>

                  <td>
                    {course.title ||
                      course.courseTitle}
                  </td>

                  <td>{course.grade}</td>

                  <td>
                    {course.date ||
                      course.completedAt}
                  </td>

                  <td>
                    <span
                      className={`status ${course.status}`}
                    >
                      {course.status ===
                      "pass"
                        ? "Pass"
                        : "Fail"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default WelcomeStudent;
