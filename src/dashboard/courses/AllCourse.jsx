import React from "react";
import { Link } from "react-router-dom";
import { coursesData } from "./CourseData";
import "../../dashboard/courses/course.css";

const AllCourse = () => {
  return (
    <div className="course-conti">
      <div className="conti-q">
        <h1>Courses</h1>
        <p>
          Unlock the world of web development effortlessly with our innovative
          e-learning courses. Elevate your skills, build a dynamic portfolio,
          and launch your web development or no-code career with our
          industry-aligned certifications and dedicated job placement
          assistance.
        </p>

        <div className="expert-cart">
          {coursesData.map((course) => (
            <Link
              to={`/dashboard/allcourses/course/${course.id}`}
              key={course.id}
              className="card-wrap"
            >
              <img src={course.img} alt={course.title} className="imgr" />
              <div className="expert1">
                <div className="expert11">
                  <h1>{course.title}</h1>
                  <p>{course.desc}</p>
                  <hr />
                  <div className="ato">
                    <p>By {course.author}</p>
                    <p>${course.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCourse;
