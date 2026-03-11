import React from 'react'
import '../App.css'
import { Link } from 'react-router-dom';
export default function () {
  return (
    <footer>
      <div className="footer-container">
        <div className="logo">
          <Link to="/" className="logo-l">
            <img src="../assets/images/book.png" alt="Logo" />
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
            <div className="footer-socila-links-c">
              <p>About</p>
              <p>Program</p>
              <p>Contact us</p>
              <p>FAQ</p>
            </div>
          </div>
          <div>
            <h1>Social</h1>
            <p>Twitter</p>
            <p>Linkind</p>
            <p>Facebook</p>
          </div>
          <div>
            <h1>Legal</h1>
            <p>Tearm</p>
            <p>Privacy</p>
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
