import React from 'react'
import { Links } from 'react-router-dom'

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/all-courses">All Courses</Link>
      <Link to="/settings">Settings</Link>
      <Link
        to="/logout"
        onClick={() => {
          /* handle logout */
        }}
      >
        Logout
      </Link>
    </div>
  );
}

export default Sidebar