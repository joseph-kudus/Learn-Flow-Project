import React from "react";
import { Link } from "react-router-dom";
import { Courseicon, Image1, Image2 } from "../../assets/images/Myimg";
import "./welcomeStudent.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { GrMore } from "react-icons/gr";

const WelcomeStudent = ({ user, role }) => {
  const firstnamedisplay =
    user?.nickname ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "student";

  const enrolledCourses = [
    {
      id: 1,
      title: "Intro to C++",
      category: "CODING",
      img: Courseicon,
      classesCompleted: 42,
      totalClasses: 50,
      duration: "1hr 45m",
      nextLesson: "Pointers & Memory",
    },
    {
      id: 2,
      title: "Intro to Programming",
      category: "LANGUAGE",
      img: Image1,
      classesCompleted: 12,
      totalClasses: 32,
      duration: "2hr 10m",
      nextLesson: "Variables and Functions",
    },
  ];

  const completedCourses = [
    {
      code: "JavaScript 101",
      title: "Introduction to Javascript",
      grade: "100/100",
      date: "October 13, 2024",
      status: "pass",
    },
    {
      code: "HTML 102",
      title: "HTML as a Programming Language",
      grade: "40/100",
      date: "October 13, 2024",
      status: "fail",
    },
  ];

  const getProgress = (course) => {
    if (course.progress !== undefined && course.progress !== null)
      return course.progress;
    return Math.round((course.classesCompleted / course.totalClasses) * 100);
  };

  return (
    <section className="content-section">
      <div className="welcome-banner">
        <div className="greet-banner">
          <h1>Hello {firstnamedisplay}</h1>
          <p>Let's learn something exciting today!</p>
        </div>

        <div className="programs-nav">
          <button className="active">All</button>
          <button>Coding</button>
          <button>Programming</button>
          <button>
            <GrMore />
          </button>
        </div>
      </div>

      {/* Active Courses Cards */}
      <div className="card-container">
        {enrolledCourses.map((course) => {
          const progress = getProgress(course);
          return (
            <div key={course.id} className="course-card-container">
              <div className="card-header">
                <img
                  src={course.img}
                  alt={course.title}
                  className="card-image"
                />
                <div className="bek">
                  <h3>{course.title}</h3>
                  <span className="card-category">{course.category}</span>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-bard">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}` }}
                  ></div>
                </div>
                <span className="progress-text">{progress}</span>
              </div>

              <div className="lessons">
                <p>
                  {course.classesCompleted}/{course.totalClasses} Classes
                </p>
                <p>{course.duration}</p>
              </div>

              <div className="card-footer">
                <button className="resume-btn">Resume classes</button>
                <button className="arrow-btn">
                  <FaArrowRightLong />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completed Courses Table */}
      <div className="course-main">
        <div className="table-header">
          <h3>Completed courses</h3>
          <button className="view-all">View All</button>
        </div>

        <table className="courses-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Grade Score</th>
              <th>Completion Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {completedCourses.map((course) => (
              <tr key={course.code}>
                <td>{course.code}</td>
                <td>{course.title}</td>
                <td>{course.grade}</td>
                <td>{course.date}</td>
                <td>
                  <span className={`status ${course.status}`}>
                    {course.status === "pass" ? "Pass" : "Fail"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default WelcomeStudent;
