import React from "react";
import { FaArrowLeftLong, FaArrowRight } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import "./explore.css"

const Mycourses = () => {
  return (
    <div className="myclass">
      <div className="Course-Content-Container">
        
        <div className="active-course">
          <h3>Active Courses</h3>
          <div className="arrows">
           <button> <FaArrowLeftLong /></button>
           <button> <FaArrowRight /></button>
          </div>
          </div>
          <div className="active-cours">
          <div className="course-card">
            <div className="card_container">
              <img src="#" alt="Imge here" />
              <div className="intro">
                <p><strong>Intro to C++</strong></p>
                <p>CODING</p>
              </div>
            </div>
            <div className="progress-bar"></div>
            <div className="card_details">
              <p>12/32 Classes</p>
            <p>1hr 45 Minutes</p>
              <div className="resume-btn">
              <button onClick={() => ("card_details")}>Resume classes</button>
                <button> <FaArrowRight /></button>
                </div>
            </div>
          </div>
          <div className="course-card">
            <div className="card_container">
              <img src="#" alt="Imge here" />
              <div className="intro">
                <p><strong>Intro to JavaScripts</strong></p>
                <p>CODING</p>
              </div>
            </div>
            <div className="progress-bar"></div>
            <div className="card_details">
              <p>12/32 Classes</p>
            <p>1hr 45 Minutes</p>
             
              <div className="resume-btn">
              <button onClick={() => ("card_details")}>Resume classes</button>
                <button> <FaArrowRight /></button>
                </div>
            </div>
          </div>
        </div>
        <div className="active-course">
          <h3>Recently Enrolled</h3>
          <div className="arrows">
            <button><FaArrowLeftLong /></button>
            <button><FaArrowRight /></button>
          </div>
          
        </div>
        <div className="active-cours">
          <div className="course-card">
            <div className="card_container">
              <img src="#" alt="Imge here" />
              <div className="intro">
                <p><strong>Ethical Hacking</strong></p>
                <p>CODING</p>
              </div>
            </div>
            
            <div className="card_details">
              <p>12/32 Classes</p>
            <p>1hr 45 Minutes</p>
             <p>4.5 ratings</p>
              <div className="resume-btn">
              <button onClick={() => ("card_details")}>Resume classes</button>
                <button> <FaArrowRight /></button>
                </div>
            </div>
          </div>
          <div className="course-card">
            <div className="card_container">
              <img src="#" alt="Imge here" />
              <div className="intro">
                <p><strong>Intro to Python</strong></p>
                <p>CODING</p>
              </div>
            </div>
            
            <div className="card_details">
              <p>12/32 Classes</p>
            <p>1hr 45 Minutes</p>
             <p>4.5 ratings</p>
              <div className="resume-btn">
              <button onClick={() => ("card_details")}>Resume classes</button>
                <button> <FaArrowRight /></button>
                </div>
            </div>
            </div>
            
          </div>
      </div>
      <div className="active-course-activ">
      <div className="active-course-active">
        <h3>Recent Activities</h3>
        <div className="arrows">
          <button><IoIosMore /></button>
        </div>
        </div>
        <div className="actives-wrapper">
          <div className="todays_activies">
            <p>Today, 17 Oct 2024</p>
            <div className="lesson_schedule">
              <p><strong>13:00</strong></p>
              <div className="classes_view">
                <p>HTML 101</p>
                <p>Coursework</p>
              </div>
              <p>Graded 5/5</p>
            </div>
            <div className="lesson_schedule">
              <p><strong>14:00</strong></p>
              <div className="classes_view">
                <p>HTML 101</p>
                <p>Coursework</p>
              </div>
              <button>Upcoming</button>
            </div>
          </div>
          
           
            <div className="todays_activies">
            <p>Yesterday, 16 Oct 2024</p>
            <div className="lesson_schedule">
              <p><strong>13:00</strong></p>
              <div className="classes_view">
                <p>HTML 101</p>
                <p>Coursework</p>
              </div>
              <button>Submitted</button>
            </div>
            <div className="lesson_schedule">
            <p><strong>14:00</strong></p>
              <div className="classes_view">
                <p>HTML 101</p>
                <p>Coursework</p>
              </div>
              <button>Missed</button>
            </div>
          </div>
          
          <div className="todays_activies">
           
           
            <p>Thursday, 15 Oct 2024</p>
            <div className="lesson_schedule">
            <p><strong>13:00</strong></p>
              <div className="classes_view">
                <p>HTML 101</p>
                <p>Coursework</p>
              </div>
              <button>Missed</button>
            </div>
            <div className="lesson_schedule">
            <p><strong>14:00</strong></p>
              <div className="classes_view">
                <p>HTML 101</p>
                <p>Coursework</p>
              </div>
           <button>Attended</button>
          </div>
            
          </div>
        </div>
        
      </div>
      
    </div>
  );
};

export default Mycourses;
