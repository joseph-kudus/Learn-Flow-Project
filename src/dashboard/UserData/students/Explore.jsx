import React, { useState } from "react";
import { GrMore } from "react-icons/gr";
import { MdOutlineMenuBook } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { LuClock3 } from "react-icons/lu";
import { IoHeart } from "react-icons/io5";


import "./explore.css";
import FilterButtons from "../FilterButtons";

const trendingCourses = [
  {
    id: 1,
    title: "People Management",
    category: "MANAGEMENT",
    image: "/placeholder.jpg",
    classes: 50,
    duration: "12 Months",
    rating: "4.5",
    type: "CODING",
  },
  {
    id: 2,
    title: "Advanced Rust",
    category: "BLOCKCHAIN",
    image: "/placeholder.jpg",
    classes: 50,
    duration: "12 Months",
    rating: "4.5",
    type: "PROGRAMMING",
  },
];

const recommendedCourses = [
  {
    id: 3,
    title: "Robotics & Machine Learning",
    category: "ARTIFICIAL INTELLIGENCE",
    image: "/placeholder.jpg",
    classes: 50,
    duration: "12 Months",
    rating: "4.5",
    type: "CODING",
  },
  {
    id: 4,
    title: "UI/UX Design Fundamentals",
    category: "DESIGN",
    image: "/placeholder.jpg",
    classes: 32,
    duration: "6 Months",
    rating: "4.8",
    type: "DESIGN",
  },
];

const Explore = () => {
  return (
    <div className="explore-page">
      <CourseSection title="Trending Courses" courses={trendingCourses} />

      <CourseSection title="Recommended Courses" courses={recommendedCourses} />
    </div>
  );
};

const CourseSection = ({ title, courses }) => {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredCourses =
    activeFilter === "ALL"
      ? courses
      : courses.filter((course) => course.type === activeFilter);

  return (
    <section className="course-section">
      <div className="section-header">
        <h2>{title}</h2>

        <FilterButtons
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>

      <div className="course-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <p className="no-courses">No courses found for this filter</p>
        )}
      </div>
    </section>
  );
};

const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <div className="image-wrapper">
        <img src={course.image} alt={course.title} />
        <button className="card-menu">
          <GrMore />
        </button>
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

        <button className="enroll-btn">
          Enroll for $100
          <FaArrowRightLong />
        </button>
      </div>
    </div>
  );
};

export default Explore;
