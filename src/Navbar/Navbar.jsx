import React, { useState, useEffect } from "react";
import "./Nav.css";
import { Link } from "react-router-dom";
import { BarChartHorizontal, Notebook } from "lucide-react";

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth > 768) {
        setShowMenu(false);
      }
    };
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <div className="header-container">
      <div className="navbar">
        <div className="nav-left">
          <Link to="/Landing" className="logo-l">
            <Notebook />
            <p>LearnFlow</p>
          </Link>
        </div>
        <div className="nav-center">
          <Link to="/about" className="navbara">
            About
          </Link>
          <Link to="/features" className="navbara">
            Features
          </Link>
          <Link to="/pricing" className="navbara">
            Pricing
          </Link>
        </div>
        <div className="nav-right">
          <Link to="/login" className="cta-button">
            Lets start your learning journey
          </Link>
        </div>
        <button className="menu-toggle" onClick={() => setShowMenu(!showMenu)}>
          <BarChartHorizontal />
        </button>
      </div>
      <div className={`mobile-menu ${showMenu ? "show" : ""}`}>
        <Link to="/about" className="navbara">
          About
        </Link>
        <Link to="/features" className="navbara">
          Features
        </Link>
        <Link to="/pricing" className="navbara">
          Pricing
        </Link>
        <Link to="/login" className="cta-button">
          Lets start your learning journey
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
