{
  /*
import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { BookIcon } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";






















import { IoMdLogOut } from "react-icons/io";
import { MdOutlineDashboard } from "react-icons/md";
import { GiNotebook } from "react-icons/gi";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { AiFillSetting } from "react-icons/ai";
import { MdSupportAgent } from "react-icons/md";
import "../layout.css";

const Sidebar = () => {
  return (
    <aside className="drawer">
      <div className="nav-title">MENU</div>
      <div className="navigation-sidebar">
        <div className="nav-links">
          <ul>
            <button>
              <Link className="nav-item active" to="/dashboard">
                <MdOutlineDashboard className="icon" />
                <span>Dashboard</span>
              </Link>
            </button>
            <button>
              <Link className="nav-item" to="/allcourses">
                <MdOutlineLibraryBooks className="icon" />
                <span>All Courses</span>
              </Link>
            </button>
            <button>
              <Link className="nav-item" to="/coursebuilder">
                <GiNotebook className="icon" />
                <span>Course Builder</span>
              </Link>
            </button>
            <button>
              <Link className="nav-item" to="/setting">
                <AiFillSetting className="icon" />
                <span>Settings</span>
              </Link>
            </button>
            <button>
              <Link className="nav-item" to="/Support">
                <MdSupportAgent className="icon" />
                <span>Support</span>
              </Link>
            </button>
            <button className="w-100">
              <Link
                className="nav-item"
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                <IoMdLogOut className="icon" />
                <span>Logout</span>
              </Link>
            </button>
          </ul>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
