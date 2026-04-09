import React from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import DashboardContent from "./DashboardContent";
import Sidebar from "../Layout/Sidebar/Sidebar";
import "./layout.css";

const DashboardLayout = () => {
  return (
    <div className="dashboardlayout">
      {/*header here */}
      <DashboardHeader />
      <div className="main-dashboardlayout">
        {/*Sidebar section start */}
        <div className="sibarwraper">
          <Sidebar />
        </div>
        <div className="content-wrap">
          {/**Main content here */}
          <DashboardContent />
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
