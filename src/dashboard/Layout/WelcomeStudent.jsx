import React, { useEffect, useMemo, useState } from "react";
import { Courseicon } from "../../assets/images/Myimg";
import { book2 } from "../../assets/images/logos";
import "./welcomeStudent.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdAccessTime } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import FilterButtons from "../UserData/FilterButtons";

const WelcomeStudent = ({
  user,
  allEnrollments = [],
  enrollmentData = [],
  completedCourses = [],
  onRefresh,
}) => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const navigate = useNavigate();

  useEffect(() => {
    onRefresh?.(); // refetch when you land back here from /lesson/:id
  }, [onRefresh]);

  const firstnamedisplay =
    user?.nickname ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "student";

  const isLoading = !allEnrollments.length || !enrollmentData.length; // <-- 1. loading flag

  // 1. Tabs: ALL + CODING + PROGRAMMING + MORE... only
  const categoryOptions = useMemo(() => {
    const PINNED = ["CODING", "PROGRAMMING"];
    const existingCats = new Set(
      allEnrollments.map((c) => c.category.toUpperCase()),
    );

    const pinnedWithData = PINNED.filter((v) => existingCats.has(v));
    const hasOthers = allEnrollments.some(
      (c) => !PINNED.includes(c.category.toUpperCase()),
    );

    const opts = [
      { label: "All", value: "ALL" },
      ...pinnedWithData.map((v) => ({ label: v, value: v })),
    ];

    if (hasOthers) opts.push({ label: "More...", value: "MORE" });
    return opts;
  }, [allEnrollments]);

  // 2. Map id -> course catalog. Use String keys for type safety
  const courseMap = useMemo(
    () => new Map(allEnrollments.map((c) => [String(c.id), c])),
    [allEnrollments],
  );

  // 3. FLOW: Enrolled + Active only = status!== completed. Must return []
  const enrolledCourses = useMemo(() => {
    if (isLoading) return []; // <-- 2. return [] here

    return enrollmentData
      .filter((e) => e.status !== "completed" && e.courseId != null)
      .map((e) => {
        const course = courseMap.get(String(e.courseId));
        if (!course) {
          console.warn(
            "Course id not found:",
            e.courseId,
            "in catalog ids:",
            allEnrollments.map((c) => c.id),
          );
          return null;
        }
        const total = e.totalLessons || course.lessons || 1;
        const done = e.completedLessons || 0;
        const percent = Math.round((done / total) * 100);
        return {
          id: course.id,
          title: course.title,
          category: course.category.toUpperCase(),
          img: course.image || Courseicon,
          classesCompleted: done,
          totalClasses: total,
          duration: `${course.durationWeeks || 6}w`,
          nextLesson: e.nextLesson || "Next Lesson",
          progress: percent,
        };
      })
      .filter(Boolean);
  }, [enrollmentData, courseMap, allEnrollments, isLoading]); // <-- add dep

  // 4. Filter logic to match tabs
  const filteredCourses = useMemo(() => {
    if (activeCategory === "ALL") return enrolledCourses;
    if (activeCategory === "MORE") {
      return enrolledCourses.filter(
        (course) => !["CODING", "PROGRAMMING"].includes(course.category),
      );
    }
    return enrolledCourses.filter(
      (course) => course.category === activeCategory,
    );
  }, [activeCategory, enrolledCourses]);

  // 5. Loading UI in render, not in memo
  if (isLoading) {
    return (
      <section className="content-section">
        <p className="coursent">Loading courses...</p>
      </section>
    );
  }

  return (
    <section className="content-section">
      <div className="welcome-banner">
        <div className="greet-banner">
          <h1>Hello {firstnamedisplay}</h1>
          <p>Let's learn something exciting today!</p>
        </div>

        <FilterButtons
          activeFilter={activeCategory}
          setActiveFilter={setActiveCategory}
          options={categoryOptions}
        />
      </div>

      <div className="card-container">
        {filteredCourses.length === 0 ? (
          <p className="coursent">No active courses found.</p>
        ) : (
          filteredCourses.map((course) => (
            <div key={course.id} className="course-card-container">
              <div className="card-header">
                <img
                  src={course.img}
                  alt={course.title}
                  className="card-image"
                />
                <div className="bek">
                  <h3>{course.title}</h3>
                  <span className="card-category">{course.category}</span>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-bard">
                  <div
                    className="progress-fill"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <span className="progress-text">{course.progress}%</span>
              </div>

              <div className="lessons">
                <div className="lessons-logo">
                  <img src={book2} alt="ff" />
                  <p>
                    {course.classesCompleted}/{course.totalClasses} Classes
                  </p>
                </div>
                <div className="durationy">
                  <MdAccessTime size={20} />
                  <p>{course.duration}</p>
                </div>
              </div>
              <hr />
              <div className="card-footer">
                <button onClick={() => navigate(`/dashboard/course/${course.id}`)}>
                  Resume Classes
                </button>

                <button
                  className="arrow-btn"
                  onClick={() =>
                    navigate(`/lesson/${course.id}`, {
                      state: { lesson: course.nextLesson },
                    })
                  }
                >
                  <FaArrowRightLong />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completed Courses Table */}
      <div className="course-main">
        <div className="table-header">
          <h3>Completed courses</h3>
          <button className="view-all">View All</button>
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
                  <td>{course.code || course.courseCode}</td>
                  <td>{course.title || course.courseTitle}</td>
                  <td>{course.grade}</td>
                  <td>{course.date || course.completedAt}</td>
                  <td>
                    <span className={`status ${course.status}`}>
                      {course.status === "pass" ? "Pass" : "Fail"}
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
