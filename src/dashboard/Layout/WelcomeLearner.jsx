import React from "react";
import "./learnerdashboard.css";
import { allEnrollments } from "../UserData/allEnrollments";
import CourseCard from "../UserData/CourseCard";

const WelcomeLearner = ({ user }) => {
  const displayusername =
    user?.nickname ||
    user?.displayname ||
    user?.email?.split("@")[0] ||
    "student";
  // Defaults to an empty array if they haven't enrolled in anything yet
  const studentEnrollments = user?.enrolledCourses || [];
  // FILTER 1: Get courses the student has actually enrolled in
  const myEnrolledCourses = allEnrollments.filter((course) =>
    studentEnrollments.includes(course.id),
  );
  // 3. FILTER 2: Get courses available for their role that they HAVEN'T joined yet
  const recommendedCourses = allEnrollments.filter(
    (course) => !studentEnrollments.includes(course.id),
  );
  const handleEnroll = (courseId) => {
    console.log("Enroll:", courseId);
  };
  

  return (
    <div className="course-container">
      <div className="course-wrapper">
        <div className="welcome-click">
          <div className="welcome-text">
            <h1>Welcome Back {displayusername}!</h1>
            <p>Let's boost your knowledge and learn new things today.</p>
            <button>join</button>
          </div>
        </div>{" "}
        {/* SECTION 1: ENROLLED COURSES */}
        <div className="myco">
          <h1>My Active Courses ({myEnrolledCourses.length})</h1>
          <div className="grid_course_card">
            {myEnrolledCourses.length > 0 ? (
              myEnrolledCourses.map((course) => (
                <CourseCard key={course.id} item={course} isEnrolled={true} onEnroll={handleEnroll}/>
              ))
            ) : (
              <p>
                You haven't enrolled in any courses yet. Check out the
                recommendations below!
              </p>
            )}
          </div>
        </div>
        {/* SECTION 2: RECOMMENDATIONS / DISCOVER PAGE */}
        <div className="myco">
          <h1>Recommended For You</h1>
          <div className="grid_course_card">
            {recommendedCourses.slice(0, 3).map((course) => (
              <CourseCard key={course.id} item={course} isEnrolled={false} />
            ))}
          </div>
        </div>
      </div>
      <div className="coursecompletion">
        <div className="overview">
          <h1>Course Completion overview</h1>
          recharts
          <ol>
            <li>completed course</li>
            <li>in progress</li>
            <li>Not started yet</li>
          </ol>
        </div>
        <div className="achievement">
          <h5>Celebrate Your Learning Journey with 5/10 badges earned.</h5>
          <div className="badges">
            <img src="/" alt="bage1" />
            <img src="/" alt="bage2" />
            <img src="/" alt="bage3" />
            <img src="/" alt="bage4" />
            <img src="/" alt="bage5" />
            <img src="/" alt="bage6" />
            <img src="/" alt="bage7" />
            <img src="/" alt="bage8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeLearner;
