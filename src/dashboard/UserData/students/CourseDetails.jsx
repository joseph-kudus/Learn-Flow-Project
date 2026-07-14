import React, { useState } from "react";
import { IoHeart } from "react-icons/io5";
import { BiRightArrow } from "react-icons/bi";
import { PiBookBookmarkThin } from "react-icons/pi";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { HiMiniInboxArrowDown, HiOutlineDocumentText } from "react-icons/hi2";
import { IoIosMore } from "react-icons/io";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { MdOutlineAssignment } from "react-icons/md";

import "./coursedetails.css";

import { useParams } from "react-router-dom";
import { allEnrollments } from "../allEnrollments";

const CourseDetails = () => {
  const [openLesson, setOpenLesson] = useState(null);
  const [courseTab, setCourseTab] = useState("coursedetail");
  const [selectedLesson, setSelectedLesson] = useState(0);

  const { id } = useParams();
  const course = allEnrollments.find((c) => c.id === Number(id));
  if (!course) {
    return <h2>course not found</h2>;
  }

  return (
    <div className="main_course">
      {/* LEFT CONTENT */}

      <div className="course_resume">
        <div className="course_nxt">
          <span>Course</span>
          <BiRightArrow />
          <span>{course.category}</span>
          <BiRightArrow />
          <span>{course.title}</span>
        </div>
        {/*<img src={courseImages.CourseVideo} alt="Intro to C++ course video" />*/}

        {Array.isArray(course.lessons) &&
        course.lessons?.[selectedLesson]?.video ? (
          <video
            key={course.lessons[selectedLesson].video}
            controls
            width="100%"
            poster={course.image}
          >
            <source
              src={course.lessons[selectedLesson].video}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        ) : course.video ? (
          <video
            key={course.lessons[selectedLesson].video}
            controls
            width="100%"
            poster={course.image}
          >
            <source src={course.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={course.image} alt={course.title} />
        )}

        <div className="course_info">
          <div className="lessonby">
            <h1>{course.title}</h1>
            <div className="course_author">By Jim Kandrey</div>
          </div>

          <div className="classes_tap">
            <button>{course.totalLessons} Classes</button>

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
                courseTab === "course_resources" ? "active-tab" : "tap-course"
              }
              onClick={() => setCourseTab("course_resources")}
            >
              Resources
            </button>

            <button
              className={
                courseTab === "course_community" ? "active-tab" : "tap-course"
              }
              onClick={() => setCourseTab("course_community")}
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
            <h2>The Introduction</h2>
            <p>{course.description}</p>
          </div>
        )}
      </div>

      {/* RIGHT SIDEBAR */}

      <div className="course_details">
        <h1>Course Details</h1>

        <div className="progress-btn">
          <div className="progress_btn">
            <h3>44%</h3>

            <h3>12/32 Lessons</h3>
          </div>

          <div className="progress_bar">
            <div className="progress_fill"></div>
          </div>
        </div>

        <div className="course_intro">
          {Array.isArray(course.lessons) &&
            course.lessons.map((lesson, index) => (
              <div className="lesson_card" key={lesson.id || index}>
                <div
                  className="lesson_header"
                  onClick={() => {
                    setOpenLesson(openLesson === index ? null : index);
                    setSelectedLesson(index);
                  }}
                >
                  <span>
                    Class {index + 1}: {lesson.title}
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
                      onClick={() => setSelectedLesson(index)}
                      style={{ cursor: "pointer" }}
                    >
                      <AiOutlinePlayCircle />
                      Play {lesson.title}
                    </p>

                    <p>
                      <HiOutlineDocumentText />
                      Notes
                    </p>

                    <p>
                      <MdOutlineAssignment />
                      Assignment
                    </p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
