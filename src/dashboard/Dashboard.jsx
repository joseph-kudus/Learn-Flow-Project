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
export default function Dashboard() {
  const { logout } = useAuth();
  console.log(logout);

  const handleLogout = () => {
    logout();
    Navigate("/login");
  };

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
      <aside className="sidebar">
        <div className="logo">
          <Notebook  className="logob"/>
          <p>LearnFlow</p>
        </div>
        <div className="nav-title">MENU</div>
        <div className="nav-links">
          <Link className="nav-item active">
            <LayoutDashboard />
            <span>Dashboard</span>
          </Link>
          <Link className="nav-item">
            <ScrollText />
            <span>All Courses</span>
          </Link>
          <Link className="nav-item">
            <PenLineIcon />
            <span>Course Builder</span>
          </Link>
          <Link className="nav-item" to="/settings">
            <Settings />
            <span>Settings</span>{" "}
          </Link>
          <Link className="nav-item">
            <HardDriveUpload />
            <span>Support</span>
          </Link>
          <Link className="nav-item">
            <button onClick={() => logout()}>
              <LogOut />
              <span>Logout</span>
            </button>
          </Link>
        </div>
      </aside>

      {/*--content-- */}
      <section className="content-section">
        {/*--Welecome Banner-- */}
        <Outlet />
        <h1>ler dfbfhsdh nsdbsdh</h1>
        <h5>jddfdg</h5>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
          laboriosam nisi aliquam quidem ad saepe, dolorem exercitationem magnam
          porro, velit, ullam facilis recusandae illum. Consequuntur delectus
          numquam magni ea blanditiis? Lorem, ipsum dolor sit amet consectetur
          adipisicing elit. Fuga ipsum iure incidunt unde neque molestias.
          Saepe, delectus temporibus eos dicta minus tempore fuga
          necessitatibus, tenetur, facere odit nulla? Corrupti, dignissimos.
        </p>
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
