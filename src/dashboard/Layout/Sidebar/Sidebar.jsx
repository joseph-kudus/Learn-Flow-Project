import { useAuth } from "../../../context/AuthContext";
import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import {
  MdSettings,
  MdSchool,
  MdOutlineBookOnline,
  MdExplore,
} from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { TbWorldSearch } from "react-icons/tb";
import { RiGraduationCapLine } from "react-icons/ri";
import { GrPerformance } from "react-icons/gr";
import { PiNotePencilBold } from "react-icons/pi";
import { LuUsers, LuBookText } from "react-icons/lu";

import { FaBook } from "react-icons/fa";
import UseuserRole from "../../UserData/UseuserRole";
import { FiDownload } from "react-icons/fi";

import yellowLogo from "../../../assets/learnflow-yellow.svg";
import blackLogo from "../../../assets/learnflow-black.svg";
import whiteLogo from "../../../assets/learnflow-white.svg";

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
  if (loading) {
    return (
      <aside className={`${className} sidebar-student`}>
        <div className="logo-wraper">Loading...</div>
      </aside>
    );
  }

  if (!user) return null;

  // Default to learner if role missing, and force lowercase
  const role = (user.role || "learner").toLowerCase();
  // logo colors to the roles
  const logos = {
    student: yellowLogo,
    learner: whiteLogo,
    instructor: blackLogo,
  };
  const logoSrc = logos[role] || blackLogo;

  const baseLinks = [
    { name: "Dashboard", path: "/dashboard", icon: RxDashboard, end: true },
  ];

  const learnerLinks = [
    {
      name: "Courses",
      path: "/dashboard/allcourses",
      icon: LuBookText,
    },

    {
      name: "Recommended Courses",
      path: "/dashboard/recomendedcourse",
      icon: LuUsers,
    },
    {
      name: "Achievements",
      path: "/dashboard/achievement",
      icon: RiGraduationCapLine,
    },

    { name: "Settings", path: "/dashboard/settings", icon: GrPerformance },
  ];
  const studentLinks = [
    {
      name: "Courses",
      path: "/dashboard/courses",
      icon: RxDashboard,
    },
    {
      name: "Explore",
      path: "/dashboard/explore",
      icon: TbWorldSearch,
    },

    {
      name: "Achievements",
      path: "/dashboard/achievement",
      icon: RiGraduationCapLine,
    },

    { name: "Settings", path: "/dashboard/setting", icon: GrPerformance },
    { name: "Support", path: "/dashboard/support", icon: MdSettings },
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
      icon: PiNotePencilBold,
    },
    { name: "Settings", path: "/dashboard/settings", icon: MdSettings },
  ];
  const roleLinks = {
    student: studentLinks,
    learner: learnerLinks,
    instructor: instructorLinks,
  };
  const links = [...baseLinks, ...(roleLinks[role] || [])];
  return (
    <aside className={`${className} sidebar-${role}`}>
      <div className="logo-wraper">
        <img src={logoSrc} alt="logo" className="logob" />
        <p>LearnFlow</p>
      </div>

      {role !== "student" && (
        <div className="nav-title">
          <h1>MENU</h1>
        </div>
      )}

      <nav className="nav-links">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.end}
            className={({ isActive }) => `dasff ${isActive ? "active" : ""}`}
          >
            <link.icon size={20} />
            {link.name}
          </NavLink>
        ))}
        <hr />
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
