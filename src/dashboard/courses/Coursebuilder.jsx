import React from "react";

import { GrAdd } from "react-icons/gr";
import "./course.css";

function coursebuilder() {
  return (
    <div className="course-section">
      <div className="course-wrapper">
        <h2>Create new course</h2>
        <button>
          <GrAdd className="mes" />
        </button>
      </div>
    </div>
  );
}
export default coursebuilder;
