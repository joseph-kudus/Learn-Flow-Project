import { StarsIcon } from "lucide-react";
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
          onError={(e) => (e.target.src = "/placeholder.jpg")}
        />
        <div className="btn-plus">
          <p>{item.category}</p>
          <span>
            <FaStar fontSize={15} color="#f7ca4e" />
          </span>
          4.5
        </div>
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
    </div>
  );
};

export default CourseCard;
