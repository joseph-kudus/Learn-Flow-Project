import React from "react";
import { Notebook } from "lucide-react";
import "../App.css";
import { Link } from "react-router-dom";
export default function () {
  return (
    <footer>
      <div className="footer-container">
        <div>
          <Link to="/Landing" className="logo-l">
            <Notebook />
            <p>LearnFlow</p>
          </Link>
          <div className="footer-c">
            <p>
              Top learning experiences that create more talent in the world.
            </p>
          </div>
        </div>

        <div className="footer-socila-links">
          <div>
            <h1>Links</h1>
            <Link to="/About" className="logo-l">
              About
            </Link>
            <Link to="/About" className="logo-l">
              Program
            </Link>
            <Link to="/About" className="logo-l">
              Contact Us
            </Link>
            <Link to="/About" className="logo-l">
              FAQs
            </Link>
          </div>

          <div>
            <h1>Social</h1>
            <Link to="/About" className="logo-l">
              Twitter
            </Link>
            <Link to="/About" className="logo-l">
              Linkedin
            </Link>
            <Link to="/About" className="logo-l">
              Facebook
            </Link>
          </div>
          <div>
            <h1>Legal</h1>
            <Link to="/About" className="logo-l">
              Term
            </Link>
            <Link to="/About" className="logo-l">
              Privacy
            </Link>
          </div>
        </div>
      </div>
      <hr />
      <div className="hr-content">
        <div className="footer-sec">
          <p>© 2024 Kudovia programmers University. All rights reserved.</p>
        </div>

        <div className="footer-sec">
          <p>Twitter logo</p>
          <p>Linkind logo</p>
          <p>Facebook logo</p>
          <p>Instagram logo</p>
        </div>
      </div>
    </footer>
  );
}
