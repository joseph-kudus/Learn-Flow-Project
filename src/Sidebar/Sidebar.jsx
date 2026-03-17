import React from 'react'
import { Link, Navigate } from 'react-router-dom';
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
import "../dashboard/das.css"
import { useAuth } from '../context/AuthContext';


export default function Sidebar() {
    const { logout } = useAuth();
    console.log(logout);

    const handleLogout = () => {
      logout();
      Navigate("/login");
    };
  return (
    <div>
      <aside className="sidebar">
        <div className="logo">
          <Notebook className="logob" />
          <p>LearnFlow</p>
        </div>
        <div className="nav-title">MENU</div>
        <div className="nav-links">
          <Link className="nav-item active" to="/dashboard">
            <LayoutDashboard className="logob" />
            <span>Dashboard</span>
          </Link>
          <Link className="nav-item" to="/About">
            <ScrollText />
            <span>All Courses</span>
          </Link>
          <Link className="nav-item">
            <PenLineIcon />
            <span>Course Builder</span>
          </Link>
          <Link className="nav-item" to="/settings">
            <Settings />
            <span>Settings</span>{" "}
          </Link>
          <Link className="nav-item">
            <HardDriveUpload />
            <span>Support</span>
          </Link>
          <Link className="nav-item">
            <button onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </button>
          </Link>
        </div>
      </aside>
    </div>
  );
}
