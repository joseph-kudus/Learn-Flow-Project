import React, { useEffect, useState } from "react";
import "./learnerdashboard.css";
import {
  allEnrollments,
  enrollStudent,
  getUserByEmail,
} from "../UserData/allEnrollments";
import CourseCard from "../UserData/CourseCard";

import { useAuth } from "../../context/AuthContext";

const WelcomeLearner = ({ user }) => {
  const { currentUser, userData } = useAuth();
  const [myCourseIds, setMyCourseIds] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const displayusername =
    user?.nickname ||
    user?.displayname ||
    user?.email?.split("@")[0] ||
    "learner";

  // fetch real enrollments from firebase on load

  (useEffect(() => {
    if (!currentUser?.uid) return;

    const fetchEnrollments = async () => {
      const courseIds = await getUserEnrollment(currentUser.uid);
      setMyCourseIds(courseIds);
    };
    fetchEnrollments();
  }),
    [currentUser]);
  // Filter base on real firebase data
  const myEnrolledCourses = allEnrollments.filter((course) =>
    myCourseIds.includes(Number(course.id)),
  );

  // Actualy enroll student
  const handleEnroll = async (courseId) => {
    if (!currentUser || !userData) {
      alert("Please log in first");
      return;
    }
    try {
      setLoadingId(courseId);
      const result = await enrollStudent(
        currentUser.uid,
        userData.email,
        courseId,
      );
      if (result.success) {
        alert(result.message);
        //update ui instantly
        setMyCourseIds((prev) => [...prev, Number(courseId)]);
      } else {
        alert(result.message); //show already enrolled or user not found
      }
    } catch (error) {
      console.error("Enrrollment error", error);
      alert("Enrollment failed. Try again.");
    } finally {
      setLoadingId(null);
    }
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
        </div>

        {/* SECTION 1: ENROLLED COURSES */}
        <div className="myco">
          <h1>My Active Courses ({myEnrolledCourses.length})</h1>
          <div className="grid_course_card">
            {myEnrolledCourses.length > 0 ? (
              myEnrolledCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  item={course}
                  isEnrolled={true}
                  onEnroll={handleEnroll}
                  loadingId={false}
                />
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
              <CourseCard
                key={course.id}
                item={course}
                isEnrolled={false}
                onEnroll={handleEnroll}
                loading={loadingId === course.id}
              />
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
