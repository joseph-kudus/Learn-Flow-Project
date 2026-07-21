import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Loader2, LogOut, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import UseuserRole from "../../hooks/UseuserRole";
import { RxDashboard } from "react-icons/rx";
import { TbWorldSearch } from "react-icons/tb";
import { RiGraduationCapLine } from "react-icons/ri";
import { GrPerformance } from "react-icons/gr";
import { PiNotePencilBold } from "react-icons/pi";
import { LuUsers, LuBookText } from "react-icons/lu";
import { MdSettings, MdOutlineBookOnline } from "react-icons/md";
import Stars from "../../component/common/Stars";
import yellowLogo from "../../assets/learnflow-yellow.svg";
import whiteLogo from "../../assets/learnflow-white.svg";
import blackLogo from "../../assets/learnflow-black.svg";
const Sidebar = ({ className = "", onClose, onLogout }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user, loading } = UseuserRole();
  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
      onLogout?.();
      navigate("/login");
    } catch (error) {
      console.error(error);
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <aside className={`drawer ${className} sidebar-student`}>
        <div className="logo-wraper">Loading...</div>
      </aside>
    );
  }
  if (!user) return null;
  const role = (user.role || "learner").toLowerCase();
  
  const logos = {
    student: yellowLogo,
    learner: blackLogo,
    instructor: blackLogo,
  };
  
  
  
  const links = {
    learner: [
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
      {
        name: "Settings",
        path: "/dashboard/settings",
        icon: GrPerformance,
      },
    ],
    student: [
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
      {
        name: "Settings",
        path: "/dashboard/setting",
        icon: GrPerformance,
      },
      {
        name: "Support",
        path: "/dashboard/support",
        icon: MdSettings,
      },
    ],
    instructor: [
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
      {
        name: "Settings",
        path: "/dashboard/settings",
        icon: MdSettings,
      },
    ],
  };

  const menuLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: RxDashboard,
      end: true,
    },
    ...(links[role] || []),
  ];

  return (
    <aside className={`drawer ${className} sidebar-${role}`}>
      <div className="logo-wraper">
        <img src={logos[role]} alt="LearnFlow" className="logob" />

        <p>LearnFlow</p>
      </div>

      <button className="nav_close" onClick={onClose}>
        <X size={30} color="#ffffff" />
      </button>
      {role !== "student" && (
        <div className="nav-title">
          <h1>MENU</h1>
        </div>
      )}

      <nav className="nav-links">
        {menuLinks.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => `dasff ${isActive ? "active" : ""}`}
            >
              <Icon size={20} />

              <span>{item.name}</span>
            </NavLink>
          );
        })}

        <hr />

        {role === "learner" && <Stars />}

        <button
          className="dasff logout-btn"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
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
      </nav>
    </aside>
  );
};

export default Sidebar;
