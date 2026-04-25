import { useState } from "react";
import { Loader2, LogOut } from "lucide-react"; 
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../layout.css";
import {
  MdDashboard,
  MdSettings,
  MdSchool,
  MdOutlineBookOnline,
} from "react-icons/md";

const Sidebar = ({ activeView, setActiveView }) => {
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

  const navitems = [
    { id: "dashboard", label: "Dashboard", icon: MdDashboard },
    { id: "allcourse", label: "All course", icon: MdOutlineBookOnline },
    { id: "coursebuilder", label: "Course builder", icon: MdSchool },
    { id: "settingsPage", label: "Settings", icon: MdSettings },
  ];

  return (
    <aside
      className="drawer"
      style={{ maxWidth: "220px", width: "100%", backgroundColor: "#dee0e2" }}
    >
      <div className="nav-title">
        <h3>MENU</h3>
      </div>

      <div className="nav-links">
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
              {Icon && <Icon size={20} />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

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
    </aside>
  );
};
export default Sidebar;
