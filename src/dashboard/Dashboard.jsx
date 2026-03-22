import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./das.css";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import {
  Bell,
  HardDriveUpload,
  LayoutDashboard,
  LogOut,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  Notebook,
  NotebookPen,
  NotebookPenIcon,
  NotebookTabsIcon,
  PenLineIcon,
  ScrollIcon,
  ScrollText,
  SearchIcon,
  Settings,
  ToggleRight,
  User,
  UserIcon,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";



export default function Dashboard() {
  const navigate=useNavigate();
  const {currentUser}=useAuth();
  
  return (
    <div className="dashboard">
      {/*Movile overlay */}
      <div className="Movile-overlay"></div>
      {/*header */}
      <header className="header">
        <div className="header-left">
          <button className="theme-toggle" id="menuToggle">
            <i className="fas fa-bars"></i>
          </button>
          <div className="search-bar">
            <i className="fas fa-search">
              <SearchIcon />
            </i>
            <input type="text" placeholder="search....." />
          </div>
        </div>
        <div className="header-right">
          <button className="theme-toggle" id="theme-Toggle">
            <i className="fas fas-moon">
              <MoonIcon />
            </i>
          </button>
          <div className="notification">
            <i className="fas fas-bell">
              <Bell />
            </i>
            <span className="notification-bag">3</span>
          </div>
          {currentUser ? (
            <div className="user-profile flex items-center text-sm text-gray-600">
              <User />
              <span>{currentUser.email}</span>
            </div>
          ) : (
            <p>welcome</p>
          )}
        </div>
      </header>
      {/* -- sidebar -- */}
      <Sidebar />
      {/*--content-- */}
      <section className="content-section">
        {/*--Welecome Banner-- */}
        <div className="welcome-banner">
          <h1>Welcome to Learnflow</h1>
          <h3>Learn at your own pace with lifetime access on mobile and desktop</h3>
          <hr />
          
        </div>
        
      </section>
      {/*--footer-- */}
      <footer className="footer"></footer>
    </div>
  );
}
