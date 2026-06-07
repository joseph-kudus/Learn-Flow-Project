import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import defaultAvatar from "../../assets/images/default.png";
import SearchBox from "./SearchBox";
import { useState, useRef, useEffect } from "react";
import { IoIosArrowDown, IoIosNotificationsOutline } from "react-icons/io";
import { RiAccountBoxFill } from "react-icons/ri";
import { IoSettingsOutline } from "react-icons/io5";

function DashboardHeader() {
  const { currentUser, userData, loading } = useAuth();

  if (loading) return <div className="header-skeleton">Loading...</div>;
  if (!currentUser) return null;

  // Default to student and force lowercase
  const role = (userData?.role || "student").toLowerCase();

  const displayName =
    userData?.nickname ||
    userData?.firstName ||
    userData?.username ||
    currentUser.email?.split("@")[0] ||
    "User";

  const avatar = userData?.photoURL || currentUser.photoURL || defaultAvatar;

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="header">
      <div className="header-nav">
        <div className="header-left">
          {/* Show search bar only for students */}
          {role === "student" && <SearchBox />}
        </div>
        <div className="header-right">
          {role === "student" && (
            <div className="notification-wrapper">
              <button className="notification-btn">
                <IoIosNotificationsOutline size={28} />
              </button>
            </div>
          )}

          {/* Notification only show to students */}

          <div className="MyAcc-wraper" ref={dropdownRef}>
            <div className="myacc">
              <div to="/dashboard/setting" className="userinfo-link">
                <div className="userinfo">
                  <h4>{displayName}</h4>
                  <p>{role}</p>
                </div>

                <div className="userimg">
                  <img
                    src={avatar}
                    alt="avatar"
                    onError={(e) => {
                      e.target.src = defaultAvatar;
                    }}
                  />
                </div>
              </div>

              {role === "student" && (
                <button
                  className="dropdown-toggle"
                  onClick={() => setOpen((prev) => !prev)}
                >
                  <IoIosArrowDown color="grey" size={30} />
                </button>
              )}
            </div>

            {open && (
              <div className="acc-setting">
                <ul>
                  <li>
                    <Link
                      to="/dashboard/setting"
                      onClick={() => setOpen(false)}
                    >
                      <RiAccountBoxFill/>
                      My Account
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/dashboard/settings"
                      onClick={() => setOpen(false)}
                    >
                      <IoSettingsOutline/>
                      Settings
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
