import React, { useState } from "react";
import { BiLeftArrow, BiRightArrow } from "react-icons/bi";
import "../../styles/achievement.css";
import certtemp from "../../assets/Cert/cert-Template.png";

const Achievement = () => {
  const certificates = [
    {
      id: 1,
      title: "Learn Flow Guides",
      image: certtemp,
    },
    {
      id: 2,
      title: "React Fundamentals",
      image: certtemp,
    },
    {
      id: 3,
      title: "JavaScript Mastery",
      image: certtemp,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCertificate = () => {
    setCurrentIndex((prev) =>
      prev === certificates.length - 1 ? 0 : prev + 1,
    );
  };

  const previousCertificate = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? certificates.length - 1 : prev - 1,
    );
  };

  const certificate = certificates[currentIndex];

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
          <button onClick={previousCertificate}>
            <BiLeftArrow />
          </button>

          <button onClick={nextCertificate}>
            <BiRightArrow />
          </button>
        </div>
      </div>

      <div className="certificate-card">
        <div className="cert-card">
          <img src={certificate.image} alt="certificate" />
        </div>

        <span>{certificate.title}</span>
      </div>
    </div>
  );
};

export default Achievement;
