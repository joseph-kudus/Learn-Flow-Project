import React from "react";
import { Link } from "react-router-dom";
import { GrAdd } from "react-icons/gr";
import "./course.css";
import UseuserRole from "../../hooks/UseuserRole";
import { IoAddCircle } from "react-icons/io5";

function CourseBuilder() {
  const { user } = UseuserRole();
  return (
    <div className="course-section">
      <h1>Create new course</h1>
      {user?.role === "instructor" && (
        <div className="course-wrapper">
          <Link to="/dashboard/coursebuilder/create" className="add-course-btn">
            +create course
            <button type="button">
              <IoAddCircle size={120}/>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
  console.log(user)
}

export default CourseBuilder;
