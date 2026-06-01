import React from "react";
import { Link } from "react-router-dom";
import { unsplash, Image1 } from "../../assets/images/Myimg";
import "./WelcomeStudent.css"; // import the CSS

const WelcomeStudent = ({ user }) => {
  const enrolledCourses = [
    {
      id: 1,
      img: unsplash,
      title: "Introduction to CSS language",
      progress: 60,
      nextLesson: "Flexbox basics",
    },
    {
      id: 2,
      img: Image1,
      title: "Introduction to JavaScript language",
      progress: 25,
      nextLesson: "Variables and functions",
    },
  ];

  const stats = {
    coursesInProgress: enrolledCourses.length,
    completed: 1,
    certificates: 1,
  };

  return (
    <section className="content-section">
      <div className="welcome-banner">
        <h1>Welcome back, {user?.name || "Student"}</h1>
        <p>Let's continue your learning journey</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">In Progress</p>
          <p className="stat-number">{stats.coursesInProgress}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Completed</p>
          <p className="stat-number">{stats.completed}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Certificates</p>
          <p className="stat-number">{stats.certificates}</p>
        </div>
      </div>

      {/* Continue Learning */}
      <div className="learning-section">
        <h2>Continue Learning</h2>
        <div className="course-list">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="course-card">
              <img src={course.img} alt={course.title} />
              <div className="course-info">
                <h3>{course.title}</h3>
                <p className="next-lesson">Next: {course.nextLesson}</p>
                <div className="progress-wrapper">
                  <div className="progress-label">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <button className="resume-btn">Resume</button>
            </div>
          ))}
        </div>
      </div>

      <Link to="/dashboard/allcourses" className="browse-link">
        Browse More Courses
      </Link>
    </section>
  );
};

export default WelcomeStudent;
