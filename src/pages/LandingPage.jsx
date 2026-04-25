import { useState } from "react";
import { Link } from "react-router-dom";
import { UserRoundCog, BadgeHelpIcon } from "lucide-react";
import "./LandingPage.css";

import {
  hero,
  land,
  ato,
  ata,
  dolingo,
  vector2,
  UserT,
  Magic,
  bes,
  bes1,
} from "../assets/images/Landingimage";
function LandingPage() {
  const [count, setCount] = useState(0);

  const testimonials = Array(8).fill({
    name: "Joe Doe",
    role: "Web Developer",
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi possimus reprehenderit ut qui at earum.",
    img: ato,
  });

  return (
    <main>
      <div className="container">
        {/* Hero section */}
        <div className="hero-section">
          <div className="cta-text">
            <h1>The free, fun, and effective way to learn a language</h1>
            <p>
              Learn at your own pace with lifetime access on mobile and desktop.
            </p>
          </div>
          <div className="cta">
            <div className="article">
              <button className="btn-primary">Start a new course!</button>
              <div className="groupimg">
                <img src={land} alt="student" />
                <img src={ato} alt="student" />
                <img src={ata} alt="student" />
              </div>
              <h3 className="gr-h">
                Join thousands of students to start coding now!
              </h3>
              <p>you have clicked {count} times</p>
              <button onClick={() => setCount(count + 1)}>click me</button>
            </div>
          </div>
          <div className="hero-img">
            <img className="hero-image" src={hero} alt="Hero" />
          </div>
        </div>

        {/* Logo slide */}
        <div className="logo-slides">
          <div className="logos">
            <Link to="/">
              <img src={dolingo} alt="duolingo" />
            </Link>
            <Link to="/">
              <img src={vector2} alt="codecov" />
            </Link>
            <Link to="/">
              <img src={UserT} alt="usertech" />
            </Link>
            <Link to="/">
              <img src={Magic} alt="magic" />
            </Link>
            <Link to="/">
              <img src={vector2} alt="codev" />
            </Link>
          </div>
        </div>

        {/* Features */}
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
              <UserRoundCog className="userf" />
            </div>
            <div className="f-card">
              <div className="title">
                <h3>Career Opportunities</h3>
              </div>
              <p>
                Benefit from our job placement assistance services that connects
                qualified learners with relevant career path
              </p>
              <BadgeHelpIcon className="userf" />
            </div>
            <div className="f-card">
              <div className="title">
                <h3>Collaboration</h3>
              </div>
              <p>
                Study at their own pace and on their own schedule, which is
                ideal for those who have work, family, or other commitments
              </p>
              <UserRoundCog className="userf" />
            </div>
          </div>

          {/* Collaboration */}
          <div className="colabration">
            <div className="colab">
              <div className="colo">
                <div className="myi">
                  <img src={bes} alt="Collaborate" />
                </div>
                <div className="cols">
                  <h1>Collaborate & learn with our platform</h1>
                  <p>
                    Qualified instructors, who are passionate about teaching and
                    dedicated to helping you achieve your language goals.
                  </p>
                  <button className="btn-primary">Get Started</button>
                </div>
              </div>

              <div className="colo reverse">
                <div className="cols">
                  <h1>
                    Propel your career & expand your knowledge at any level
                  </h1>
                  <p>
                    Learnflow is an online course class that provides various
                    categories of programming courses.
                  </p>
                  <button className="btn-primary">Get Started</button>
                </div>
                <div className="myi">
                  <img src={bes1} alt="Career" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="learners-goals">
        <div className="lean">
          <h1>Learners like you achieve their goals through our courses</h1>
          <p>
            We believe everyone has something to give. Share your skills &
            experience with students around the world by teaching free or paid.
          </p>
        </div>

        <div className="goals">
          {testimonials.map((t, i) => (
            <div className="learner-card" key={i}>
              <div className="learner-bio">
                <img src={t.img} alt={t.name} className="avatar" />
                <div className="lent">
                  <h3>{t.name}</h3>
                  <h5>{t.role}</h5>
                </div>
              </div>
              <p>{t.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="knowledge">
        <div className="knowledge-exp">
          <div className="kta">
            <h1>Expand your skills & knowledge at any level.</h1>
            <p>
              Learn at your own pace with lifetime access on mobile and desktop.
            </p>
            <button className="btn-dark">Get started</button>
          </div>
          <div className="imi">
            <img src={hero} alt="Knowledge" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default LandingPage;
