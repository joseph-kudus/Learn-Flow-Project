import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  allEnrollments,
  getEnrollmentDetails,
  markLessonComplete,
} from "../../services/allEnrollments";
import { IoHeart } from "react-icons/io5";
import { BiRightArrow } from "react-icons/bi";
import { PiBookBookmarkThin } from "react-icons/pi";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { HiMiniInboxArrowDown, HiOutlineDocumentText } from "react-icons/hi2";
import { IoIosMore } from "react-icons/io";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdOutlineAssignment,
} from "react-icons/md";
import { useLocation, useParams } from "react-router-dom";
import "../../styles/coursedetails.css";

const CourseDetails = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const { id } = useParams();

  const [openLesson, setOpenLesson] = useState(null);
  const [courseTab, setCourseTab] = useState("coursedetail");
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [enrollment, setEnrollment] = useState(null);
  const course = allEnrollments.find((item) => item.id === Number(id));
  const [completed, setCompleted] = useState(false);

  if (!course) {
    return <h2>Course not found</h2>;
  }
  const lessons = Array.isArray(course.lessons) ? course.lessons : [];
  const currentLesson = lessons[selectedLesson] || null;

  const handleCompleteLesson = async () => {
    try {
      if (!enrollment) return;

      if ((enrollment.completedLessonIds || []).includes(selectedLesson)) {
        return;
      }

      const result = await markLessonComplete(
        enrollment.id,
        selectedLesson,
        enrollment.completedLessonIds || [],
        enrollment.totalLessons,
      );

      if (result.success) {
        setEnrollment((prev) => ({
          ...prev,
          completedLessons: result.completedLessons,
          completedLessonIds: [
            ...(prev.completedLessonIds || []),
            selectedLesson,
          ],
          progress: result.progress,
        }));

        setCompleted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!enrollment) return;

    setCompleted(
      (enrollment.completedLessonIds || []).includes(selectedLesson),
    );
  }, [selectedLesson, enrollment]);
  useEffect(() => {
    const loadEnrollment = async () => {
      try {
        if (!currentUser) return;

        const data = await getEnrollmentDetails(currentUser.uid);

        const found = data.find((item) => Number(item.courseId) === Number(id));

        setEnrollment(found || null);
      } catch (error) {
        console.error("Loading enrollment failed:", error);
      }
    };

    loadEnrollment();
  }, [currentUser, id]);

  // Resume saved lesson
  useEffect(() => {
    const lessonIndex = location.state?.lessonIndex;

    if (lessonIndex !== undefined && lessonIndex < lessons.length) {
      setSelectedLesson(lessonIndex);
      setOpenLesson(lessonIndex);
    }
  }, [location.state, lessons.length]);

  return (
    <div className="main_course">
      <div className="course_resume">
        <div className="course_nxt">
          <span>Course</span>
          <BiRightArrow />
          <span>{course.category}</span>
          <BiRightArrow />
          <span>{course.title}</span>
        </div>

        {/* VIDEO */}

        {currentLesson?.video ? (
          <video
            key={currentLesson.video}
            controls
            width="100%"
            poster={course.image}
          >
            <source src={currentLesson.video} type="video/mp4" />
            Your browser does not support video.
          </video>
        ) : course.video ? (
          <video key={course.video} controls width="100%" poster={course.image}>
            <source src={course.video} type="video/mp4" />
          </video>
        ) : (
          <img src={course.image} alt={course.title} />
        )}

        <div className="course_info">
          <div className="lessonby">
            <h1>
              {typeof currentLesson?.title === "string"
                ? currentLesson.title
                : course.title}
            </h1>

            <div className="course_author">By Jim Kandrey</div>
          </div>

          <div className="classes_tap">
            <button>{course.totalLessons || lessons.length} Classes</button>

            <button>{course.durationWeeks} Weeks</button>

            <button>
              <IoHeart size={25} color="#FFBF0F" />
              4.5 Ratings
            </button>
          </div>
        </div>

        <div className="course_search">
          <div className="course_nav">
            <button
              className={
                courseTab === "coursedetail" ? "active-tab" : "tap-course"
              }
              onClick={() => setCourseTab("coursedetail")}
            >
              Course details
            </button>

            <button
              className={
                courseTab === "resources" ? "active-tab" : "tap-course"
              }
              onClick={() => setCourseTab("resources")}
            >
              Resources
            </button>

            <button
              className={
                courseTab === "community" ? "active-tab" : "tap-course"
              }
              onClick={() => setCourseTab("community")}
            >
              Community
            </button>
          </div>

          <div className="course_icon">
            <PiBookBookmarkThin />
            <AiOutlinePlayCircle />
            <HiMiniInboxArrowDown />
            <IoIosMore />
          </div>
        </div>

        {courseTab === "coursedetail" && (
          <div className="courseNotes">
            <h2>
              {typeof currentLesson?.title === "string"
                ? currentLesson.title
                : "Select lesson"}
            </h2>

            <p>
              {typeof currentLesson?.notes === "string"
                ? currentLesson.notes
                : "No notes available for this lesson."}
            </p>

            <h3>Assignment</h3>

            <p>
              {typeof currentLesson?.assignment === "string"
                ? currentLesson.assignment
                : "No assignment available."}
            </p>
            <button
              className="complete-btn"
              onClick={handleCompleteLesson}
              disabled={!enrollment || completed}
            >
              {completed ? "Lesson Completed" : "Mark Lesson Complete"}
            </button>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR */}

      <div className="course_details">
        <h1>Course Details</h1>

        <div className="progress-btn">
          <div className="progress_btn">
            <h3>{enrollment?.progress || 0}%</h3>

            <h3>
              {enrollment?.completedLessons || 0}/
              {enrollment?.totalLessons || lessons.length} Lessons
            </h3>
          </div>

          <div className="progress_bar">
            <div
              className="progress_fill"
              style={{
                width: `${enrollment?.progress || 0}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="course_intro">
          {lessons.length > 0 ? (
            lessons.map((lesson, index) => (
              <div className="lesson_card" key={lesson.id || index}>
                <div
                  className="lesson_header"
                  onClick={() => {
                    setSelectedLesson(index);

                    setOpenLesson(openLesson === index ? null : index);
                  }}
                >
                  <span>
                    Class {index + 1}:{" "}
                    {typeof lesson.title === "string"
                      ? lesson.title
                      : "Untitled Lesson"}
                  </span>

                  {openLesson === index ? (
                    <MdKeyboardArrowUp />
                  ) : (
                    <MdKeyboardArrowDown />
                  )}
                </div>

                {openLesson === index && (
                  <div className="lesson_content">
                    <p
                      onClick={() => {
                        setSelectedLesson(index);
                      }}
                    >
                      <AiOutlinePlayCircle />
                      Play{" "}
                      {typeof lesson.title === "string"
                        ? lesson.title
                        : "Lesson"}
                    </p>

                    <p
                      onClick={() => {
                        setSelectedLesson(index);
                        setCourseTab("coursedetail");
                      }}
                    >
                      <HiOutlineDocumentText />
                      Notes
                    </p>

                    <p
                      onClick={() => {
                        setSelectedLesson(index);
                        setCourseTab("coursedetail");
                      }}
                    >
                      <MdOutlineAssignment />
                      Assignment
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No lessons available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
