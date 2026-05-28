import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import "../Layout/layout.css";
import Sidebar from "./Sidebar/Sidebar";
import DashboardHeader from "./DashboardHeader";

function DashboardLayout({ onLogout }) {
  const location = useLocation();

  // Derive active view from URL so sidebar highlights correctly
  const getActiveView = () => {
    const path = location.pathname;
    if (path.includes("/dashboard/coursebuilder")) return "coursebuilder";
    if (path.includes("/dashboard/allcourses")) return "allcourse";
    if (path.includes("/dashboard/settings")) return "settingsPage";
    return "dashboard";
  };

  const activeView = getActiveView();

  return (
    <div className="dashboardlayout">
      <div className="container">
        <Sidebar activeView={activeView} onLogout={onLogout} />
        <div className="content-wrap">
          <DashboardHeader />
          <main className="main-content">
            <Outlet /> {/* Nested routes render here */}
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
