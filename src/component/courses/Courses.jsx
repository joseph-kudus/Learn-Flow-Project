import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./course.css";
import { FaArrowLeft } from "react-icons/fa";

import { coursesData } from "./CourseData";
import { getCourses } from "../../services/course/courseService";

function Courses() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [nextCourse, setNextCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCourse = async () => {
      try {
        const staticIndex = coursesData.findIndex(
          (course) => String(course.id) === id,
        );

        if (staticIndex !== -1) {
          setCourse(coursesData[staticIndex]);

          setNextCourse(coursesData[staticIndex + 1] || null);

          return;
        }

        const firestoreCourses = await getCourses();

        const currentIndex = firestoreCourses.findIndex(
          (course) => course.id === id,
        );

        if (currentIndex === -1) {
          setCourse(null);
          return;
        }

        setCourse(firestoreCourses[currentIndex]);

        setNextCourse(firestoreCourses[currentIndex + 1] || null);
      } catch (error) {
        console.error("Error loading course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return <h2>Loading course...</h2>;
  }

  if (!course) {
    return <h2>Course not found</h2>;
  }

  const handleBuy = () => {
    console.log("Buying course:", course.title);
  };

  const handleNext = () => {
    if (nextCourse) {
      navigate(`/dashboard/allcourses/course/${nextCourse.id}`);
    }
  };

  return (
    <div className="allcourses-wrapper">
      <div className="back-to-course">
        <button onClick={() => navigate("/dashboard/allcourses")}>
          <FaArrowLeft className="arrow" />
        </button>

        <span>
          <h1>Back to Courses</h1>
        </span>
      </div>

      <div className="models">
        <img src={course.img || course.imageUrl} alt={course.title} />
      </div>

      <div className="course-conti">
        <div className="conti-r">
          <h3>{course.title}</h3>

          <p>{course.desc || course.description}</p>
        </div>

        <div className="course-card">
          <h2>Course details</h2>

          <div className="course-info">
            <div className="info-row">
              <span className="label">Author:</span>

              <span className="value">{course.author}</span>
            </div>

            <div className="info-row">
              <span className="label">Level:</span>

              <span className="value">{course.level || "Not added"}</span>
            </div>

            <div className="info-row">
              <span className="label">Lesson:</span>

              <span className="value">
                {course.lessons?.length || course.lessons || "Not added"}
              </span>
            </div>

            <button className="buy-btn" onClick={handleBuy}>
              Buy Now ${course.price}
            </button>
          </div>
        </div>

        <div className="course-nav">
          <button
            className="next-btn"
            onClick={handleNext}
            disabled={!nextCourse}
          >
            Next Course
          </button>
        </div>
      </div>
    </div>
  );
}

export default Courses;
