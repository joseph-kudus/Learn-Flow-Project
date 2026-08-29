import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAvailableCourses,
  enrollStudent,
  getUserEnrollments,
  getEnrollmentDetails,
} from "../../services/allEnrollments";
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
  const [availableCourses, setAvailableCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [loading, setLoading] = useState(!enrollmentDataProp);

  const enrollmentData = enrollmentDataProp ?? enrollmentDataInternal;
  const setEnrollmentData = setEnrollmentDataProp ?? setEnrollmentDataInternal;

  /* ======================================================
     LOAD AVAILABLE COURSES

     Includes:
     - Static courses
     - Published Firestore courses
  ====================================================== */

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setCoursesLoading(true);

        const courses = await getAvailableCourses();

        setAvailableCourses(courses);
      } catch (error) {
        console.error("Failed to load available courses:", error);
      } finally {
        setCoursesLoading(false);
      }
    };

    loadCourses();
  }, []);

  /* ======================================================
     LOAD USER ENROLLMENTS
  ====================================================== */

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

  /* ======================================================
     ENROLL
  ====================================================== */

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
        /*
         * If parent provides refresh, let parent remain
         * the single source of truth.
         */
        if (onRefresh) {
          await onRefresh();
        } else {
          /*
           * Otherwise refresh enrollment data locally.
           */
          const [ids, details] = await Promise.all([
            getUserEnrollments(currentUser.uid),
            getEnrollmentDetails(currentUser.uid),
          ]);

          setMyCourseIds?.(ids);
          setEnrollmentData(details);
        }

        navigate(`/learn/${courseId}`);
      }
    } catch (error) {
      console.error("Enrollment Error:", error);
      alert("Enrollment failed.");
    } finally {
      setEnrollingId(null);
    }
  };

  /* ======================================================
     RESUME
  ====================================================== */

  const handleResume = (courseId) => {
    navigate(`/learn/${courseId}`);
  };

  /* ======================================================
     NORMALIZE COURSE IDS

     Firestore IDs can be strings while static courses
     use numbers.
  ====================================================== */

  const courses = useMemo(() => {
    return availableCourses.map((course) => ({
      ...course,

      id: String(course.id),

      category: String(course.category || "Other"),

      rating: Number(course.rating) || 4.6,

      image: course.image || course.imageUrl || "/placeholder.jpg",

      lessons: Array.isArray(course.lessons) ? course.lessons : [],

      totalLessons: course.lessons?.length || course.totalLessons || 0,

      durationWeeks: course.durationWeeks || null,

      price: Number(course.price) || 0,
    }));
  }, [availableCourses]);

  /* ======================================================
     COURSES TO SHOW

     Now uses BOTH static and published Firestore courses.
  ====================================================== */

  const coursesToShow = useMemo(() => {
    let list = [...courses];

    /* ======================================================
       CATEGORY
    ====================================================== */

    if (category) {
      list = list.filter(
        (c) =>
          String(c.category).toLowerCase() === String(category).toLowerCase(),
      );
    }

    /* ======================================================
       SEARCH
    ====================================================== */

    if (search.trim()) {
      const term = search.toLowerCase();

      list = list.filter(
        (c) =>
          String(c.title || "")
            .toLowerCase()
            .includes(term) ||
          String(c.category || "")
            .toLowerCase()
            .includes(term),
      );
    }

    /* ======================================================
       ENROLLED
    ====================================================== */

    if (filter === "enrolled") {
      list = list.filter((c) =>
        myCourseIds.some((id) => String(id) === String(c.id)),
      );
    }

    /* ======================================================
       RECOMMENDED
       
       Put Firestore courses first so newly published
       instructor courses can appear in recommendations.
    ====================================================== */

    if (filter === "recommended") {
      list = list
        .filter((c) => !myCourseIds.some((id) => String(id) === String(c.id)))
        .sort((a, b) => {
          const aFirestore = !Number.isFinite(Number(a.id));
          const bFirestore = !Number.isFinite(Number(b.id));

          if (aFirestore && !bFirestore) return -1;
          if (!aFirestore && bFirestore) return 1;

          return 0;
        });
    }

    /* ======================================================
       LIMIT
    ====================================================== */

    if (limit) {
      list = list.slice(0, limit);
    }

    return list;
  }, [courses, category, search, filter, myCourseIds, limit]);

  /* ======================================================
     ENROLLMENT MAP
  ====================================================== */

  const enrollmentMap = useMemo(() => {
    const map = new Map();

    enrollmentData.forEach((e) => {
      map.set(String(e.courseId), e);
    });

    return map;
  }, [enrollmentData]);

  /* ======================================================
     LOADING
  ====================================================== */

  if (loading || coursesLoading) {
    return (
      <div className="myco">
        <h1>{title}</h1>
        <p>Loading courses...</p>
      </div>
    );
  }

  /* ======================================================
     UI
  ====================================================== */

  return (
    <div className="myco">
      <h1>
        {title} ({coursesToShow.length})
      </h1>

      <div className="grid_course_card">
        {coursesToShow.length > 0 ? (
          coursesToShow.map((course) => {
            const enrollment = enrollmentMap.get(String(course.id));

            const isEnrolled = myCourseIds.some(
              (id) => String(id) === String(course.id),
            );

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
