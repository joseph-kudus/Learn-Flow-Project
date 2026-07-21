import React, { useState, useEffect, useRef } from "react";
import "./Nav.css";
import { Link, useLocation } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import whiteLogo from "../assets/learnflow-white.svg";
import { HiMenu } from "react-icons/hi";

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const closeMenu = () => setShowMenu(false);
  const firstMobileLinkRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth > 768) {
        setShowMenu(false);
      }
    };
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  // Prevent background scrolling when the mobile menu is open
  useEffect(() => {
    const scrollY = window.scrollY;

    if (showMenu) {
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    } else {
      const top = document.body.style.top;

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";

      if (top) {
        window.scrollTo(0, parseInt(top || "0", 10) * -1);
      }
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
    };
  }, [showMenu]);

  //Close the mobile menu with the Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowMenu(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);
  useEffect(() => {
    if (showMenu) {
      firstMobileLinkRef.current?.focus();
    }
  }, [showMenu]);

  useEffect(() => {
    setShowMenu(false);
  }, [location.pathname]);
  return (
    <div className="header-container">
      <div className="navbar">
        <div className="nav-left">
          <Link to="/Landing" className="logo-l" onClick={closeMenu}>
            <img src={whiteLogo} alt="LearnFlow logo" />
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
            Let's start your learning journey
          </Link>
        </div>

        <button
          className="menu-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={showMenu}
          aria-controls="mobile-menu"
          onClick={() => setShowMenu((prev) => !prev)}
        >
         <HiMenu size={28}/>
        </button>
      </div>
      <div id="mobile-menu" className={`mobile-menu ${showMenu ? "show" : ""}`}>
        <Link
          ref={firstMobileLinkRef}
          to="/about"
          className="navbara"
          onClick={closeMenu}
        >
          About
        </Link>
        <Link to="/features" className="navbara" onClick={closeMenu}>
          Features
        </Link>
        <Link to="/pricing" className="navbara" onClick={closeMenu}>
          Pricing
        </Link>
        <Link to="/login" className="cta-button" onClick={closeMenu}>
          Lets start your learning journey
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
