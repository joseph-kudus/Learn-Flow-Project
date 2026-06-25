import React, { useState, useEffect } from "react";
import { allEnrollments, enrollStudent, getUserEnrollments } from "./allEnrollments";
import { useAuth } from "../../context/AuthContext";
import CourseCard from "./CourseCard";

const StudentEnrollment = ({
  filter = "all", // "all" | "enrolled" | "recommended"
  title = "All Courses",
  limit = null,
  category = null, // "Coding" | "MANAGEMENT" | null
  search = "" // "Python" | "robotics" | ""
}) => {
  const { userData, currentUser } = useAuth();
  const [enrollingId, setEnrollingId] = useState(null);
  const [myCourseIds, setMyCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }

    const fetchEnrollments = async () => {
      try {
        const courseIds = await getUserEnrollments(currentUser.uid);
        setMyCourseIds(courseIds);
      } catch (err) {
        console.error("Failed to fetch enrollments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [currentUser]);

  const handleEnroll = async (courseId) => {
    if (!currentUser ||!userData) {
      alert("Please log in to enroll");
      return;
    }

    try {
      setEnrollingId(courseId);
      const result = await enrollStudent(currentUser.uid, userData.email, courseId);
      alert(result.message);
      if (result.success) {
        setMyCourseIds(prev => [...prev, Number(courseId)]);
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Enrollment failed. Try again.");
    } finally {
      setEnrollingId(null);
    }
  };

  // 1. Start with all courses
  let coursesToShow = allEnrollments;

  // 2. Filter by category
  if (category) {
    coursesToShow = coursesToShow.filter(
      c => c.category.toLowerCase() === category.toLowerCase()
    );
  }

  // 3. Filter by search term - checks title and category
  if (search.trim()) {
    const searchLower = search.toLowerCase();
    coursesToShow = coursesToShow.filter(
      c =>
        c.title.toLowerCase().includes(searchLower) ||
        c.category.toLowerCase().includes(searchLower)
    );
  }

  // 4. Filter by enrolled/recommended
  if (filter === "enrolled") {
    coursesToShow = coursesToShow.filter(c => myCourseIds.includes(Number(c.id)));
  } else if (filter === "recommended") {
    coursesToShow = coursesToShow.filter(c =>!myCourseIds.includes(Number(c.id)));
  }

  // 5. Apply limit last
  if (limit) coursesToShow = coursesToShow.slice(0, limit);
  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="myco">
      <h1>{title} ({coursesToShow.length})</h1>
      <div className="grid_course_card">
        {coursesToShow.length > 0? (
          coursesToShow.map((course) => (
            <CourseCard
              key={course.id}
              item={course}
              isEnrolled={myCourseIds.includes(Number(course.id))}
              onEnroll={handleEnroll}
              loading={enrollingId === course.id}
            />
          ))
        ) : (
          <p>
            No {category || ""} courses found
            {search && ` for "${search}"`}.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentEnrollment;