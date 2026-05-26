import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../dashboard/courses/course.css";
import { FaArrowLeft } from "react-icons/fa";
import { coursesData } from "./CourseData";

function Courses() {
  const { id } = useParams();
  const navigate = useNavigate();

  const course = coursesData.find((c) => c.id === parseInt(id));

  if (!course) {
    return <h2>Course not found</h2>;
  }

  const handleBuy = () => {
    console.log("Buying course:", course.title);
    // payment logic here
  };

  const handleNext = () => {
    const nextId = course.id + 1;
    if (nextId <= coursesData.length) {
      navigate(`/course/${nextId}`);
    }
  };

  return (
    <div className="allcourses-wrapper">
      <div className="back-to-course">
        <button onClick={() => navigate("/")}>
          <FaArrowLeft className="arrow" />
        </button>

        <span>
          <h1>Back to Courses</h1>
        </span>
      </div>

      <div className="models">
        <img src={course.img} alt="model-image" />
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
          <button
            className="next-btn"
            onClick={handleNext}
            disabled={course.id >= coursesData.length}
          >
            Next Course
          </button>
        </div>
      </div>
    </div>
  );
}

export default Courses;
