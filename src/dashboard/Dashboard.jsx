import React from "react";
import { Link, useNavigate } from "react-router-dom";
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

import {
  image1,
  unsplash,
  image2,
  image3,
  image4,
  image5,
} from "../assets/images/Myimg";
export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

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
          {currentUser ? (
            <div className="user-profile flex items-center text-sm text-gray-600">
              <User />
              <span>{currentUser.email}</span>
            </div>
          ) : (
            <p>welcome</p>
          )}
        </div>
      </header>
      {/* -- sidebar -- */}
      <Sidebar />
      {/*--content-- */}
      <section className="content-section">
        {/*--Welecome Banner-- */}
        <div className="welcome-banner">
          <div className="welcome-banner1">
            <h1>Welcome to Learnflow</h1>
            <p>
              Learn at your own pace with lifetime access on mobile and desktop
            </p>
          </div>

          <hr />
          <p>Let’s continue Learning!</p>
          <div className="course-conti">
            <div className="conti">
              <img src={unsplash} alt="img" />
              <div className="conti-q">
                <h3>Introduction to CSS language</h3>
                <p>Learn different programming languages and its usefulness</p>
              </div>
            </div>
            <div className="conti">
              <img src={image1} alt="imgs" />
              <div className="conti-q">
                <h3>Introduction to JavaScript language</h3>
                <p>Learn different programming languages and its usefulness</p>
              </div>
            </div>
          </div>
          <div className="experts">
            <h2>Languages courses</h2>
            <p>
              Chose from one over many of courses and learn with industry
              leading expert{" "}
            </p>
            <div className="expert-cart">
              <div className="card-wrap">
                <img src={image2} alt="to css" className="imgr" />
                <div className="expert1">
                  <div className="expert11">
                    <h1>Introduction to CSS language</h1>
                    <p>
                      Learn the basics of CSS, and its usefulness in the
                      programming world
                    </p>
                    <div className="ato">
                      <p>
                        By <strong>ATO</strong>
                      </p>
                      <p>
                        <strong>$29</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-wrap">
                <img src={image3} alt="to css" className="imgr" />
                <div className="expert1">
                  <div className="expert11">
                    <h1>Introduction to Python language</h1>
                    <p>
                      Learn the basics of python, and its usefulness in the
                      programming world
                    </p>
                    <div className="ato">
                      <p>
                        By <strong>ATO</strong>
                      </p>
                      <p>
                        <strong>$30</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="expert-cart">
              <div className="card-wrap">
                <img src={image5} alt="to css" className="imgr" />
                <div className="expert1">
                  <div className="expert11">
                    <h1>Introduction to Javascript language</h1>
                    <p>
                      Learn the basics of Javascript, and its usefulness in the
                      programming world
                    </p>
                    <div className="ato">
                      <p>
                        By <strong>ATO</strong>
                      </p>
                      <p>
                        <strong>$50</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-wrap">
                <img src={image4} alt="to css" className="imgr" />
                <div className="expert1">
                  <div className="expert11">
                    <h1>Introduction to HTML language</h1>
                    <p>
                      Learn the basics of HTML, and its usefulness in the
                      programming world
                    </p>
                    <hr />
                    <div className="ato">
                      <p>
                        By <strong>ATO</strong>
                      </p>
                      <p>
                        <strong>$35</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className="News">view all courses</button>
          </div>
        </div>
      </section>
      {/*--footer-- 
      <footer className="footer"></footer> */}
    </div>
  );
}
