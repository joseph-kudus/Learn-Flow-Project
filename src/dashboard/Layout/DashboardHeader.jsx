import { FaBook } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import SearchBox from "./SearchBox";
import kudus from "../../assets/images/20250821_160921.jpg";
import { toast } from "react-toastify";
function DashboardHeader() {
  const { currentUser } = useAuth();

  return (
    <>
      {/*}
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
      */}

      {/*new header*/}
      <div className="header">
        <div className="header-nav">
          <div className="logo-wraper">
            <FaBook className="logob" />
            <p>LearnFlow</p>
          </div>
          <SearchBox />

          <div className="MyAcc-wraper">
            <div className="myacc">
              <div className="userimg">
                <span className="round-circle">
                  <img src={kudus} alt="userimg" />
                </span>
              </div>
              <div className="userinfo">
                <h4>
                  <span>{currentUser.email}</span>
                </h4>
                <p>Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*new header*/}
    </>
  );
}
export default DashboardHeader;
