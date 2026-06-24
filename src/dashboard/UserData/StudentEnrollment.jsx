import React, { useState } from "react";
import { allEnrollments, enrollStudent } from "./allEnrollments";
import { useAuth } from "../../context/AuthContext";
import CourseCard from "./CourseCard";

const StudentEnrollment = () => {
  const { userData, currentUser } = useAuth();
  const [enrollingId, setEnrollingId] = useState(null);

  console.log("currentUser:", currentUser);
  console.log("userData:", userData);

  const handleEnroll = async (courseId) => {
    try {
      console.log("Clicked course:", courseId);

      setEnrollingId(courseId);

      const result = await enrollStudent(
        currentUser.uid,
        userData.email,
        courseId,
      );

      console.log("Enrollment result:", result);
      alert(result.message);
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Enrollment failed");
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="courses_grid">
      {allEnrollments.map((course) => (
        <CourseCard
          key={course.id}
          item={course}
          isEnrolled={false}
          onEnroll={handleEnroll}
          loading={enrollingId === course.id}
        />
      ))}
    </div>
  );
};

export default StudentEnrollment;
