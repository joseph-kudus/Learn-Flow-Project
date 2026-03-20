import React from "react";
import "./Nav.css";
import { Link } from "react-router-dom";
import { Notebook } from "lucide-react";

function Navbar() {
  return (
    <header class="header-container">
      <nav class="nav">
        <div className="navbar">
          <Link to="/Landing" className="logo-l">
            <Notebook />
            <p>LearnFlow</p>
          </Link>
        </div>
        <div className="nav-li">
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
        <Link to="/login" className="cta-button">
          Lets start your learning journey
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
