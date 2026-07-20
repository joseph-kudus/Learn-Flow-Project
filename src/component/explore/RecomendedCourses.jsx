import { like, type } from "firebase/firestore/pipelines";
import React from "react";
import "../../styles/stars.css";
import { BiRightArrow } from "react-icons/bi";
import CourseDetails from "../courses/CourseDetails";

const RecomendedCourse = (usse) => {
  const Card_co = [
    {
      id: 100,
      img: "",
      title: "People Management",
      Category: "Management",
      duration: "12 Months",
      rating: 4.5,
      class: 50,
      type: "coding",
    },
    {
      id: 101,
      img: "",
      title: "Advanced Rush",
      Category: "BlockChain",
      duration: "12 Months",
      rating: 4.5,
      class: 50,
      type: "Programing",
    },
  ];
  return (
    <div className="main">
      <div className="recommended-course">
        <h1>Recomended Course here</h1>
      </div>

      <div className="recommended_card">
        <div className="image_cardx">
          <div className="image_card">
            <img src="#" alt="img" />
          </div>
          <div className="_card_details">
            <p>{usse.title}</p>
            <p>{usse.Category}</p>
          </div>
          <div className="stats">
            <div className="rate">
              <img src="#" alt="icon" />
              <span>50 Classes</span>
            </div>
            <div className="rate">
              <img src="#" alt="icon" />
              <span>12 Months</span>
            </div>
            <div className="rate">
              <img src="#" alt="icon" />
              <span>4.5 Ratings</span>
            </div>
          </div>
          <button>
            Enroll for $100 <BiRightArrow />
          </button>
        </div>
      </div>
      <CourseDetails/>
    </div>
  );
};

export default RecomendedCourse;
