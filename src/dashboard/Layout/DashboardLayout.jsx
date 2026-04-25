import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardContent from "./DashboardContent";
import Sidebar from "../Layout/Sidebar/Sidebar";
import "./layout.css";
import AllCourse from "../courses/AllCourse";
import Coursebuilder from "../courses/Coursebuilder";
import SettingsPage from "../Layout/Sidebar/SettingsPage";

const DashboardLayout = ({ onLogout }) => {
  const handleLogout = () => {
    onLogout?.();
  };

  const [activeView, setActiveView] = useState("dashboard");
  const views = {
    dashboard: <DashboardContent />,
    allcourse: <AllCourse />,
    coursebuilder: <Coursebuilder />,
    settingsPage: <SettingsPage />,
  };

  return (
    <div
      className="dashboardlayout"
      style={{
        display: "flex",
        backgroundColor: "#6865650c",
        minHeight: "100dvh",
      }}
    >
      <DashboardHeader />
      <div className="main-dashboardlayout">
        <div className="sibarwraper">
          <Sidebar
            activeView={activeView}
            setActiveView={setActiveView}
            onLogout={handleLogout}
          />
        </div>
        <div className="content-wrap">
          {views[activeView] ?? <DashboardContent />}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
