import React, { useEffect, useMemo, useState } from "react";
import { GrMore } from "react-icons/gr";
import { MdOutlineMenuBook } from "react-icons/md";
import { LuClock3 } from "react-icons/lu";
import { IoHeart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";

import "./explore.css";

import {
  allEnrollments,
  enrollStudent,
  getUserEnrollments,
  getEnrollmentDetails,
} from "../allEnrollments";

import { useAuth } from "../../../context/AuthContext";

const PROGRAMMING_CATEGORIES = [
  "CODING",
  "PROGRAMMING",
  "JAVASCRIPT",
  "REACT JS",
  "PYTHON",
  "SOFTWARE ENGINEERING",
];

const filterCourses = (courses, filter) => {
  switch (filter) {
    case "CODING":
      return courses.filter((c) => c.type === "CODING");

    case "PROGRAMMING":
      return courses.filter((c) => PROGRAMMING_CATEGORIES.includes(c.type));

    case "MORE":
      return courses.filter((c) => !PROGRAMMING_CATEGORIES.includes(c.type));

    default:
      return courses;
  }
};

const Explore = () => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const [myCourseIds, setMyCourseIds] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [enrollingId, setEnrollingId] = useState(null);

  const [trendingFilter, setTrendingFilter] = useState("ALL");
  const [recommendedFilter, setRecommendedFilter] = useState("ALL");

  const categories = ["ALL", "CODING", "PROGRAMMING", "MORE"];

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

  const courses = useMemo(
    () =>
      allEnrollments.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category.toUpperCase(),
        image: c.image || "/placeholder.jpg",

        // FIXED HERE
        classes: c.lessons?.length || c.totalLessons || 0,

        duration: `${c.durationWeeks} Weeks`,
        rating: Number(c.rating),
        type: c.category.toUpperCase(),
        price: 100,
      })),
    [],
  );

  const trendingCourses = useMemo(
    () => [...courses].sort((a, b) => b.rating - a.rating).slice(0, 4),
    [courses],
  );

  const recommendedCourses = useMemo(
    () => courses.filter((c) => !myCourseIds.includes(c.id)).slice(0, 4),
    [courses, myCourseIds],
  );

  const filteredTrending = useMemo(
    () => filterCourses(trendingCourses, trendingFilter),
    [trendingCourses, trendingFilter],
  );

  const filteredRecommended = useMemo(
    () => filterCourses(recommendedCourses, recommendedFilter),
    [recommendedCourses, recommendedFilter],
  );

  return (
    <div className="explore-page">
      <div className="categories_container">
        {/* TRENDING */}

        <div className="explore_courses">
          <div className="courses_header">
            <h1>Trending Courses</h1>

            <div className="categories_wrapper">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={trendingFilter === cat ? "active" : ""}
                  onClick={() => setTrendingFilter(cat)}
                >
                  {cat === "MORE" ? <IoIosMore /> : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="course-grid">
            {filteredTrending.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                myCourseIds={myCourseIds}
                enrollmentData={enrollmentData}
                onEnroll={handleEnroll}
                enrollingId={enrollingId}
                navigate={navigate}
              />
            ))}
          </div>
        </div>

        {/* RECOMMENDED */}

        <div className="explore_courses">
          <div className="courses_header">
            <h1>Recommended Courses</h1>

            <div className="categories_wrapper">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={recommendedFilter === cat ? "active" : ""}
                  onClick={() => setRecommendedFilter(cat)}
                >
                  {cat === "MORE" ? <IoIosMore /> : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="course-grid">
            {filteredRecommended.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                myCourseIds={myCourseIds}
                enrollmentData={enrollmentData}
                onEnroll={handleEnroll}
                enrollingId={enrollingId}
                navigate={navigate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= COURSE CARD =================

const CourseCard = ({
  course,
  myCourseIds,
  enrollmentData,
  onEnroll,
  enrollingId,
  navigate,
}) => {
  const enrollment = enrollmentData.find(
    (e) => Number(e.courseId) === course.id,
  );

  const progress = enrollment?.progress ?? 0;

  const isEnrolled = myCourseIds.includes(course.id);

  return (
    <div className="course-card">
      <div className="image-wrapper">
        <img src={course.image} alt={course.title} />

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
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />

            <small>{progress}% complete</small>
          </div>
        )}

        {isEnrolled ? (
          <button
            className="enroll-btn"
            onClick={() => navigate(`/learn/${course.id}`)}
          >
            {progress === 0 ? "Start" : "Resume"}

            <FaArrowRightLong />
          </button>
        ) : (
          <button
            className="enroll-btn"
            disabled={enrollingId === course.id}
            onClick={() => onEnroll(course.id)}
          >
            {enrollingId === course.id
              ? "Enrolling..."
              : `Enroll for $${course.price}`}

            <FaArrowRightLong />
          </button>
        )}
      </div>
    </div>
  );
};

export default Explore;
