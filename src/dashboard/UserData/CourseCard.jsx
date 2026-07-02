import React from "react";
import { FaStar } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

const CourseCard = ({
  item,
  enrollment,
  isEnrolled,
  onEnroll,
  onResume,
  loading,
}) => {
  if (!item) return null;

  const progress = enrollment?.progress ?? 0;
  const rating = item.rating ?? 4.5;
  const lessonsDone = enrollment?.completedLessons ?? 0;
  const totalLessons = enrollment?.totalLessons ?? item.lessons ?? 0;

  const lastAccessedTs = enrollment?.lastAccessed?.toDate?.();
  const lastAccessedText = lastAccessedTs
    ? `Last accessed: ${formatDistanceToNow(lastAccessedTs, { addSuffix: true })}`
    : "Not started yet";

  return (
    <div className="single_course_card">
      <div className="single_course_wrapper">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          onError={(e) => {
            e.target.src = "/placeholder.jpg";
          }}
        />

        <div className="btn-plus">
          <p className="category">{item.category}</p>
          <div className="rating">
            <FaStar color="#f7ca4e" size={14} />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        <h3>{item.title}</h3>

        {isEnrolled && (
          <div className="course-progress">
            <div className="progress-header">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="lesson-count">
              {lessonsDone}/{totalLessons} lessons
            </p>
            <p className="last-accessed">{lastAccessedText}</p>
          </div>
        )}

        <div className="course-card-actions">
          {isEnrolled ? (
            <button className="btn-resume" onClick={() => onResume?.(item.id)}>
              {progress === 0 ? "Start" : "Resume"}
            </button>
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
