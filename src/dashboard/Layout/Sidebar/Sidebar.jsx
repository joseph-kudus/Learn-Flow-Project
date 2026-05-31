import { BookIcon, HomeIcon, Loader2, LogOut, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import {
  MdDashboard,
  MdSettings,
  MdSchool,
  MdOutlineBookOnline,
  MdExplore,
} from "react-icons/md";
import { RiGraduationCapLine } from "react-icons/ri";
import { GrPerformance } from "react-icons/gr";

import { FaBook } from "react-icons/fa";
import UseuserRole from "../../UserData/UseuserRole";
import { FiDownload } from "react-icons/fi";

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

  const { user, loading } = UseuserRole();
  if (loading) return <div>Loading Sidebar</div>;
  if (!user) return <div>No user</div>;

  // Default to student if role missing, and force lowercase
  const role = (user.role || "student").toLowerCase();

  const baseLinks = [
    { name: "Dashboard", path: "/dashboard", icon: MdDashboard, end: true },
  ];

  const studentLinks = [
    {
      name: "Courses",
      path: "/course",
      icon: MdSchool,
    },
    {
      name: "Recommended Course",
      path: "/dashboard/explore",
      icon: MdExplore,
    },
    {
      name: "Achievements",
      path: "/dashboard/achievements",
      icon: RiGraduationCapLine,
    },

    { name: "Settings", path: "/dashboard/settings", icon: GrPerformance },
    
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
    { name: "Settings", path: "/dashboard/settings", icon: MdSettings },
  ];

  const links = [
    ...baseLinks,
    ...(role === "student" ? studentLinks : []),
    ...(role === "instructor" ? instructorLinks : []),
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

      <nav className="nav-links">
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
                <FiDownload size={20} />
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
