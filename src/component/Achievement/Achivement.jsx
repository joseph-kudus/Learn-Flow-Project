import React from "react";
import { useState } from "react";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import "../../styles/achievement.css";
import certtemp from "../../assets/Cert/cert-Template.png";

const Achievement = () => {
  return (
    <div className="achievement-container">
      <div className="label-header">
        <div className="labels">
          <button>
            Achievements <BiRightArrow />
          </button>
          <button>Certificates</button>
        </div>
        <div className="next-btns">
          <BiLeftArrow />
          <BiRightArrow />
        </div>
      </div>
      <div className="certificate-card">
        <div className="cert-card">
          <img src={certtemp} alt="certificate" width="500" />
        </div>
        <span>Learn Flow Guides</span>
        <div className="cert-card">
          <img src={certtemp} alt="certificate" width="500" />
        </div>
        <span>Learn Flow Guides</span>
      </div>
    </div>
  );
};
export default Achievement;
