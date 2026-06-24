import React from "react";
const CourseCard = ({ item, isEnrolled, onEnroll, loading }) => {
  if (!item) return null;

  return (
    <div className="single_course_card">
      <h2>{item.title}</h2>
      <p>{item.category}</p>

      {isEnrolled ? (
        <button className="btn-resume">Resume Learning</button>
      ) : (
        <button
          className="btn-enroll"
          onClick={() => onEnroll?.(item.id)}
          disabled={loading}
        >
          {loading ? "Enrolling" : "Enroll Now"}
        </button>
      )}
    </div>
  );
};
