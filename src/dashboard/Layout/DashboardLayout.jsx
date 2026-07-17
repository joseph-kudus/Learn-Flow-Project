import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar/Sidebar";
import DashboardHeader from "./DashboardHeader";

import "../Layout/layout.css";

function DashboardLayout({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Close sidebar when screen becomes desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1199) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

  // Close drawer with ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="dashboardlayout">
      <div className="container">
        <Sidebar
          className={`drawer ${sidebarOpen ? "open" : ""}`}
          onClose={closeSidebar}
          onLogout={onLogout}
        />

        {sidebarOpen && (
          <div className="sidebar-overlay show" onClick={closeSidebar} />
        )}

        <div className="content-wrap">
          <DashboardHeader onMenuClick={openSidebar} />

          <main className="main-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
