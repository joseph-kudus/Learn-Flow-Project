import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allEnrollments, enrollStudent } from "../../services/allEnrollments";
import { useAuth } from "../../context/AuthContext";
import CourseCard from "./CourseCard";
import "../../styles/learnerdashboard.css";

const StudentEnrollment = ({
  filter = "all",
  title = "All Courses",
  limit = null,
  category = null,
  search = "",
  myCourseIds = [],
  setMyCourseIds,
  enrollmentData: enrollmentDataProp = null,
  setEnrollmentData: setEnrollmentDataProp = null,
  onRefresh, 
}) => {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [enrollingId, setEnrollingId] = useState(null);
  const [enrollmentDataInternal, setEnrollmentDataInternal] = useState([]);
  const [loading, setLoading] = useState(!enrollmentDataProp);

  const enrollmentData = enrollmentDataProp ?? enrollmentDataInternal;
  const setEnrollmentData = setEnrollmentDataProp ?? setEnrollmentDataInternal;

  // 2. Only fetch if parent is NOT controlling
  useEffect(() => {
    if (enrollmentDataProp) {
      setLoading(false);
      return;
    }
    if (!currentUser) {
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const { getUserEnrollments, getEnrollmentDetails } =
          await import("../../services/allEnrollments");
        const [ids, details] = await Promise.all([
          getUserEnrollments(currentUser.uid),
          getEnrollmentDetails(currentUser.uid),
        ]);
        setMyCourseIds?.(ids);
        setEnrollmentData(details);
      } catch (err) {
        console.error("Failed to load enrollments:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentUser, enrollmentDataProp, setMyCourseIds, setEnrollmentData]);

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
        await onRefresh?.(); // 3. Single source of truth -> ask parent to refetch once
        navigate(`/learn/${courseId}`);
      }
    } catch (error) {
      console.error("Enrollment Error:", error);
      alert("Enrollment failed.");
    } finally {
      setEnrollingId(null);
    }
  };

  const handleResume = (courseId) => {
    navigate(`/learn/${courseId}`);
  };

  const coursesToShow = useMemo(() => {
    let list = [...allEnrollments];
    if (category)
      list = list.filter(
        (c) => c.category.toLowerCase() === category.toLowerCase(),
      );
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(term) ||
          c.category.toLowerCase().includes(term),
      );
    }
    if (filter === "enrolled")
      list = list.filter((c) => myCourseIds.includes(c.id));
    else if (filter === "recommended")
      list = list.filter((c) => !myCourseIds.includes(c.id));
    if (limit) list = list.slice(0, limit);
    return list;
  }, [category, search, filter, myCourseIds, limit]);

  const enrollmentMap = useMemo(() => {
    const map = new Map();
    enrollmentData.forEach((e) => map.set(Number(e.courseId), e));
    return map;
  }, [enrollmentData]);

  if (loading)
    return (
      <div className="myco">
        <h1>{title}</h1>
        <p>Loading courses...</p>
      </div>
    );

  return (
    <div className="myco">
      <h1>
        {title} ({coursesToShow.length})
      </h1>
      <div className="grid_course_card">
        {coursesToShow.length > 0 ? (
          coursesToShow.map((course) => {
            const enrollment = enrollmentMap.get(Number(course.id));
            const isEnrolled = myCourseIds.includes(course.id);
            return (
              <CourseCard
                key={course.id}
                item={course}
                enrollment={enrollment}
                isEnrolled={isEnrolled}
                onEnroll={handleEnroll}
                onResume={handleResume}
                loading={enrollingId === course.id}
              />
            );
          })
        ) : (
          <div className="no-courses">
            <p>
              {filter === "enrolled"
                ? "You haven’t enrolled in any courses yet."
                : "No courses found."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentEnrollment;
