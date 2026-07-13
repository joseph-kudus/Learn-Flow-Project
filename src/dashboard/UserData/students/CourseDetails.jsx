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
import { courseImages } from "../../../assets/courses/courseImages";

const CourseDetails = () => {
  const [openLesson, setOpenLesson] = useState(null);
  const [courseTab, setCourseTab] = useState("coursedetail");

  const lessons = [
    "Introduction",
    "C++ Foundation",
    "C++ 101",
    "C++ 102",
    "C++ 103",
    "C++ 104",
    "C++ 105",
    "C++ 106",
    "C++ 107",
    "C++ 108",
    "C++ 109",
  ];

  return (
    <div className="main_course">
      {/* LEFT CONTENT */}

      <div className="course_resume">
        <div className="course_nxt">
          <span>Course</span>
          <BiRightArrow />
          <span>Coding</span>
          <BiRightArrow />
          <span>Intro to C++</span>
        </div>

        <img src={courseImages.CourseVideo} alt="Intro to C++ course video" />

        <div className="course_info">
          <div className="lessonby">
            <h1>Intro to C++</h1>
            <div className="course_author">By Jim Kandrey</div>
          </div>

          <div className="classes_tap">
            <button>50 Classes</button>

            <button>12 Months</button>

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

            <p>
              Feugiat elit turpis laoreet massa facilisis tellus non ut egestas.
              Tincidunt nam pellentesque magna eget faucibus erat platea nunc
              turpis. Enim consequat egestas faucibus habitant posuere. Diam
              dapibus bibendum ut dui feugiat neque in. Elit venenatis tortor
              viverra egestas quis fames ipsum semper neque.
            </p>
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
          {lessons.map((lesson, index) => (
            <div className="lesson_card" key={lesson}>
              <div
                className="lesson_header"
                onClick={() =>
                  setOpenLesson(openLesson === index ? null : index)
                }
                role="button"
                aria-expanded={openLesson === index}
              >
                <span>
                  Class {index + 1}: {lesson}
                </span>

                {openLesson === index ? (
                  <MdKeyboardArrowUp />
                ) : (
                  <MdKeyboardArrowDown />
                )}
              </div>

              {openLesson === index && (
                <div className="lesson_content">
                  <p>
                    <AiOutlinePlayCircle />
                    Video Lesson
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
