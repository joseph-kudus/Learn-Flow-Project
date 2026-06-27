import React from "react";
import { FaStar } from "react-icons/fa";
import "../UserData/stars.css";

const Stars = () => {
  return (
    <div className="star-container">
      <div className="stars-wrapper">
        <h1>
          Unlock 100+ premium courses curated by experts.
        </h1>

        <div className="star-rating">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className="star active" />
          ))}
        </div>


        <button className="premium-btn">Go Premium</button>
      </div>
    </div>
  );
};
export default Stars;
