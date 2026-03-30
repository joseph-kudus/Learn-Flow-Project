import { Bell, MoonIcon, SearchIcon, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function DashboardHeader() {
  const { currentUser } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <div className="search-bar">
          <SearchIcon />
          <input type="text" placeholder="search....." />
        </div>
      </div>
      <div className="header-right">
        <button className="theme-toggle" id="theme-Toggle">
          <MoonIcon />
        </button>
        <div className="notification">
          <Bell />
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
  );
}
export default DashboardHeader;
