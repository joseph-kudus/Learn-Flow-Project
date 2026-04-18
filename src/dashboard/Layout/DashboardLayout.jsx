import React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardContent from "./DashboardContent";
import Sidebar from "../Layout/Sidebar/Sidebar";
import "./layout.css";
import AllCourse from "../courses/AllCourse";
import coursebulder from "../courses/Coursebuilder";
import SettingsPage from "../Layout/Sidebar/SettingsPage"
import { GrDashboard } from "react-icons/gr";

const DashboardLayout = () => {
  const [activeView, setActiveView]=useState('dashboard');

  const views={
    dashboard: <DashboardContent/>,
    allcourse: <AllCourse/>,
    coursebulder: <coursebulder/>,
    settingsPage: <SettingsPage/>,
  };
  return (
    <div className="dashboardlayout" style={{display:'flex', backgroundColor: 'yellow', minHeight: '100dvh'}}>
      {/*header here */}
      <DashboardHeader />
      <div className="main-dashboardlayout">
        {/*Sidebar section start */}
        <div className="sibarwraper"  >
          <Sidebar activeView={activeView}setActiveView={setActiveView} />
        </div>
        <div className="content-wrap" >
          {/**Main content here */}
          {views[activeView]}
          {/*Footer section start */}
          {/*Footer section end */}
        </div>
      </div>
    </div>
  );
  {
    /*
        <div className="flex">
          <DashboardHeader/>
      <div className="p-4 border-b bg-white">
      </div>
      <Sidebar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
    */
  }
};
export default DashboardLayout;
