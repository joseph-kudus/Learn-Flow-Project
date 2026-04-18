import React from "react";
import {
  unsplash,
  Image1,
  Image2,
  Image3,
  Image4,
  Image5,
} from "../../assets/images/Myimg";
import "../../dashboard/courses/course.css";

function AllCourse() {
  return (
    <div className="allcourses-wrapper">
      <h1>Courses</h1>
      <p>
        Unlock the world of web development effortlessly with our innovative
        e-learning courses. Elevate your skills, build a dynamic portfolio, and
        launch your web development or no-code career with our industry-aligned
        certifications and dedicated job placement assistance.
      </p>
      <div className="course-conti">
        <div className="conti">
          <img src={unsplash} alt="img" />
          <div className="conti-q">
            <h3>Introduction to CSS language</h3>
            <p>Learn different programming languages and its usefulness</p>
          </div>
        </div>
        <div className="conti">
          <img src={Image1} alt="imgs" />
          <div className="conti-q">
            <h3>Introduction to JavaScript language</h3>
            <p>Learn different programming languages and its usefulness</p>
          </div>
        </div>
      </div>
      <div className="experts">
        <h2>Languages courses</h2>
        <p>
          Chose from one over many of courses and learn with industry leading
          expert{" "}
        </p>
        <div className="expert-cart">
          <div className="card-wrap">
            <img src={Image2} alt="to css" className="imgr" />
            <div className="expert1">
              <div className="expert11">
                <h1>Introduction to CSS language</h1>
                <p>
                  Learn the basics of CSS, and its usefulness in the programming
                  world
                </p>
                <div className="ato">
                  <p>
                    By <strong>ATO</strong>
                  </p>
                  <p>
                    <strong>$29</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card-wrap">
            <img src={Image3} alt="to css" className="imgr" />
            <div className="expert1">
              <div className="expert11">
                <h1>Introduction to Python language</h1>
                <p>
                  Learn the basics of python, and its usefulness in the
                  programming world
                </p>
                <div className="ato">
                  <p>
                    By <strong>ATO</strong>
                  </p>
                  <p>
                    <strong>$30</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="expert-cart">
          <div className="card-wrap">
            <img src={Image5} alt="to css" className="imgr" />
            <div className="expert1">
              <div className="expert11">
                <h1>Introduction to Javascript language</h1>
                <p>
                  Learn the basics of Javascript, and its usefulness in the
                  programming world
                </p>
                <div className="ato">
                  <p>
                    By <strong>ATO</strong>
                  </p>
                  <p>
                    <strong>$50</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="card-wrap">
            <img src={Image4} alt="to css" className="imgr" />
            <div className="expert1">
              <div className="expert11">
                <h1>Introduction to HTML language</h1>
                <p>
                  Learn the basics of HTML, and its usefulness in the
                  programming world
                </p>
                <hr />
                <div className="ato">
                  <p>
                    By <strong>ATO</strong>
                  </p>
                  <p>
                    <strong>$35</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllCourse;
