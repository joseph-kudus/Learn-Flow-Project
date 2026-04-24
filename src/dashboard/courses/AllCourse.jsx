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
import { FaArrowLeft } from "react-icons/fa";

function AllCourse() {
  const course = {
    author: "ATO productions",
    level: "Beginner",
    lessions: 14,
    price: "",
  };
  const handleBuy = () => {
    console.log("Buying course:", course.lessions);
    //payment logic here
  };
  return (
    <div className="allcourses-wrapper">
      <div className="back-to-course">
        <button>
          <FaArrowLeft className="arrow" />
        </button>

        <span>
          <h1>Back Courses</h1>
        </span>
      </div>
      <div className="models">
        <img src={Image2} alt="model-image" />
      </div>

      <div className="course-conti">
        <div className="conti-q">
          <h3>Introduction to CSS language</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur. Tempus ultrices dui
            vulputate pulvinar risus. Purus lacus tempus mi nibh ligula. Sit in
            blandit eget id dictum. Dignissim tincidunt pharetra habitant mi nec
            curabitur et justo. Tristique massa est magna auctor iaculis diam
            mauris rhoncus. Justo dignissim odio dolor tortor adipiscing. Non
            volutpat lacinia arcu elit dignissim at. Magna dolor fermentum ac
            morbi. Vitae curabitur lacinia natoque turpis enim donec
            pellentesque. Varius convallis sed ullamcorper nisl ligula pharetra.
            Volutpat cursus et lorem ut risus in metus venenatis duis. At vitae
            nullam at at ut. Mattis nisl amet tempus turpis donec vel viverra
            eu. Faucibus convallis faucibus faucibus leo pretium enim euismod.
            Elit amet volutpat pellentesque tempus dolor faucibus risus at.
            Venenatis volutpat nam velit metus cursus ut eget tempor risus.
            Tortor massa magna amet netus adipiscing ultrices nunc facilisi
            eleifend. Tincidunt sit volutpat quam eu at rhoncus purus diam. Et
            condimentum donec ut sed risus mattis metus nisl. Libero praesent
            bibendum mauris mauris turpis.
          </p>
        </div>
        <div className="course-card">
          <h2>Course details</h2>
          <div className="course-info">
            <div className="info-row">
              <span className="label">Author:</span>
              <span className="value">{course.author}</span>
            </div>
            <div className="info-row">
              <span className="label">Level:</span>
              <span className="value">{course.level}</span>
            </div>
            <div className="info-row">
              <span className="label">Lesson: </span>
              <span className="value">{course.lessions}</span>
            </div>
            <button className="buy-btn" onClick={handleBuy}>
              Buy Now{course.price}
            </button>
          </div>
        </div>
      </div>
      <button className="next-btn">Next</button>
    </div>
  );
}

export default AllCourse;
