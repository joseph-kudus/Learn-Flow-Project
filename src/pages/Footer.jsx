import React from "react";
import { Notebook } from "lucide-react";
import { Link } from "react-router-dom";
import "../App.css";

function Footer() {
  // <-- Add name here
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="logo-link">
            <Notebook size={24} />
            <p>LearnFlow</p>
          </Link>
          <div className="footer-c">
            <p>
              Top learning experiences that create more talent in the world.
            </p>
          </div>
        </div>

        <div className="footer-social-links">
          <div className="footer-section">
            <h4>Links</h4>
            <Link to="/about">About</Link>
            <Link to="/programs">Program</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/faqs">FAQs</Link>
          </div>

          <div className="footer-section">
            <h4>Social</h4>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              Twitter
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              Facebook
            </a>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="hr-content">
          <div className="footer-sec">
            <p>© 2026 Kudovia programmers University. All rights reserved.</p>
          </div>
          <div className="footer-sec">
            <a href="https://twitter.com">Twitter</a>
            <a href="https://linkedin.com">LinkedIn</a>
            <a href="https://facebook.com">Facebook</a>
            <a href="https://instagram.com">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; // <-- Export it
