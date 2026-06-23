import React, { useState } from "react";
import { allEnrollments, enrollStudent } from "./allEnrollments";
import { useAuth } from "../../context/AuthContext";

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
        <div key={course.id} className="course_card">
          {course.img && <img src={course.img} alt={course.title} />}

          <h3>{course.title}</h3>
          <p>{course.category}</p>

          <button
            onClick={() => handleEnroll(course.id)}
            disabled={enrollingId === course.id}
          >
            {enrollingId === course.id ? "Enrolling..." : "Enroll"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default StudentEnrollment;
