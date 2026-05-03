import React from "react";
import {
  Image1,
  unsplash,
  Image2,
  Image3,
  Image4,
  Image5,
} from "../../assets/images/Myimg";

function DashboardContent({setActiveView}) {
  const continueLearning = [
    {
      img: unsplash,
      title: "Introduction to CSS language",
      desc: "Learn different programming languages and its usefulness",
    },
    {
      img: Image1,
      title: "Introduction to JavaScript language",
      desc: "Learn different programming languages and its usefulness",
    },
  ];

  const courses = [
    {
      img: Image2,
      title: "Introduction to CSS language",
      desc: "Learn the basics of CSS, and its usefulness in the programming world",
      author: "ATO",
      price: 29,
    },
    {
      img: Image3,
      title: "Introduction to Python language",
      desc: "Learn the basics of python, and its usefulness in the programming world",
      author: "ATO",
      price: 30,
    },
    {
      img: Image5,
      title: "Introduction to Javascript language",
      desc: "Learn the basics of Javascript, and its usefulness in the programming world",
      author: "ATO",
      price: 50,
    },
    {
      img: Image4,
      title: "Introduction to HTML language",
      desc: "Learn the basics of HTML, and its usefulness in the programming world",
      author: "ATO",
      price: 35,
    },
  ];

  return (
    <section className="content-section">
      <div className="welcome-banner">
        <div className="welcome-banner1">
          <h1>Welcome to Learnflow</h1>
          <p>
            Learn at your own pace with lifetime access on mobile and desktop
          </p>
        </div>
        <hr />
        <p>Let’s continue Learning!</p>
        <div className="course-conti">
          {continueLearning.map((item, idx) => (
            <div className="conti" key={idx}>
              <img src={item.img} alt={item.title} />
              <div className="conti-q">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div id="progressbar">
                  <div></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="experts">
        <h2>Languages courses</h2>
        <p>Choose from many courses and learn with industry leading expert</p>
        <div className="expert-cart">
          {courses.map((course, idx) => (
            <div className="card-wrap" key={idx}>
              <img src={course.img} alt={course.title} className="imgr" />
              <div className="expert1">
                <div className="expert11">
                  <h1>{course.title}</h1>
                  <p>{course.desc}</p>

                  <hr />
                  <div className="ato">
                    <p>
                      By <strong>{course.author}</strong>
                    </p>
                    <p>
                      <strong>${course.price}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => setActiveView("allcourse")} className="News">
            View all courses
          </button>
        </div>
      </div>
    </section>
  );
}

export default DashboardContent;
