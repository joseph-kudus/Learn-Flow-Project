import { useEffect, useMemo, useState } from "react";
import { GrMore } from "react-icons/gr";
import { MdOutlineMenuBook } from "react-icons/md";
import { LuClock3 } from "react-icons/lu";
import { IoHeart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";

import "../../styles/explore.css";
import CoursePayment from "../payment/CoursePayment";

import {
  enrollStudent,
  getAvailableCourses,
  getUserEnrollments,
  getEnrollmentDetails,
} from "../../services/allEnrollments";

import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button/Button";

const PROGRAMMING_CATEGORIES = [
  "CODING",
  "PROGRAMMING",
  "JAVASCRIPT",
  "REACT JS",
  "PYTHON",
  "SOFTWARE ENGINEERING",
];

const filterCourses = (courses, filter) => {
  switch (filter) {
    case "CODING":
      return courses.filter((course) => course.type === "CODING");

    case "PROGRAMMING":
      return courses.filter((course) =>
        PROGRAMMING_CATEGORIES.includes(course.type),
      );

    case "MORE":
      return courses.filter(
        (course) => !PROGRAMMING_CATEGORIES.includes(course.type),
      );

    default:
      return courses;
  }
};

const Explore = () => {
  const { currentUser, userData } = useAuth();

  const navigate = useNavigate();

  const [availableCourses, setAvailableCourses] = useState([]);
  const [myCourseIds, setMyCourseIds] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);

  const [enrollingId, setEnrollingId] = useState(null);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [trendingFilter, setTrendingFilter] = useState("ALL");
  const [recommendedFilter, setRecommendedFilter] = useState("ALL");

  const categories = ["ALL", "CODING", "PROGRAMMING", "MORE"];

  const [paymentCourse, setPaymentCourse] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  /* ======================================================
     LOAD AVAILABLE COURSES

     Static courses + published Firestore courses
  ====================================================== */

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setCoursesLoading(true);

        const courses = await getAvailableCourses();

        setAvailableCourses(courses);
      } catch (error) {
        console.error("Failed loading courses:", error);
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
    if (!currentUser?.uid) return;

    const load = async () => {
      try {
        const [ids, details] = await Promise.all([
          getUserEnrollments(currentUser.uid),
          getEnrollmentDetails(currentUser.uid),
        ]);

        setMyCourseIds(ids);
        setEnrollmentData(details);
      } catch (error) {
        console.error("Failed loading enrollments:", error);
      }
    };

    load();
  }, [currentUser]);

  /* ======================================================
     ENROLL
  ====================================================== */

  const handleEnroll = async (courseId) => {
    if (!currentUser || !userData) {
      alert("Please login first.");
      return;
    }

    const course = courses.find((item) => String(item.id) === String(courseId));

    if (!course) {
      console.error("Course not found:", courseId);
      alert("Course not found.");
      return;
    }

    const coursePrice = Number(course.price) || 0;

    // Free course → enroll immediately
    if (coursePrice <= 0) {
      setEnrollingId(courseId);

      try {
        const result = await enrollStudent(
          currentUser.uid,
          userData.email,
          course.id,
        );

        alert(result.message);

        if (result.success) {
          const [ids, details] = await Promise.all([
            getUserEnrollments(currentUser.uid),
            getEnrollmentDetails(currentUser.uid),
          ]);

          setMyCourseIds(ids);
          setEnrollmentData(details);

          navigate(`/learn/${course.id}`);
        }
      } catch (error) {
        console.error("Enrollment failed:", error);
        alert("Enrollment failed.");
      } finally {
        setEnrollingId(null);
      }

      return;
    }

    // Paid course → open payment
    console.log("PAID COURSE SELECTED:", {
      courseId: course.id,
      courseTitle: course.title,
      price: coursePrice,
    });

    setPaymentCourse(course);
  };

  const handlePaymentSuccess = async (verification) => {
    if (!paymentCourse) {
      console.error("Payment succeeded but no course was selected.");
      return;
    }

    if (!verification?.verified) {
      console.error("Payment was not verified:", verification);
      alert("Payment could not be verified. Enrollment was not completed.");
      return;
    }

    try {
      setPaymentLoading(true);

      console.log("PAYMENT VERIFIED - COMPLETING ENROLLMENT:", {
        courseId: paymentCourse.id,
        courseTitle: paymentCourse.title,
        verification,
      });

      setEnrollingId(paymentCourse.id);

      const result = await enrollStudent(
        currentUser.uid,
        userData.email,
        paymentCourse.id,
      );

      alert(result.message);

      if (result.success) {
        const [ids, details] = await Promise.all([
          getUserEnrollments(currentUser.uid),
          getEnrollmentDetails(currentUser.uid),
        ]);

        setMyCourseIds(ids);
        setEnrollmentData(details);

        setPaymentCourse(null);

        navigate(`/learn/${paymentCourse.id}`);
      }
    } catch (error) {
      console.error("Post-payment enrollment failed:", error);

      alert(
        "Payment was successful, but enrollment could not be completed. Please contact support.",
      );
    } finally {
      setPaymentLoading(false);
      setEnrollingId(null);
    }
  };

  const handleCancelPayment = () => {
    if (paymentLoading) return;

    setPaymentCourse(null);
  };
  /* ======================================================
     NORMALIZE COURSES

     Makes static + Firestore courses use the
     same structure for the UI
  ====================================================== */

  const courses = useMemo(
    () =>
      availableCourses.map((course) => ({
        id: String(course.id),

        title: course.title,

        category: String(course.category || "OTHER").toUpperCase(),

        type: String(course.category || "OTHER").toUpperCase(),

        image: course.image || course.imageUrl || "/placeholder.jpg",

        classes: course.lessons?.length || course.totalLessons || 0,

        duration: course.durationWeeks
          ? `${course.durationWeeks} Weeks`
          : course.duration
            ? course.duration
            : "Self-paced",

        rating: Number(course.rating) || 4.6,

        price: Number(course.price) || 0,

        author: course.author || "",

        description: course.description || course.desc || "",

        status: course.status || "published",
        isFirestoreCourse: Boolean(course.status),
      })),
    [availableCourses],
  );

  /* ======================================================
     TRENDING
  ====================================================== */

  const trendingCourses = useMemo(() => {
    const sortedCourses = [...courses].sort((a, b) => b.rating - a.rating);

    const publishedCourses = sortedCourses.filter(
      (course) => course.isFirestoreCourse && course.status === "published",
    );

    const staticCourses = sortedCourses.filter(
      (course) => !course.isFirestoreCourse,
    );

    return [...publishedCourses, ...staticCourses].slice(0, 4);
  }, [courses]);

  /* ======================================================
     RECOMMENDED
  ====================================================== */

  const recommendedCourses = useMemo(() => {
    const notEnrolled = courses.filter(
      (course) => !myCourseIds.includes(String(course.id)),
    );

    const publishedCourses = notEnrolled.filter(
      (course) => course.isFirestoreCourse && course.status === "published",
    );

    const staticCourses = notEnrolled.filter(
      (course) => !course.isFirestoreCourse,
    );

    return [...publishedCourses, ...staticCourses].slice(0, 4);
  }, [courses, myCourseIds]);

  /* ======================================================
     FILTERS
  ====================================================== */

  const filteredTrending = useMemo(
    () => filterCourses(trendingCourses, trendingFilter),
    [trendingCourses, trendingFilter],
  );

  const filteredRecommended = useMemo(
    () => filterCourses(recommendedCourses, recommendedFilter),
    [recommendedCourses, recommendedFilter],
  );

  return (
    <div className="explore-page">
      {paymentCourse && (
        <div className="course-payment-section">
          <CoursePayment
            courseId={paymentCourse.id}
            courseTitle={paymentCourse.title}
            amount={Number(paymentCourse.price) || 0}
            currency="USD"
            onSuccess={handlePaymentSuccess}
          />

          {!paymentLoading && (
            <button
              type="button"
              onClick={handleCancelPayment}
              style={{
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              Cancel Payment
            </button>
          )}
        </div>
      )}
      <div className="categories_container">
        <CourseSection
          title="Trending Courses"
          categories={categories}
          filter={trendingFilter}
          setFilter={setTrendingFilter}
          courses={filteredTrending}
          myCourseIds={myCourseIds}
          enrollmentData={enrollmentData}
          onEnroll={handleEnroll}
          enrollingId={enrollingId}
          navigate={navigate}
          loading={coursesLoading}
        />

        <CourseSection
          title="Recommended Courses"
          categories={categories}
          filter={recommendedFilter}
          setFilter={setRecommendedFilter}
          courses={filteredRecommended}
          myCourseIds={myCourseIds}
          enrollmentData={enrollmentData}
          onEnroll={handleEnroll}
          enrollingId={enrollingId}
          navigate={navigate}
          loading={coursesLoading}
        />
      </div>
    </div>
  );
};

const CourseSection = ({
  title,
  categories,
  filter,
  setFilter,
  courses,
  myCourseIds,
  enrollmentData,
  onEnroll,
  enrollingId,
  navigate,
  loading,
}) => (
  <div className="explore_courses">
    <div className="courses_header">
      <h1>{title}</h1>

      <div className="categories_wrapper">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "primary" : "outline"}
            size="sm"
            rightIcon={cat === "MORE" ? <IoIosMore /> : undefined}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>
    </div>

    <div className="course-grid">
      {loading ? (
        <p>Loading courses...</p>
      ) : (
        courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            myCourseIds={myCourseIds}
            enrollmentData={enrollmentData}
            onEnroll={onEnroll}
            enrollingId={enrollingId}
            navigate={navigate}
          />
        ))
      )}
    </div>
  </div>
);

const CourseCard = ({
  course,
  myCourseIds,
  enrollmentData,
  onEnroll,
  enrollingId,
  navigate,
}) => {
  const enrollment = enrollmentData.find(
    (item) => String(item.courseId) === String(course.id),
  );

  const progress = enrollment?.progress ?? 0;

  const isEnrolled = myCourseIds.includes(String(course.id));

  return (
    <div className="course-card">
      <div className="image-wrapper">
        <img
          src={course.image}
          alt={course.title}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.jpg";
          }}
        />

        <Button
          variant="outline"
          className="card-menu"
          rightIcon={<GrMore />}
          aria-label="More course options"
        />
      </div>

      <div className="card-content">
        <h3>{course.title}</h3>

        <p className="category">{course.category}</p>

        <div className="meta">
          <div>
            <MdOutlineMenuBook />
            <span>{course.classes} Classes</span>
          </div>

          <div>
            <LuClock3 />
            <span>{course.duration}</span>
          </div>

          <div>
            <IoHeart />
            <span>{course.rating} ratings</span>
          </div>
        </div>

        {isEnrolled && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />

            <small>{progress}% complete</small>
          </div>
        )}

        {isEnrolled ? (
          <Button
            variant="secondary"
            className="enroll-btn"
            rightIcon={<FaArrowRightLong />}
            onClick={() => navigate(`/learn/${course.id}`)}
          >
            {progress === 0 ? "Start" : "Resume"}
          </Button>
        ) : (
          <Button
            variant="primary"
            className="enroll-btn"
            loading={enrollingId === course.id}
            rightIcon={<FaArrowRightLong />}
            onClick={() => onEnroll(course.id)}
          >
            Enroll for ${course.price}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Explore;
