import React from "react";
import { Link } from "react-router-dom";
import "./das.css";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import {
  Bell,
  HardDriveUpload,
  LayoutDashboard,
  LogOut,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  Notebook,
  NotebookPen,
  NotebookPenIcon,
  NotebookTabsIcon,
  PenLineIcon,
  ScrollIcon,
  ScrollText,
  SearchIcon,
  Settings,
  ToggleRight,
  User,
  UserIcon,
} from "lucide-react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

export default function Dashboard() {
  return (
    <div className="dashboard">
      {/*Movile overlay */}
      <div className="Movile-overlay"></div>
      {/*header */}
      <header className="header">
        <div className="header-left">
          <button className="theme-toggle" id="menuToggle">
            <i className="fas fa-bars"></i>
          </button>
          <div className="search-bar">
            <i className="fas fa-search">
              <SearchIcon />
            </i>
            <input type="text" placeholder="search....." />
          </div>
        </div>
        <div className="header-right">
          <button className="theme-toggle" id="theme-Toggle">
            <i className="fas fas-moon">
              <MoonIcon />
            </i>
          </button>
          <div className="notification">
            <i className="fas fas-bell">
              <Bell />
            </i>
            <span className="notification-bag">3</span>
          </div>
          <div className="user-profile">
            <User />
          </div>
        </div>
      </header>
      {/* -- sidebar -- */}
      <Sidebar />
      {/*--content-- */}
      <section className="content-section">
        {/*--Welecome Banner-- */}
        <div className="welcome-banner">
          <h1>Welcome to Learnflow</h1>
          <p>Learn at your own pace...</p>
        </div>
        <h1>ler dfbfhsdh nsdbsdh</h1>
        <h5>jddfdg</h5>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora
          nesciunt possimus eligendi nobis architecto expedita hic magni, illo
          commodi voluptas? Beatae similique quasi porro quaerat magni?
          Dignissimos neque nulla accusamus? Lorem ipsum dolor sit, amet
          consectetur adipisicing elit. Veritatis, iste. Veritatis perspiciatis
          reiciendis nobis porro est molestiae, libero quod quos quibusdam iste
          veniam ducimus vitae. Quasi similique dolor dolorem doloremque. Lorem
          ipsum, dolor sit amet consectetur adipisicing elit. Fugit ab ad
          laudantium placeat enim aliquam nisi voluptatem tempora non porro
          inventore libero eveniet, nemo repellendus reiciendis ipsam adipisci
          qui dicta.
        </p>
        <h3>iiururherh</h3>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt
          eaque doloremque reprehenderit reiciendis enim adipisci, excepturi
          quaerat soluta libero nemo voluptates odit distinctio quo quibusdam et
          ullam suscipit nulla expedita?
        </p>
      </section>
      {/*--footer-- */}
      <footer className="footer"></footer>
    </div>
  );
}
