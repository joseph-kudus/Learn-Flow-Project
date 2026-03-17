import React from "react";
import "./nav.css";
import { Link } from "react-router-dom";
import { Notebook } from "lucide-react";

function Navbar() {
  return (
    <header class="header">
      <nav class="nav">
        <div class="logo">
          <Link to="/" className="logo-icon">
            <Notebook />
            <span class="logo-text">LearnFlow</span>
          </Link>
        </div>
        <ul class="nav-links flex flex-center text-red">
          <Link to="/about" className="a">
            About
          </Link>
          <Link to="/features" className="a">
            Features
          </Link>
          <Link to="/pricing" className="a">
            Pricing
          </Link>
        </ul>
        <Link to="/login" className="cta-button">
          Lets start your learning journey
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
