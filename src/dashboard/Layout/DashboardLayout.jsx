import React from "react";
import { Outlet } from "react-router-dom";
import "../Layout/layout.css";
import Sidebar from "./Sidebar/Sidebar";
import DashboardHeader from "./DashboardHeader";

function DashboardLayout() {
  return (
    <div className="dashboardlayout">
      <div className="container">
        <Sidebar />
        <div className="content-wrap">
          <DashboardHeader />
          <main className="main-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
