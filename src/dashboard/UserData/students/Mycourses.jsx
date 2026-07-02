import React from "react";
import { FaArrowLeftLong, FaArrowRight } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import "./explore.css"

const Mycourses = () => {
  return (
    <div className="myclass">
      <div className="Course-Content-Container">
        <div className="active-course">
          <h1>Active courses</h1>
          <div className="arrows">
            <FaArrowLeftLong />
            <FaArrowRight />
          </div>
        </div>
        <div className="active-course">
          <h1>Recently enrolled</h1>
          <div className="arrows">
            <FaArrowLeftLong />
            <FaArrowRight />
          </div>
        </div>
      </div>
      <div className="active-course-active">
        <h1>Recent Activities</h1>
        <div className="arrows">
          <IoIosMore />
        </div>
      </div>
    </div>
  );
};

export default Mycourses;
