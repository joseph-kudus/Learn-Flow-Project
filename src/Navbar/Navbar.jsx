import { Link } from "react-router-dom";
import { Notebook } from "lucide-react";
import "./Nav.css";
import About from "../pages/About";
import Features from "../pages/Features";
import Login from "../loginsignup/Login";

function Navbar() {
  return (
    <div className="header">
      <div className="nav-container">
        <div className="logo">
          <Link to="/" className="logo-l">
            <Notebook />
            <p>LearnFlow</p>
          </Link>
        </div>
        <div className="navba">
          <ul>
            <Link to="/About" className="li-ul">
              About
            </Link>
            <Link to="/Features" className="li-ul">
              Features
            </Link>
            <Link to="/Pricing" className="li-ul">
              Pricing
            </Link>
          </ul>
        </div>
        <button className="button-header">
          <Link to="/login" className="li-ul-e">
            start your learning journey
          </Link>
        </button>
      </div>
    </div>
  );
}
export default Navbar;
