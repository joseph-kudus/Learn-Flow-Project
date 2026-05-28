import React from "react";
import { Link } from "react-router-dom";
import { GrAdd } from "react-icons/gr";
import "./course.css";

function CourseBuilder() {
  return (
    <div className="course-section">
      <h1>Create new course</h1>
      <div className="course-wrapper">
        <Link to="/dashboard/coursebuilder/create" className="add-course-btn">
          <button type="button">
            <GrAdd className="mes" />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CourseBuilder;
