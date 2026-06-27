import React from "react";

const CourseCard = ({ item, isEnrolled, onEnroll, loading }) => {
  if (!item) return null;

  return (
    <div className="single_course_card">
      <img
        src={item.image} 
        alt={item.title}
        onError={(e) => (e.target.src = "/placeholder.jpg")} 
      />
      <p>{item.category}</p>
      <h3>{item.title}</h3> 
      <div className="course-card-actions">
        {isEnrolled ? (
          <button className="btn-resume">Resume</button>
        ) : (
          <button
            className="btn-enroll"
            disabled={loading}
            onClick={() => onEnroll(item.id)}
          >
            {loading ? "Enrolling..." : "Enroll Now"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
