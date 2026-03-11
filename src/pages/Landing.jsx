import React from "react";
import { Link } from "react-router-dom";
import "../pages/Page.css";

function Landing() {
  return (
    <main>
      <div className="Container">
        <div className="article">
          <div className="article-title">
            <h1>The free, fun, and effective way to learn a language</h1>
            <p>
              Learn at your own pace with lifetime access on mobile and desktop.
            </p>
          </div>
          <div className="join">
            <button className="newc">Start a new course!</button>
            <h3>Join thousands of students to start coding now!</h3>
          </div>
        </div>
        <div className="features">
          <div className="feature-c">
            <h1>Special features that make our online courses the best</h1>
          </div>
          <div className="features-card">
            <div className="f-card">
              <div className="title">
                <h3>Made by Experts</h3>
              </div>
              <p>
                Our programming languages courses are meticulously crafted and
                taught by industry experts who bring years of practical
                experience
              </p>
            </div>
            <div className="f-card">
              <div className="title">
                <h3>Career Opportunities</h3>
              </div>
              <p>
                Benefit from our job placement assistance services that connects
                qualified learners with relevant career path
              </p>
            </div>
            <div></div>
            <div className="f-card">
              <div className="title">
                <h3>Collaboration</h3>
              </div>
              <p>
                Study at their own pace and on their own schedule, which is
                ideal for those who have work, family, or other commitments
              </p>
            </div>
          </div>
          <div className="colabration">
            <div className="colab">
              <div className="myi">
                <img src="../assets/images/Frame8754.png" alt="img here" />
              </div>
              <div className="colo">
                <div className="cols">
                  <h1>Collaborate & learn with our platform</h1>
                  <p>
                    qualified instructors, who are passionate about teaching and
                    dedicated to helping you achieve your language goals.
                  </p>
                </div>
                <button className="newc">Get Started</button>
              </div>
              <div></div>
              <div className="colo">
                <h1>Propel your career & expand your knowledge at any level</h1>
                <p>
                  Learnflow is an online course class that provides various
                  categories of programming courses.
                </p>
                <button className="newc">Get Started</button>
                <div className="myi">
                  <img src="../assets/images/Frame8754.png" alt="img here" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="learners-goals">
        <h1>Learners like you achieve their goals through our courses</h1>
        <p>
          We believe everyone has something to give. Share your skills &
          experience with students around the world by teaching free or paid.
        </p>
        <div className="goals"></div>
      </div>
      <div className="knowledge">
        <div className="knowledge-exp">
          <h1>Expand your skills & knowledge at any level.</h1>
          <p>
            Learn at your own pace with lifetime access on mobile and desktop.
          </p>
          <button className="bt">Get started</button>
        </div>
      </div>
    </main>
  );
}

export default Landing;

 
                      