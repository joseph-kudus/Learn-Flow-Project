import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Loader2, LogOut } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import {
  MdDashboard,
  MdSettings,
  MdSchool,
  MdOutlineBookOnline,
} from "react-icons/md";
import { FaBook } from "react-icons/fa";

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.log(err);
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: MdDashboard, end: true },
    {
      to: "/dashboard/allcourses",
      label: "All Courses",
      icon: MdOutlineBookOnline,
    },
    { to: "/dashboard/coursebuilder", label: "Course Builder", icon: MdSchool },
    { to: "/dashboard/settings", label: "Settings", icon: MdSettings },
  ];

  return (
    <aside className="drawer">
      <div className="logo-wraper">
        <FaBook className="logob" />
        <p>LearnFlow</p>
      </div>

      <div className="nav-title">
        <h3>MENU</h3>
      </div>

      <nav className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              to={item.to}
              end={item.end}
              key={item.to}
              className={({ isActive }) => `dasff ${isActive ? "active" : ""}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="logout-section">
          <button
            className="dasff logout-btn"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 size={20} className="spin" />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut size={20} />
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
