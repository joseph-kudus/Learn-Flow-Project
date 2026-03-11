import { Link } from 'react-router-dom';
import './Nav.css'
import About from '../pages/About';
import Features from '../pages/Features'

function Navbar() {
    return (
      <div className="header">
        <div className="nav">
          <div className="logo">
            <Link to="/" className="logo-l">
              <img src="../assets/images/book.png" alt="Logo" />
              <p>LearnFlow</p>
            </Link>
          </div>
          <div className="navbar">
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
          <button className='button-header'>start your learning journey</button>
        </div>
      </div>
    );
}
export default Navbar;