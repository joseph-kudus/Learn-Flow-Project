import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import defaultAvatar from "../../assets/images/default.png";
import SearchBox from "./SearchBox";

import { Menu } from "lucide-react";
import { IoIosArrowDown, IoIosNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { RiAccountBoxFill } from "react-icons/ri";
import { SlSettings } from "react-icons/sl";

function DashboardHeader({ onMenuClick }) {
  const { currentUser, userData, loading } = useAuth();

  const [open, setOpen] = useState(false);

  const [openNotification, setOpenNotification] = useState(false);

  const dropdownRef = useRef(null);

  const notificationRef = useRef(null);

  useEffect(() => {
    const closeDropdowns = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setOpenNotification(false);
      }
    };

    document.addEventListener("mousedown", closeDropdowns);

    return () => {
      document.removeEventListener("mousedown", closeDropdowns);
    };
  }, []);

  if (loading) {
    return <div className="header-skeleton">Loading...</div>;
  }

  if (!currentUser) return null;

  const role = (userData?.role || "learner").toLowerCase();

  const displayName =
    userData?.nickname ||
    userData?.firstName ||
    userData?.username ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "User";

  const avatar = userData?.photoURL || currentUser?.photoURL || defaultAvatar;

  return (
    <header className="header">
      <div className="header-nav">
        {/* LEFT SIDE */}

        <div className="header-left">
          <button
            className="hamburger"
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>

          {(role === "student" || role === "learner") && <SearchBox />}
        </div>

        {/* RIGHT SIDE */}

        <div className="header-right">
          {role === "student" && (
            <div className="notification-wrapper" ref={notificationRef}>
              <button
                className="notification-btn"
                type="button"
                onClick={() => {
                  setOpen(false);

                  setOpenNotification((prev) => !prev);
                }}
              >
                <IoIosNotificationsOutline size={28} />
              </button>

              {openNotification && (
                <div className="notification-header-drop">
                  <div className="notification-header">
                    <h1>Notifications</h1>

                    <SlSettings />
                  </div>

                  <div className="notification-steps-btn">
                    <button>All</button>

                    <button>Courses</button>

                    <button>Updates</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* USER */}

          <div className="MyAcc-wraper" ref={dropdownRef}>
            <div className="myacc">
              <Link to="/dashboard/profilesetting" className="userinfo-link">
                <div className="userinfo">
                  <h4>{displayName}</h4>

                  <p>{role}</p>
                </div>

                <div className="userimg">
                  <img
                    src={avatar}
                    alt={displayName}
                    onError={(e) => {
                      e.currentTarget.src = defaultAvatar;
                    }}
                  />
                </div>
              </Link>

              {role === "student" && (
                <button
                  className="dropdown-toggle"
                  onClick={() => {
                    setOpenNotification(false);

                    setOpen((prev) => !prev);
                  }}
                >
                  <IoIosArrowDown size={28} color="grey" />
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
                      <RiAccountBoxFill />
                      My Account
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/dashboard/settings"
                      onClick={() => setOpen(false)}
                    >
                      <IoSettingsOutline />
                      Settings
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
