import React from "react";
import "../../dashboard/courses/course.css";

const Courses = () => {
  const course = {
    author: "ATO Productions",
    level: "Beginner",
    lessons: 14,
    price: "$29",
  };

  const handleBuy = () => {
    console.log("Buying course:", course.lessons);
  };

  return (
    <div className="course-conti">
      <div className="conti-q">
        <h3>Introduction to CSS language</h3>
        <p>
          Unlock the world of web development effortlessly with our innovative
          e-learning courses. Elevate your skills, build a dynamic portfolio,
          and launch your web development or no-code career with our
          industry-aligned certifications and dedicated job placement
          assistance.
        </p>
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
            <span className="label">Lessons: </span>
            <span className="value">{course.lessons}</span>
          </div>
          <button className="buy-btn" onClick={handleBuy}>
            Buy Now {course.price}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Courses;
