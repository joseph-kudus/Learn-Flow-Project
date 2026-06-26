import React, { useState } from "react";
import {
  allEnrollments,
  enrollStudent,
  getUserEnrollments,
} from "./allEnrollments";
import { useAuth } from "../../context/AuthContext";
import CourseCard from "./CourseCard";
import "../../dashboard/Layout/learnerdashboard.css"


const StudentEnrollment = ({
  filter = "all",
  title = "All Courses",
  limit = null,
  category = null,
  search = "",
  myCourseIds,
  setMyCourseIds,
}) => {
  const { currentUser, userData } = useAuth();

  const [enrollingId, setEnrollingId] = useState(null);

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
        const ids = await getUserEnrollments(currentUser.uid);
        setMyCourseIds(ids);
      }
    } catch (error) {
      console.error(error);
      alert("Enrollment failed.");
    } finally {
      setEnrollingId(null);
    }
  };

  let coursesToShow = [...allEnrollments];

  // Category filter
  if (category) {
    coursesToShow = coursesToShow.filter(
      (course) => course.category.toLowerCase() === category.toLowerCase(),
    );
  }

  // Search filter
  if (search.trim()) {
    const term = search.toLowerCase();

    coursesToShow = coursesToShow.filter(
      (course) =>
        course.title.toLowerCase().includes(term) ||
        course.category.toLowerCase().includes(term),
    );
  }

  // Enrolled / Recommended
  if (filter === "enrolled") {
    coursesToShow = coursesToShow.filter((course) =>
      myCourseIds.includes(course.id),
    );
  }

  if (filter === "recommended") {
    coursesToShow = coursesToShow.filter(
      (course) => !myCourseIds.includes(course.id),
    );
  }

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
          coursesToShow.map((course) => (
            <CourseCard
              key={course.id}
              item={course}
              isEnrolled={myCourseIds.includes(course.id)}
              onEnroll={handleEnroll}
              loading={enrollingId === course.id}
            />
          ))
        ) : (
          <p>No courses found.</p>
        )}
      </div>
    </div>
  );
};

export default StudentEnrollment;
