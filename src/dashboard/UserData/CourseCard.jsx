// CourseCard.jsx
import React from "react";

const CourseCard = ({ item, isEnrolled }) => {
  const isCategoryTag = [
    "MANAGEMENT",
    "BLOCHCHAIN",
    "ARTICIAL INTELLIGENCE",
    "Coding",
    "Language",
  ].includes(item.course);
  const displayTitle = isCategoryTag ? item.desc : item.course;

  return (
    <div className="single_course_card">
      <h2>{displayTitle}</h2>
      <p>{item.desc}</p>

      {/* Dynamic button changes based on enrollment status */}
      {isEnrolled ? (
        <button className="btn-resume">Resume Learning</button>
      ) : (
        <button className="btn-enroll">Enroll Now</button>
      )}
    </div>
  );
};

export default CourseCard;
