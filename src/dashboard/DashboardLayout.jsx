import React from 'react'
import Sidebar from '../Sidebar/Sidebar'
import {Outlet} from "react-router-dom"
import DashboardHeader from './DashboardHeader';

const DashboardLayout = () => {
  return (
      <div className="flex">
          <DashboardHeader/>
      <div className="p-4 border-b bg-white">
      </div>
      <Sidebar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout
