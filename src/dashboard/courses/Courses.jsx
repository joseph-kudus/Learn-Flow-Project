import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../dashboard/courses/course.css";
import { FaArrowLeft } from "react-icons/fa";
import { coursesData } from "./CourseData";

function Courses() {
  const { id } = useParams();
  const navigate = useNavigate();

  const courseId = Number(id);
  const course = coursesData.find((c) => c.id === courseId);
  const currentIndex = coursesData.findIndex((c) => c.id === courseId);
  const nextCourse = coursesData[currentIndex + 1];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!course || isNaN(courseId)) {
    return <h2>Course not found</h2>;
  }

  const handleBuy = () => {
    console.log("Buying course:", course.title);
  };

  const handleNext = () => {
    if (nextCourse) {
      navigate(`/allcourses/course/${nextCourse.id}`);
    }
  };

  return (
    <div className="allcourses-wrapper">
      <div className="back-to-course">
        <button onClick={() => navigate("/allcourses")}>
          <FaArrowLeft className="arrow" />
        </button>
        <span>
          <h1>Back to Courses</h1>
        </span>
      </div>

      <div className="models">
        <img src={course.img} alt={course.title} />
      </div>

      <div className="course-conti">
        <div className="conti-r">
          <h3>{course.title}</h3>
          <p>{course.desc}</p>
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
              <span className="value">{course.level}</span>
            </div>
            <div className="info-row">
              <span className="label">Lesson: </span>
              <span className="value">{course.lessons}</span>
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
