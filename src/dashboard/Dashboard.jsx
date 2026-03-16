import React from "react";
import { Link } from "react-router-dom";
import "./das.css";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Notebook } from "lucide-react";

export default function Dashboard() {
  const { logout } = useAuth();
  console.log(logout);

  const handleLogout = () => {
    logout();
    Navigate("/login");
  };

  return (
    <main-ce className="body">
      <div className="dashboard">
        {/*Movile overlay */}
        <div className="Movile-overlay"></div>
        {/*header */}
        <header className="header">
          <div className="header-left">
            <button className="mobile-toggle" id="menuToggle">
              <i className="fas fa-bars"></i>
            </button>
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="search....." />
            </div>
            <div className="header-right">
              <button className="theme-toggle" id="theme-Toggle">
                <i className="fas fas-moon"></i>
              </button>
            </div>
            <div className="notification">
              <i className="fas fas-bell"></i>
              <span className="notification-bag">3</span>
            </div>
            <div className="user-profile">
              <img src=" //" alt="user imga" />
            </div>
          </div>
        </header>
        {/* -- sidebar -- */}
        <aside className="sidebar">
          <div className="logo">
            <Notebook></Notebook>
            <i className="fas fa-code"></i>
            <h1>LearnFlow</h1>
          </div>
          <div className="nav-title">MENU</div>
          <div className="nav-links">
            <Link className='nav-item active'>
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </Link>
            <Link className='nav-item'>
              <i className="fas fa-project-diagram"></i>
              <span>Project</span>
            </Link>
          </div>
          <button onClick={() => logout()}>Logout</button>
        </aside>

        {/*--content-- */}
        <main className="content"></main>
        {/*--footer-- */}
        <footer className="footer"></footer>
      </div>
    </main-ce>
  );
}
