import React from "react";
import { Link } from "react-router-dom";
import { FaBook, FaUsers, FaDollarSign, FaPlus } from "react-icons/fa";
// Remove: import UseuserRole from "../UserData/UseuserRole"; // not needed

function WelcomeInstructor({ user }) {
  // <-- Remove role prop, it's in user
  const fullName =
    user?.nickname || // <-- Add this. Matches SettingsPage
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Instructor"; // <-- Changed from "student"

  const stats = {
    totalStudents: 124,
    publishedCourses: 5,
    totalEarnings: 1840,
    pendingReviews: 3,
  };

  const recentCourses = [
    { id: 1, title: "Intro to CSS", students: 42, status: "Published" },
    { id: 2, title: "Advanced JS", students: 18, status: "Draft" },
  ];

  return (
    <section className="content-section p-6">
      <div className="welcome-banner">
        <div className="welcome-banner1">
          <h1>Instructor {fullName}</h1>
          <p>Welcome back. Here's your overview</p>{" "}
          {/* Fixed: removed extra, */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <FaUsers /> <span>Total Students</span>
          </div>
          <p className="text-3xl font-bold mt-2">{stats.totalStudents}</p>
        </div>
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <FaBook /> <span>Courses</span>
          </div>
          <p className="text-3xl font-bold mt-2">{stats.publishedCourses}</p>
        </div>
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <FaDollarSign /> <span>Earnings</span>
          </div>
          <p className="text-3xl font-bold mt-2">${stats.totalEarnings}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-gray-500">Pending Reviews</p>
          <p className="text-3xl font-bold mt-2">{stats.pendingReviews}</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Courses</h2>
          <Link
            to="/dashboard/coursebuilder"
            className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Create Course
          </Link>
        </div>

        <div className="border rounded-lg">
          {recentCourses.map((course) => (
            <div
              key={course.id}
              className="flex justify-between items-center p-4 border-b last:border-0"
            >
              <div>
                <p className="font-medium">{course.title}</p>
                <p className="text-sm text-gray-500">
                  {course.students} students
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${course.status === "Published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
              >
                {course.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WelcomeInstructor;
