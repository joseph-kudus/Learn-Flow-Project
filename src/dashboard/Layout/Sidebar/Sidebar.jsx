{
  /*
import React from "react";
import { Link, useNavigate } from "react-router-dom";
zz
zz
zz
zz
zz
zz
zz
zz
zz
zz
zz
zz
zz
zz
zz
zz
zz
zz
zz
zz
zz
zz
zz
zz
import "../dashboard/das.css";
import { useAuth } from "../context/AuthContext";
import Support from "../dashboard/Support";
import SettingsPage from "../dashboard/SettingsPage";
import Coursebuilder from "../dashboard/courses/Coursebuilder";

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
          <Link className="nav-item" to="/dashboard/allcourses">
            <ScrollText />
            <span>All Courses</span>
          </Link>
          <Link className="nav-item" to="/coursebuilder">
            <PenLineIcon />
            <span>Course Builder</span>
          </Link>
          <Link className="nav-item" to="/setting">
            <Settings />
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
};
*/
}
import { useAuth } from "../../../context/AuthContext";
import { BookIcon } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Book,
  BookCheckIcon,
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
import "../layout.css";

const Sidebar = () => {
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
    <aside className="drawer">
      <div className="nav-title">MENU</div>
      <div className="navigation-sidebar">
        <div className="nav-links">
          <ul>
            <li>
              <Link
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
                to="/dashboard"
              >
                <LayoutDashboard className="icon" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
                to="/allcourses"
              >
                <ScrollText className="icon" />
                <span>All Courses</span>
              </Link>
            </li>
            <li>
              <Link
                className={({ isActive }) => `nav-item $ 
              {isActive ?  "active" : ""}`}
                to="/coursebuilder"
              >
                <PenLineIcon className="icon" />
                <span>Course Builder</span>
              </Link>
            </li>
            <li>
              <Link
                className={({ isActive }) =>
                  `nav-item $ {isActive ? "active" :""}`
                }
                to="/setting"
              >
                <Settings className="icon" />
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <Link className={({ isActive }) => `nav-item`} to="/Support">
                <HardDriveUpload className="icon" />
                <span>Support</span>
              </Link>
            </li>
            <li>
              <Link
                className={({ isActive }) => `nav-item $ {"nav-item"}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                <LogOut className="icon" />
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
