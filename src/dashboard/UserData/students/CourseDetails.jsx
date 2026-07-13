import React from "react";
import { IoHeart } from "react-icons/io5";
import { BiRightArrow } from "react-icons/bi";
import "./coursedetails.css";
import { courseImages } from "../../../assets/courses/courseImages";
import { PiBookBookmarkThin } from "react-icons/pi";
import { AiOutlinePlayCircle } from "react-icons/ai";
import { HiMiniInboxArrowDown } from "react-icons/hi2";
import { IoIosMore } from "react-icons/io";

const CourseDetails = () => {
  return (
    <div className="main_course">
      <div className="course_resume">
      <div className="course_nxt">
  <span>Course</span>
  <BiRightArrow />
  <span>Coding</span>
  <BiRightArrow />
  <span>Intro to C++</span>
</div>

        <img src={courseImages.CourseVideo} alt="course video" />

              <div className="course_info">
                  <div className="lessonby">
                  <h1>Intro to C++</h1>
                      <div className="y-author">By Jim Kandrey</div>
                      </div>
          <div className="classes_tap">
            <button>50 Classes</button>
            <button>12 Months</button>
            <button>
              <IoHeart size={30} color="#FFBF0F"/> 4.5 Ratings
            </button>
                  </div>
                 
              </div>
              <div className="courseserch">
                  <div className="course_nvg">
                      <button>Course details</button>
                      <button>Resources</button>
                      <button>Community</button>
                  </div>
                  <div className="course_icon">
                      <PiBookBookmarkThin />
                      <AiOutlinePlayCircle />
                      <HiMiniInboxArrowDown />
                      <IoIosMore/>
                      </div>
              </div>
              <h2>The Introduction</h2>
              <p>Feugiat elit turpis laoreet massa facilisis tellus non ut egestas. Tincidunt nam pellentesque magna eget faucibus erat platea nunc turpis. Enim consequat egestas faucibus habitant posuere. Diam dapibus bibendum ut dui feugiat neque in. Elit venenatis tortor viverra egestas quis fames ipsum semper neque. Lectus netus quis in eu sollicitudin tincidunt viverra. 

Montes netus id purus varius ut vitae diam. Viverra orci aliquam dictum risus. Odio aliquam quam urna ornare suscipit massa a libero egestas. Suspendisse placerat eget a consectetur luctus iaculis mattis facilisi. Scelerisque aliquet duis turpis quis nunc dui sem egestas. Mattis facilisis massa odio non malesuada tempor quis et a. Enim venenatis nisl netus integer in et morbi fermentum enim.

Mattis facilisis massa odio non malesuada tempor quis et a. Enim venenatis nisl netus integer in et morbi fermentum enim.</p>
      </div>

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
          <select>
            <option value="1">Class 1: Introduction</option>
            <option value="2">Class 2: Variables</option>
            <option value="3">Class 3: Data Types</option>
                  </select>
                  <select>
            
            <option value="1">Class 2: C++ Foundation</option>
            <option value="2">Class 3: Data Types</option>
                  </select>
                  
                  <select>
            <option value="1">Class 3: C++ 101</option>
            <option value="2">Class 3: Data Types</option>
                  </select>
                  <select>
            <option value="1">Class 4:  C++ 102</option>
            <option value="2">Class 3: Data Types</option>
                  </select>
                  <select>
            <option value="1">Class 5:  C++ 103</option>
            <option value="2">Class 3: Data Types</option>
                  </select>
                  <select>
            <option value="1">Class 6:  C++ 104</option>
            <option value="2">Class 3: Data Types</option>
                  </select>
                  <select>
            <option value="1">Class 7:  C++ 105</option>
            <option value="2">Class 3: Data Types</option>
                  </select>
                  <select>
            <option value="1">Class 8:  C++ 106</option>
            <option value="2">Class 3: Data Types</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;