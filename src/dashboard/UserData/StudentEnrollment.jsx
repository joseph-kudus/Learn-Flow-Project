import React, { useState } from "react";
import { allEnrollments, enrollStudent } from "./allEnrollments";
import { useAuth } from "../../context/AuthContext";
import CourseCard from "./CourseCard";

const StudentEnrollment = () => {
  const { userData } = useAuth();

  const [enrollingId, setEnrollingId] = useState(null);

  const handleEnroll = async (courseId) => {
    if (!userData?.email) {
      alert("Please login first");
      return;
    }

    try {
      setEnrollingId(courseId);

      const result = await enrollStudent(userData.email, courseId);

      alert(result.message);
    } catch (error) {
      console.error(error);
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
        />
      ))}
    </div>
  );
};

export default StudentEnrollment;
