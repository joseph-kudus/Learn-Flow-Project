import { BookIcon, HomeIcon, Loader2, LogOut, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import {
  MdDashboard,
  MdSettings,
  MdSchool,
  MdOutlineBookOnline,
} from "react-icons/md";
import { FaBook } from "react-icons/fa";
import UseuserRole from "../../UserData/UseuserRole";

const Sidebar = ({ className, onClose, onLogout }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      onLogout?.();
      navigate("/login");
    } catch (err) {
      console.log(err);
      setIsLoggingOut(false);
    }
  };

  const { user } = UseuserRole();

  const baseLinks = [
    { name: "Dashboard", path: "/dashboard", icon: MdDashboard, end: true },
    { name: "Settings", path: "/dashboard/settings", icon: MdSettings },
  ];

  const studentLinks = [
    {
      name: "My Courses",
      path: "/course",
      icon: MdSchool
    },
    {
      name: "All Courses",
      path: "/dashboard/allcourses",
      icon: MdOutlineBookOnline,
    },
  ];
  const instructorLinks = [
    {
      name: "All Courses",
      path: "/dashboard/allcourses",
      icon: MdOutlineBookOnline,
    },
    {
      name: "Course Builder",
      path: "/dashboard/coursebuilder",
      icon: MdSchool,
    },
  ];

  const links = [
    ...baseLinks,
    ...(user?.role === "student" ? studentLinks : []),
    ...(user?.role === "Instructor" ? instructorLinks : []),
  ];

  const navitems = [
    { path: "/dashboard", label: "Dashboard", icon: MdDashboard, end: true },
    {
      path: "/dashboard/allcourses",
      label: "All Course",
      icon: MdOutlineBookOnline,
    },
    {
      path: "/dashboard/coursebuilder",
      label: "Course Builder",
      icon: MdSchool,
    },
    { path: "/dashboard/settings", label: "Settings", icon: MdSettings },
  ];

  return (
    <aside className={className}>
      <div className="logo-wraper">
        <FaBook className="logob" />
        <p>LearnFlow</p>
      </div>

      <div className="nav-title">
        <h1>MENU</h1>
      </div>
      {/*using role base*/}
      <nav nav-links>
        {links.map((link) => (
          <NavLink
            className={({ isActive }) => `dasff ${isActive ? "active" : ""}`}
            key={link.path}
            to={link.path}
          >
            <link.icon size={20} />
            {link.name}
          </NavLink>
        ))}
      </nav>

      <nav className="nav-links">
        {navitems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              to={item.path}
              end={item.end}
              className={({ isActive }) => `dasff ${isActive ? "active" : ""}`}
              key={item.path}
            >
              <Icon size={30} />
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
