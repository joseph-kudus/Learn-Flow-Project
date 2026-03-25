import React from "react";
import { Link, Navigate } from "react-router-dom";
import {
  Bell,
  Book,
  BookCheckIcon,
  BookIcon,
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
import "../dashboard/das.css";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  console.log(logout);

  const handleLogout = () => {
    logout();
    Navigate("/login");
  };
  return (
    <aside className="sidebar">
      <div className="logo">
        <BookIcon className="logob" />
        <p>LearnFlow</p>
      </div>
      <div className="nav-title">MENU</div>
      <div className="navigation-sidebar">
        <div className="nav-links">
          <Link className="nav-item active" to="/dashboard">
            <LayoutDashboard className="logob" />
            <span>Dashboard</span>
          </Link>
          <Link className="nav-item" to="/About">
            <ScrollText />
            <span>All Courses</span>
          </Link>
          <Link className="nav-item" to="/coursebuilder">
            <PenLineIcon />
            <span>Course Builder</span>
          </Link>
          <Link className="nav-item" to="/settings">
            <Settings />
            <span>Settings</span>{" "}
          </Link>
          <Link className="nav-item" to="support">
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
      </div>
    </aside>
  );
}
