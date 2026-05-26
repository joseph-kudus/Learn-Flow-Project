import React from "react";
import "../../dashboard/courses/course.css";
import {
  Image1,
  Image2,
  Image3,
  Image4,
  Image5,
} from "../../assets/images/Myimg";

const Courses = () => {
  const courses = [
    {
      img: Image2,
      title: "Introduction to CSS language",
      desc: "Learn the basics of CSS, and its usefulness in the programming world",
      author: "ATO",
      price: 29,
    },
    {
      img: Image3,
      title: "Introduction to python language",
      desc: "Learn the basics of python, and its usefulness in the programming world",
      auth: "ATO",
      price: 30,
    },
    {
      img: Image1,
      title: "Introduction to javascript language",
    },
    {
      img: Image4,
    },
  ];
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
          {courses.map((course, idx) => (
            <div className="card-wrap" key={idx}>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;
