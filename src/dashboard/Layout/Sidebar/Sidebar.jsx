import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdSettings,
  MdSchool,
  MdOutlineBookOnline,
} from "react-icons/md";
import { FaBook } from "react-icons/fa";

const Sidebar = ({ activeView, setActiveView, onLogout }) => {
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

  const navitems = [
    { id: "dashboard", label: "Dashboard", icon: MdDashboard },
    { id: "allcourse", label: "All Course", icon: MdOutlineBookOnline },
    { id: "coursebuilder", label: "Course Builder", icon: MdSchool },
    { id: "settingsPage", label: "Settings", icon: MdSettings },
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
        {navitems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              className={`dasff ${isActive ? "active" : ""}`}
              key={item.id}
              onClick={() => setActiveView(item.id)}
              disabled={isLoggingOut}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
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
