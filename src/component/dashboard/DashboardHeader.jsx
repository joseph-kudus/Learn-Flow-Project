import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import defaultAvatar from "../../assets/images/default.png";
import SearchBox from "../common/SearchBox";

import { Menu } from "lucide-react";
import { IoIosArrowDown, IoIosNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { RiAccountBoxFill } from "react-icons/ri";
import { SlSettings } from "react-icons/sl";

import Button from "../ui/Button/Button";

import {
  subscribeToUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notification/notificationService";

function DashboardHeader({ onMenuClick }) {
  const { currentUser, userData, loading } = useAuth();

  /* ======================================================
     STATE
  ====================================================== */

  const [open, setOpen] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [notificationFilter, setNotificationFilter] = useState("all");
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  /* ======================================================
     REFS
  ====================================================== */

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  /* ======================================================
     CLOSE DROPDOWNS
  ====================================================== */

  useEffect(() => {
    const closeDropdowns = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpenNotification(false);
      }
    };

    document.addEventListener("mousedown", closeDropdowns);

    return () => {
      document.removeEventListener("mousedown", closeDropdowns);
    };
  }, []);

  /* ======================================================
     REAL-TIME NOTIFICATIONS
  ====================================================== */

  useEffect(() => {
    if (!currentUser?.uid) {
      setNotifications([]);
      return;
    }

    setLoadingNotifications(true);

    const unsubscribe = subscribeToUserNotifications(
      currentUser.uid,
      (data) => {
        setNotifications(data);
        setLoadingNotifications(false);
      },
      (error) => {
        console.error("Failed to subscribe to notifications:", error);

        setNotifications([]);
        setLoadingNotifications(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [currentUser?.uid]);

  /* ======================================================
     LOADING / AUTH
  ====================================================== */

  if (loading) {
    return <div className="header-skeleton">Loading...</div>;
  }

  if (!currentUser) {
    return null;
  }

  /* ======================================================
     USER DATA
  ====================================================== */

  const role = (userData?.role || "learner").toLowerCase();

  const displayName =
    userData?.nickname ||
    userData?.firstName ||
    userData?.username ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "User";

  const avatar = userData?.photoURL || currentUser?.photoURL || defaultAvatar;

  /* ======================================================
     NOTIFICATION DATA
  ====================================================== */

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const filteredNotifications =
    notificationFilter === "all"
      ? notifications
      : notifications.filter(
          (notification) => notification.type === notificationFilter,
        );

  /* ======================================================
     NOTIFICATION HANDLERS
  ====================================================== */

  const handleNotificationClick = async (notification) => {
    if (notification.read) {
      return;
    }

    try {
      await markNotificationAsRead(notification.id);

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                read: true,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.read,
    );

    if (unreadNotifications.length === 0) {
      return;
    }

    try {
      await markAllNotificationsAsRead(notifications);

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          read: true,
        })),
      );
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <header className="header">
      <div className="header-nav">
        {/* ==================================================
            LEFT SIDE
        ================================================== */}

        <div className="header-left">
          <Button
            variant="ghost"
            size="md"
            leftIcon={<Menu size={24} />}
            className="hamburger"
            aria-label="Open menu"
            onClick={onMenuClick}
          />

          {(role === "student" || role === "learner") && <SearchBox />}
        </div>

        {/* ==================================================
            RIGHT SIDE
        ================================================== */}

        <div className="header-right">
          {/* ==================================================
              NOTIFICATIONS
          ================================================== */}

          {role === "student" && (
            <div className="notification-wrapper" ref={notificationRef}>
              <Button
                type="button"
                variant="ghost"
                size="md"
                leftIcon={<IoIosNotificationsOutline size={25} />}
                className="notification-btn"
                aria-label="Open notifications"
                aria-expanded={openNotification}
                onClick={() => {
                  setOpen(false);
                  setOpenNotification((previous) => !previous);
                }}
              />

              {/* UNREAD COUNT */}

              {unreadCount > 0 && (
                <span className="notification-count">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}

              {/* NOTIFICATION DROPDOWN */}

              {openNotification && (
                <div className="notification-header-drop">
                  {/* HEADER */}

                  <div className="notification-header">
                    <h1>Notifications</h1>

                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      title="Mark all as read"
                      disabled={unreadCount === 0}
                    >
                      <SlSettings />
                    </button>
                  </div>

                  {/* FILTERS */}

                  <div className="notification-steps-btn">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNotificationFilter("all")}
                    >
                      All
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNotificationFilter("course")}
                    >
                      Courses
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNotificationFilter("update")}
                    >
                      Updates
                    </Button>
                  </div>

                  {/* NOTIFICATION LIST */}

                  <div className="notification-list">
                    {loadingNotifications ? (
                      <p className="notification-empty">
                        Loading notifications...
                      </p>
                    ) : filteredNotifications.length === 0 ? (
                      <p className="notification-empty">
                        No notifications yet.
                      </p>
                    ) : (
                      filteredNotifications.map((notification) => (
                        <button
                          type="button"
                          key={notification.id}
                          className={`notification-item ${
                            !notification.read ? "unread" : ""
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div>
                            <h4>{notification.title}</h4>

                            <p>{notification.message}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================
              USER
          ================================================== */}

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
                    onError={(event) => {
                      event.currentTarget.src = defaultAvatar;
                    }}
                  />
                </div>
              </Link>

              {role === "student" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  leftIcon={<IoIosArrowDown size={28} />}
                  className="dropdown-toggle"
                  aria-label="Open account menu"
                  aria-expanded={open}
                  onClick={() => {
                    setOpenNotification(false);
                    setOpen((previous) => !previous);
                  }}
                />
              )}
            </div>

            {/* ACCOUNT DROPDOWN */}

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
