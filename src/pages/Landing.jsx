import React from "react";
import { Link } from "react-router-dom";
import "../pages/Page.css";
import land from "../assets/images/Ellipse 1.png";
import ato from "../assets/images/Ellipse 5.png";
import hero from "../assets/images/Dashboard 2.png"
import { Badge, BadgeHelpIcon, User, User2Icon, UserCircleIcon, UserCog, UserRoundCog } from "lucide-react";
function Landing() {
  return (
    <main>
      <div className="Container">
        {/* Hero section */}
        <div className="Hero-section">
          <div className="CTA">
            <div className="cta-text">
              <h1 className="cta-h1">
                The free, fun, and effective way to learn a language
              </h1>
              <p className="cta-h1-p">
                Learn at your own pace with lifetime access on mobile and
                desktop.
              </p>
            </div>
            <div className="article">
              <div className="join">
                <button className="newc">Start a new course!</button>
                <div className="groupimg">
                  <img src={land} alt="gr" />
                  <img src={ato} alt="gr" />
                  <img src={ato} alt="gr" />
                </div>
                <h3 className="gr-h">Join thousands of students to start coding now!</h3>
              </div>
            </div>
          </div>
          <div className="hero-img">
            <img src={hero} alt="img" />
          </div>
        </div>

        {/**Logo slide */}
        <div className="logo-slides">
          <div className="logos">
            <Link>
              <img src="" className="logos1" />
            </Link>
          </div>
          <div className="logos">
            <Link>
              <img src="" alt="codecov" />
            </Link>
          </div>
          <div className="logos">
            <img src="" alt="usertesting" />
          </div>
          <div className="logos">
            <img src="" alt="magicleaf" />
          </div>
          <div className="logos">
            <img src="" alt="codevo" />
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
              <UserRoundCog className="userf"/>
            </div>
            <div className="f-card">
              <div className="title">
                <h3>Career Opportunities</h3>
              </div>
              <p>
                Benefit from our job placement assistance services that connects
                qualified learners with relevant career path
              </p>
              <BadgeHelpIcon className="userf"/>
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
              <div className="colo">
                <div className="myi">{/*image here* */}</div>
                <div className="cols">
                  <h1>Collaborate & learn with our platform</h1>
                  <p>
                    qualified instructors, who are passionate about teaching and
                    dedicated to helping you achieve your language goals.
                  </p>
                  <button className="newc">Get Started</button>
                </div>
              </div>

              <div className="colo">
                <div className="cols">
                  <h1>
                    Propel your career & expand your knowledge at any level
                  </h1>
                  <p>
                    Learnflow is an online course class that provides various
                    categories of programming courses.
                  </p>
                  <button className="newc">Get Started</button>
                </div>
                <div className="myii">{/*image here* */}</div>
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
        <div className="goals">
          <div className="learner-card">
            <img src="" alt="ikj" className="lent1" />
            <div className="lent">
              <h3>Joe Doe</h3>
              <p>Web Developer</p>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
              possimus reprehenderit ut qui at earum. Totam aperiam voluptatum
              officia quia quis error pariatur nihil quidem, necessitatibus
              ratione dolore. Id, corrupti?
            </p>
          </div>
          <div className="learner-card">
            <img src="" alt="" />
            <div>
              <h3>Joe Doe</h3>
              <p>Web Developer</p>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
              possimus reprehenderit ut qui at earum. Totam aperiam voluptatum
              officia quia quis error pariatur nihil quidem, necessitatibus
              ratione dolore. Id, corrupti?
            </p>
          </div>
          <div className="learner-card">
            <img src="" alt="" />
            <div>
              <h3>Joe Doe</h3>
              <p>Web Developer</p>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
              possimus reprehenderit ut qui at earum. Totam aperiam voluptatum
              officia quia quis error pariatur nihil quidem, necessitatibus
              ratione dolore. Id, corrupti?
            </p>
          </div>
          <div className="learner-card">
            <img src="" alt="" />
            <div>
              <h3>Joe Doe</h3>
              <p>Web Developer</p>
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
              possimus reprehenderit ut qui at earum. Totam aperiam voluptatum
              officia quia quis error pariatur nihil quidem, necessitatibus
              ratione dolore. Id, corrupti?
            </p>
          </div>
        </div>
      </div>
      <div className="knowledge">
        <div className="knowledge-exp">
          <div className="kta">
            <h1>Expand your skills & knowledge at any level.</h1>
            <p>
              Learn at your own pace with lifetime access on mobile and desktop.
            </p>
            <button className="bt">Get started</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Landing;
