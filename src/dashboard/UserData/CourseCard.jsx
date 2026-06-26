import React from "react";

const CourseCard = ({ item, isEnrolled, onEnroll, loading }) => {
  if (!item) return null;

  return (
    <div className="course-card">
      <img
        src={item.image} // <-- this was missing
        alt={item.title}
        onError={(e) => (e.target.src = "/placeholder.jpg")} // fallback if path is wrong
      />
      <h3>{item.title}</h3> {/* h3 matches your CSS, not h2 */}
      <p>{item.category}</p>
      <div className="course-card-actions">
        {isEnrolled ? (
          <button className="btn-resume">Resume Learning</button>
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
