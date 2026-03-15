import React from "react";
import "./das.css";
export default function Dashboard() {
  return;
  <body>
    <div className="dashboard">
      {/*Movile overlay */}
      <div className="Movile-overlay"><h1>hey lukudu</h1></div>

      {/*header */}
      <header className="header"><h1>his dasboard</h1>
        <div className="header-left">
          <button className="mobile-toggle" id="menu tuggle">
            <i className="fas fa-bars"></i>
          </button>
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="search" name="search" id="" placeholder="search" />
          </div>
        </div>
        <div className="header-right"><p>ggggg</p></div>
      </header>

      {/* -- sidebar -- */}
      <aside className="sidebar"></aside>

      {/*--content-- */}
      <main className="content"></main>

      {/*--footer-- */}
      <footer className="footer"></footer>
    </div>
    ;
  </body>;
}
