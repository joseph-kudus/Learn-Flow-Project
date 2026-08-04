import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { coursesData } from "./CourseData";
import "./course.css";

import { getCourses } from "../../services/course/courseService";

const AllCourse = () => {
  const [firestoreCourses, setFirestoreCourses] = useState([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courses = await getCourses();

        setFirestoreCourses(courses);
      } catch (error) {
        console.error(error);
      }
    };

    loadCourses();
  }, []);

  const allCourses = [...coursesData, ...firestoreCourses];

  return (
    <div className="course-cont">
      <div className="conti-q">
        <h1>Courses</h1>

        <p>
          Unlock the world of web development effortlessly with our innovative
          e-learning courses. Elevate your skills, build a dynamic portfolio,
          and launch your web development career.
        </p>

        <div className="expert-cart">
          {allCourses.map((course) => (
            <Link
              to={`/dashboard/allcourses/course/${course.id}`}
              key={course.id}
              className="card-wrap"
            >
              <img
                src={course.img || course.imageUrl}
                alt={course.title}
                className="imgr"
              />

              <div className="expert1">
                <div className="expert11">
                  <h1>{course.title}</h1>

                  <p>{course.desc || course.description}</p>

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
