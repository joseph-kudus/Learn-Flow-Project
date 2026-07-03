import React, { useEffect, useMemo, useState } from "react";
import { GrMore } from "react-icons/gr";
import { MdOutlineMenuBook } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { LuClock3 } from "react-icons/lu";
import { IoHeart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import "./explore.css";
import FilterButtons from "../FilterButtons";
import {
  allEnrollments,
  enrollStudent,
  getUserEnrollments,
  getEnrollmentDetails,
} from "../allEnrollments"; // fixed double slash
import { useAuth } from "../../../context/AuthContext";

// 1. Build filter options from your real data
const CATEGORY_OPTIONS = [
  { label: "All", value: "ALL" },
  ...Array.from(
    new Set(allEnrollments.map((c) => c.category.toUpperCase())),
  ).map((cat) => ({ label: cat, value: cat })),
];

const Explore = ({onEnrolled}) => {
  const { currentUser, userData } = useAuth();
  const [myCourseIds, setMyCourseIds] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [enrollingId, setEnrollingId] = useState(null);
  const navigate = useNavigate();

  // 2. Load user enrollments once
  useEffect(() => {
    if (!currentUser?.uid) return;
    const load = async () => {
      const [ids, details] = await Promise.all([
        getUserEnrollments(currentUser.uid),
        getEnrollmentDetails(currentUser.uid),
      ]);
      setMyCourseIds(ids);
      setEnrollmentData(details);
    };
    load();
  }, [currentUser]);

  const handleEnroll = async (courseId) => {
    if (!currentUser || !userData) {
      alert("Please login first.");
      return;
    }
    setEnrollingId(courseId);
    try {
      const result = await enrollStudent(
        currentUser.uid,
        userData.email,
        courseId,
      );
      alert(result.message);
      if (result.success) {
        const [ids, details] = await Promise.all([
          getUserEnrollments(currentUser.uid),
          getEnrollmentDetails(currentUser.uid),
        ]);
        setMyCourseIds(ids);
        setEnrollmentData(details);
        navigate(`/learn/${courseId}`);
      }
    } catch (err) {
      console.error(err);
      alert("Enrollment failed.");
    } finally {
      setEnrollingId(null);
    }
  };

  // 3. Map your allEnrollments to Explore card shape
  const courses = useMemo(
    () =>
      allEnrollments.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category.toUpperCase(),
        image: c.image || "/placeholder.jpg",
        classes: c.lessons,
        duration: `${c.durationWeeks} Weeks`,
        rating: c.rating.toFixed(1),
        type: c.category.toUpperCase(), // used for filter
      })),
    [],
  );

  // 4. Split data for sections
  const trendingCourses = useMemo(
    () =>
      [...courses]
        .sort((a, b) => Number(b.rating) - Number(a.rating))
        .slice(0, 8),
    [courses],
  );

  const recommendedCourses = useMemo(
    () => courses.filter((c) => !myCourseIds.includes(c.id)).slice(0, 8),
    [courses, myCourseIds],
  );

  return (
    <div className="explore-page">
      {/* 5. ALL COURSES SECTION ADDED */}
      <CourseSection
        title="All Courses"
        courses={courses}
        myCourseIds={myCourseIds}
        enrollmentData={enrollmentData}
        onEnroll={handleEnroll}
        enrollingId={enrollingId}
        options={CATEGORY_OPTIONS}
      />

      <CourseSection
        title="Trending Courses"
        courses={trendingCourses}
        myCourseIds={myCourseIds}
        enrollmentData={enrollmentData}
        onEnroll={handleEnroll}
        enrollingId={enrollingId}
        options={CATEGORY_OPTIONS}
      />
      <CourseSection
        title="Recommended Courses"
        courses={recommendedCourses}
        myCourseIds={myCourseIds}
        enrollmentData={enrollmentData}
        onEnroll={handleEnroll}
        enrollingId={enrollingId}
        options={CATEGORY_OPTIONS}
      />
    </div>
  );
};

const CourseSection = ({
  title,
  courses,
  myCourseIds,
  enrollmentData,
  onEnroll,
  enrollingId,
  options,
}) => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const navigate = useNavigate();

  const filteredCourses =
    activeFilter === "ALL"
      ? courses
      : courses.filter((course) => course.type === activeFilter);

  const handleResume = (courseId) => navigate(`/learn/${courseId}`);

  return (
    <section className="course-section">
      <div className="section-header">
        <h2>{title}</h2>
        <FilterButtons
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          options={options} // 6. Pass real categories here
        />
      </div>

      <div className="course-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isEnrolled={myCourseIds.includes(course.id)}
              enrollment={enrollmentData.find(
                (e) => Number(e.courseId) === course.id,
              )}
              onEnroll={onEnroll}
              onResume={handleResume}
              loading={enrollingId === course.id}
            />
          ))
        ) : (
          <p className="no-courses">No courses found for this filter</p>
        )}
      </div>
    </section>
  );
};

const CourseCard = ({
  course,
  isEnrolled,
  enrollment,
  onEnroll,
  onResume,
  loading,
}) => {
  const progress = enrollment?.progress ?? 0;

  return (
    <div className="course-card">
      <div className="image-wrapper">
        <img src={course.image} alt={course.title} loading="lazy" />
        <button className="card-menu">
          <GrMore />
        </button>
      </div>

      <div className="card-content">
        <h3>{course.title}</h3>
        <p className="category">{course.category}</p>

        <div className="meta">
          <div>
            <MdOutlineMenuBook />
            <span>{course.classes} Classes</span>
          </div>
          <div>
            <LuClock3 />
            <span>{course.duration}</span>
          </div>
          <div>
            <IoHeart />
            <span>{course.rating} ratings</span>
          </div>
        </div>

        {isEnrolled && (
          <div className="progress-bar" style={{ margin: "8px 0" }}>
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
                height: "4px",
                background: "#4f46e5",
              }}
            />
            <small>{progress}% complete</small>
          </div>
        )}

        {isEnrolled ? (
          <button className="enroll-btn" onClick={() => onResume(course.id)}>
            {progress === 0 ? "Start" : "Resume"}
            <FaArrowRightLong />
          </button>
        ) : (
          <button
            className="enroll-btn"
            disabled={loading}
            onClick={() => onEnroll(course.id)}
          >
            {loading ? "Enrolling..." : "Enroll Now"}
            <FaArrowRightLong />
          </button>
        )}
      </div>
    </div>
  );
};

export default Explore;
