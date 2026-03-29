import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
import Support from "../dashboard/Support";
import SettingsPage from "../dashboard/SettingsPage";

export default function Sidebar() {
  const { logout } = useAuth();

  const navigate = useNavigate();


  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
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
           <SettingsPage/>
            <span>Settings</span>{" "}
          </Link>
          <Link className="nav-item" to="/Support">
            <HardDriveUpload />

            <span>Support</span>
          </Link>
          <Link
            className="nav-item"
            to="#"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            <LogOut />
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
