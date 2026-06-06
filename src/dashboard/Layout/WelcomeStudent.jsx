import React, { useMemo, useState } from "react";
import { Courseicon } from "../../assets/images/Myimg";
import { book2, termina } from "../../assets/images/logos";
import "./welcomeStudent.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { GrMore } from "react-icons/gr";
import { MdAccessTime } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import FilterButtons from "../UserData/FilterButtons";


const categories = [
  { label: "All", value: "ALL" },
  { label: "Coding", value: "CODING" },
  { label: "Programming", value: "PROGRAMMING" },
];

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
    category: "PROGRAMMING",
    img: termina,
    classesCompleted: 12,
    totalClasses: 32,
    duration: "2hr 10m",
    nextLesson: "Variables and Functions",
  },
];

const completedCourses = [
  {
    id: 1001,
    code: "JavaScript 101",
    title: "Introduction to Javascript",
    grade: "100/100",
    date: "October 13, 2024",
    status: "pass",
  },
  {
    id: 1002,
    code: "HTML 102",
    title: "HTML as a Programming Language",
    grade: "40/100",
    date: "October 21, 2024",
    status: "fail",
  },
  {
    id: 1003,
    code: "HTML 103",
    title: "HTML as a Programming Language",
    grade: "40/100",
    date: "October 21, 2024",
    status: "fail",
  },
  {
    id: 1004,
    code: "JavaScript 102",
    title: "Introduction to Javascript",
    grade: "100/100",
    date: "October 13, 2024",
    status: "pass",
  },
  {
    id: 1005,
    code: "HTML 104",
    title: "HTML as a Programming Language",
    grade: "40/100",
    date: "October 21, 2024",
    status: "fail",
  },
];

const WelcomeStudent = ({ user }) => {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const navigate = useNavigate();

  const firstnamedisplay =
    user?.nickname ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "student";

  const filteredCourses = useMemo(() => {
    return activeCategory === "ALL"
      ? enrolledCourses
      : enrolledCourses.filter((course) => course.category === activeCategory);
  }, [activeCategory]);

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

        <FilterButtons
          activeFilter={activeCategory}
          setActiveFilter={setActiveCategory}
          options={categories}
          showMore={false}
        />
      </div>

      {/* Active Courses Cards */}
      <div className="card-container">
        {filteredCourses.length === 0 ? (
          <p className="coursent">No courses found.</p>
        ) : (
          filteredCourses.map((course) => {
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
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{progress}%</span>
                </div>

                <div className="lessons">
                  <div className="lessons-logo">
                    <img src={book2} alt="ff" />
                    <p>
                      {course.classesCompleted}/{course.totalClasses} Classes
                    </p>
                  </div>
                  <div className="durationy">
                    <MdAccessTime size={20} />
                    <p>{course.duration}</p>
                  </div>
                </div>
                <hr />
                <div className="card-footer">
                  <button onClick={() => navigate(`/course/${course.id}`)}>
                    Resume Classes
                  </button>

                  <button
                    className="arrow-btn"
                    onClick={() =>
                      navigate(`/lesson/${course.id}`, {
                        state: { lesson: course.nextLesson },
                      })
                    }
                  >
                    <FaArrowRightLong />
                  </button>
                </div>
              </div>
            );
          })
        )}
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
              <tr key={course.id}>
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
