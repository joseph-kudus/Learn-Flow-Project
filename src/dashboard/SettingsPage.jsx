import { Building, Building2, Home, LogsIcon, LucideClipboardPlus, Search,
   Settings, SunDim, SunDimIcon, User2Icon,
    UserRound } from 'lucide-react';


function SettingsPage() {
  return (
    <div className="dashboard">
      <nav className="sidebar">
        <div className="logo">
          <div className="logoicon">
            <LogsIcon />
          </div>
          <span>kudovia</span>
        </div>
        <ul>
          <li className="active">
            <Home />
            <span>Dashboard</span>
          </li>
          <li className="active">
            <Building2 />
            <span>Analytic</span>
          </li>
          <li className="active">
            <Settings />
            <span>Setting</span>
          </li>
        </ul>
        <div className="user-profile">
          <UserRound />
        </div>
      </nav>
      <div className="main-content">
        <header>
          <div className="search-bar">
            <Search />
            <input type="text" id="searchinput" placeholder="search ,,,,,," />
          </div>
          <div className="header-action">
            <button id="themetoggle" className="themetoggle">
              <SunDimIcon />
              <SunDim />
            </button>
            <button className='btn-primary'>
              <LucideClipboardPlus/>
              <span>Load Users</span>
            </button>
          </div>
        </header>
        <div className="user-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <User2Icon/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage