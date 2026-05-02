import React, { useState } from "react";

import AllCourse from "../courses/AllCourse";
import Coursebuilder from "../courses/Coursebuilder";
import SettingsPage from "../Layout/Sidebar/SettingsPage";
import "../Layout/layout.css";
import Sidebar from "./Sidebar/Sidebar";
import DashboardHeader from "./DashboardHeader";
import DashboardContent from "./DashboardContent";

function DashboardLayout({ onLogout }) {
  const [activeView, setActiveView] = useState("dashboard");

  const views = {
    dashboard: <DashboardContent />,
    allcourse: <AllCourse />,
    coursebuilder: <Coursebuilder />,
    settingsPage: <SettingsPage />,
  };

  return (
    <div className="dashboardlayout">
      <div className="container">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          onLogout={onLogout}
        />
        <div className="content-wrap">
          <DashboardHeader />
          <main className="main-content">
            {views[activeView] ?? <DashboardContent />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
