import React from "react";
import { FaStar } from "react-icons/fa";

const CourseCard = ({ item, isEnrolled, onEnroll, loading }) => {
  if (!item) return null;

  return (
    <div className="single_course_card">
      <div className="single_course_wrapper">
        <img
          src={item.image}
          alt={item.title}
          onError={(e) => {
            e.target.src = "/placeholder.jpg";
          }}
        />

        <div className="btn-plus">
          <p>{item.category}</p>

          <div className="rating">
            <FaStar color="#f7ca4e" size={14} />
            <span>4.5</span>
          </div>
        </div>

        <h3>{item.title}</h3>

        {isEnrolled && (
          <div className="course-progress">
            <div className="progress-header">
              <span>Progress</span>
              <span>60%</span>
            </div>

            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "60%" }}></div>
            </div>

            <p className="last-accessed">Last accessed: October 12, 2024</p>
          </div>
        )}

        <div className="course-card-actions">
          {isEnrolled ? (
            <button className="btn-resume">Resume</button>
          ) : (
            <button
              className="btn-enroll"
              disabled={loading}
              onClick={() => onEnroll?.(item.id)}
            >
              {loading ? "Enrolling..." : "Enroll Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default CourseCard;
