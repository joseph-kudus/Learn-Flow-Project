import React from "react";
import { Link } from "react-router-dom"; // 1. import Link
import { GrAdd } from "react-icons/gr";
import "./course.css";

function CourseBuilder() {
  // 2. React components should be PascalCase
  return (
    <div className="course-section">
      <h1>Create new course</h1>
      <div className="course-wrapper">
        {/* 3. Link to the standalone route */}
        <Link to="/coursebuilder/create" className="add-course-btn">
          <button type="button">
            <GrAdd className="mes" />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CourseBuilder;
