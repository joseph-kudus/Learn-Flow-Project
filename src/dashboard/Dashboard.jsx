import React from "react";
import "./das.css";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { logout } = useAuth();
  console.log(logout);

  const handleLogout = () => {
    logout();
    Navigate("/login");
  };

  return (
    <main className="body">
      <div className="dashboard">
        {/*Movile overlay */}
        <div className="Movile-overlay"></div>
        {/*header */}
        <header className="header">
          <div className="header-left">
            <button className="mobile-toggle" id="menu tuggle">
              <i className="fas fa-bars"></i>
            </button>
            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input
                type="search"
                name="search"
                id=""
                placeholder="search....."
              />
            </div>
          </div>
        </header>
        {/* -- sidebar -- */}
        <aside className="sidebar">
          <div className="header-right">
            <button className="theme-toggle" id="theme-Toggle">
              <i className="fas fas-moon"></i>
            </button>
            <button onClick={() => logout()}>Logout</button>
          </div>
        </aside>
        {/*--content-- */}
        <main className="content"></main>
        {/*--footer-- */}
        <footer className="footer"></footer>
      </div>
    </main>
  );
}
