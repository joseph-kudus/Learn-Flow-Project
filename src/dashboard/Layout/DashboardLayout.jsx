import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import DashboardHeader from "./DashboardHeader";
import "../Layout/layout.css";

function DashboardLayout({ onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboardlayout">
      <div className="container">
        <Sidebar
          className={`drawer ${sidebarOpen ? "open" : ""}`}
          onClose={() => setSidebarOpen(false)}
          onLogout={onLogout}
        />

        {sidebarOpen && (
          <div
            className="sidebar-overlay show"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="content-wrap">
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="main-content">
            <Outlet /> {/* This renders AllCourse, Courses, etc */}
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
