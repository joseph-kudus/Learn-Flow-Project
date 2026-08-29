import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBook, FaUsers, FaDollarSign, FaPlus } from "react-icons/fa";

import {
  getInstructorCourses,
  publishCourse,
} from "../../services/course/courseService";

import { useAuth } from "../../context/AuthContext";

function WelcomeInstructor({ user }) {
  const { currentUser } = useAuth();

  const [courses, setCourses] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [publishingCourseId, setPublishingCourseId] = useState(null);

  const fullName =
    user?.nickname ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Instructor";

  /* ======================================================
     LOAD INSTRUCTOR COURSES
  ====================================================== */

  useEffect(() => {
    const loadCourses = async () => {
      if (!currentUser) {
        setLoadingCourses(false);
        return;
      }

      try {
        setLoadingCourses(true);

        const instructorCourses = await getInstructorCourses(currentUser.uid);

        setCourses(instructorCourses);

        // Only show latest 2 courses
        setRecentCourses(instructorCourses.slice(0, 2));
      } catch (error) {
        console.error("Failed loading instructor courses:", error);
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, [currentUser]);

  /* ======================================================
     STATISTICS
  ====================================================== */

  const totalStudents = courses.reduce(
    (total, course) => total + (Number(course.students) || 0),
    0,
  );

  const stats = {
    totalStudents,
    totalCourses: courses.length,
    totalEarnings: 1840,
    pendingReviews: 3,
  };

  /* ======================================================
     PUBLISH COURSE
  ====================================================== */

  const handlePublishCourse = async (courseId) => {
    if (!currentUser || !courseId) {
      return;
    }

    try {
      setPublishingCourseId(courseId);

      const result = await publishCourse(courseId, currentUser.uid);

      if (!result.success) {
        console.error(result.message);
        return;
      }

      // Update all courses
      setCourses((previous) =>
        previous.map((course) =>
          course.id === courseId
            ? {
                ...course,
                status: "published",
              }
            : course,
        ),
      );

      // Update recent courses
      setRecentCourses((previous) =>
        previous.map((course) =>
          course.id === courseId
            ? {
                ...course,
                status: "published",
              }
            : course,
        ),
      );
    } catch (error) {
      console.error("Failed to publish course:", error);
    } finally {
      setPublishingCourseId(null);
    }
  };

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <section className="content-section p-6">
      {/* ==================================================
          WELCOME
      ================================================== */}

      <div className="welcome-banner">
        <div className="welcome-banner1">
          <h1>Instructor {fullName}</h1>

          <p>Welcome back. Here's your overview</p>
        </div>
      </div>

      {/* ==================================================
          STATISTICS
      ================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <FaUsers />
            <span>Total Students</span>
          </div>

          <p className="text-3xl font-bold mt-2">{stats.totalStudents}</p>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <FaBook />
            <span>Courses</span>
          </div>

          <p className="text-3xl font-bold mt-2">{stats.totalCourses}</p>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <FaDollarSign />
            <span>Earnings</span>
          </div>

          <p className="text-3xl font-bold mt-2">${stats.totalEarnings}</p>
        </div>

        <div className="border rounded-lg p-4">
          <p className="text-gray-500">Pending Reviews</p>

          <p className="text-3xl font-bold mt-2">{stats.pendingReviews}</p>
        </div>
      </div>

      {/* ==================================================
          YOUR COURSES
      ================================================== */}

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Courses</h2>

          <Link
            to="/dashboard/coursebuilder"
            className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus />
            Create Course
          </Link>
        </div>

        <div className="border rounded-lg">
          {loadingCourses ? (
            <p className="p-4 text-gray-500">Loading courses...</p>
          ) : recentCourses.length === 0 ? (
            <p className="p-4 text-gray-500">No courses created yet.</p>
          ) : (
            recentCourses.map((course) => (
              <div
                key={course.id}
                className="flex justify-between items-center p-4 border-b"
              >
                {/* COURSE INFO */}

                <div>
                  <p className="font-medium">{course.title}</p>

                  <p className="text-sm text-gray-500">
                    {Number(course.students) || 0} students
                  </p>
                </div>

                {/* STATUS + PUBLISH */}

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      course.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {course.status || "draft"}
                  </span>

                  {(course.status || "draft") !== "published" && (
                    <button
                      type="button"
                      onClick={() => handlePublishCourse(course.id)}
                      disabled={publishingCourseId === course.id}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
                    >
                      {publishingCourseId === course.id
                        ? "Publishing..."
                        : "Publish"}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default WelcomeInstructor;
