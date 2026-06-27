import React, { useState } from "react";
import {
  allEnrollments,
  enrollStudent,
  getUserEnrollments,
  getEnrollmentDetails,
} from "./allEnrollments";
import { useAuth } from "../../context/AuthContext";
import CourseCard from "./CourseCard";
import "../../dashboard/Layout/learnerdashboard.css";

const StudentEnrollment = ({
  filter = "all",
  title = "All Courses",
  limit = null,
  category = null,
  search = "",
  myCourseIds = [],
  setMyCourseIds,
}) => {
  const { currentUser, userData } = useAuth();

  const [enrollingId, setEnrollingId] = useState(null);
  const [enrollmentData, setEnrollmentData] = useState([]);

  const handleEnroll = async (courseId) => {
    if (!currentUser || !userData) {
      alert("Please login first.");
      return;
    }

    try {
      setEnrollingId(courseId);

      const result = await enrollStudent(
        currentUser.uid,
        userData.email,
        courseId,
      );

      alert(result.message);

      if (result.success) {
        // Refresh enrolled course IDs
        const ids = await getUserEnrollments(currentUser.uid);
        setMyCourseIds(ids);

        // Refresh enrollment details
        const details = await getEnrollmentDetails(currentUser.uid);
        setEnrollmentData(details);
      }
    } catch (error) {
      console.error("Enrollment Error:", error);
      alert("Enrollment failed.");
    } finally {
      setEnrollingId(null);
    }
  };

  let coursesToShow = [...allEnrollments];

  /* ===========================
     Category Filter
  =========================== */

  if (category) {
    coursesToShow = coursesToShow.filter(
      (course) => course.category.toLowerCase() === category.toLowerCase(),
    );
  }

  /* ===========================
     Search Filter
  =========================== */

  if (search.trim()) {
    const term = search.toLowerCase();

    coursesToShow = coursesToShow.filter(
      (course) =>
        course.title.toLowerCase().includes(term) ||
        course.category.toLowerCase().includes(term),
    );
  }

  /* ===========================
     Enrolled / Recommended
  =========================== */

  if (filter === "enrolled") {
    coursesToShow = coursesToShow.filter((course) =>
      myCourseIds.includes(course.id),
    );
  } else if (filter === "recommended") {
    coursesToShow = coursesToShow.filter(
      (course) => !myCourseIds.includes(course.id),
    );
  }

  /* ===========================
     Limit
  =========================== */

  if (limit) {
    coursesToShow = coursesToShow.slice(0, limit);
  }

  return (
    <div className="myco">
      <h1>
        {title} ({coursesToShow.length})
      </h1>

      <div className="grid_course_card">
        {coursesToShow.length > 0 ? (
          coursesToShow.map((course) => {
            const enrollment = enrollmentData.find(
              (e) => Number(e.courseId) === Number(course.id),
            );

            return (
              <CourseCard
                key={course.id}
                item={course}
                enrollment={enrollment}
                isEnrolled={myCourseIds.includes(course.id)}
                onEnroll={handleEnroll}
                loading={enrollingId === course.id}
              />
            );
          })
        ) : (
          <div className="no-courses">
            <p>No courses found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEnrollment;
