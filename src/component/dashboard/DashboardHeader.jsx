import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import defaultAvatar from "../../assets/images/default.png";
import SearchBox from "../common/SearchBox";

import { Menu } from "lucide-react";
import { IoIosArrowDown, IoIosNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { RiAccountBoxFill } from "react-icons/ri";

import Button from "../ui/Button/Button";

import {
  subscribeToUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notification/notificationService";

/* ======================================================
   FORMAT NOTIFICATION TIME
====================================================== */

const formatNotificationTime = (timestamp) => {
  if (!timestamp) {
    return "";
  }

  let date;

  try {
    if (timestamp?.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    if (Number.isNaN(date.getTime())) {
      return "";
    }
  } catch (error) {
    return "";
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "Just now";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? "min" : "mins"} ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
};

/* ======================================================
   DATE GROUP HELPER
====================================================== */

const getNotificationDateKey = (timestamp) => {
  if (!timestamp) {
    return "other";
  }

  let date;

  try {
    if (timestamp?.toDate) {
      date = timestamp.toDate();
    } else {
      date = new Date(timestamp);
    }

    if (Number.isNaN(date.getTime())) {
      return "other";
    }
  } catch (error) {
    return "other";
  }

  return date.toISOString().split("T")[0];
};

const formatNotificationDate = (dateKey) => {
  if (!dateKey || dateKey === "other") {
    return "";
  }

  const date = new Date(`${dateKey}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const today = new Date();
  const todayKey = today.toISOString().split("T")[0];

  if (dateKey === todayKey) {
    return "Today";
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const yesterdayKey = yesterday.toISOString().split("T")[0];

  if (dateKey === yesterdayKey) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
};

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

  const [showAllNotifications, setShowAllNotifications] = useState(false);

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
      setLoadingNotifications(false);
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
     NOTIFICATION COUNTS
  ====================================================== */

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const courseCount = notifications.filter(
    (notification) => notification.type === "course",
  ).length;

  const updateCount = notifications.filter(
    (notification) => notification.type === "update",
  ).length;

  /* ======================================================
     FILTER NOTIFICATIONS
  ====================================================== */

  const filteredNotifications =
    notificationFilter === "all"
      ? notifications
      : notifications.filter(
          (notification) => notification.type === notificationFilter,
        );

  /* ======================================================
     LIMIT / EXPAND NOTIFICATIONS
  ====================================================== */

  const visibleNotifications = showAllNotifications
    ? filteredNotifications
    : filteredNotifications.slice(0, 4);

  /* ======================================================
     GROUP NOTIFICATIONS BY DATE
  ====================================================== */

  const groupedNotifications = visibleNotifications.reduce(
    (groups, notification) => {
      const dateKey = getNotificationDateKey(notification.createdAt);

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(notification);

      return groups;
    },
    {},
  );

  /* ======================================================
     NOTIFICATION HANDLERS
  ====================================================== */

  const handleNotificationToggle = () => {
    setOpen(false);

    setOpenNotification((previous) => !previous);
  };

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
    if (!currentUser?.uid) {
      console.error("Cannot mark notifications as read: no user.");
      return;
    }

    if (unreadCount === 0) {
      return;
    }

    try {
      const result = await markAllNotificationsAsRead(currentUser.uid);

      console.log("Mark all as read result:", result);

      if (result?.success) {
        setNotifications((previous) =>
          previous.map((notification) => ({
            ...notification,
            read: true,
          })),
        );
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleSeeAllNotifications = () => {
    setShowAllNotifications((previous) => !previous);
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
                onClick={handleNotificationToggle}
              />

              {/* UNREAD COUNT */}

              {unreadCount > 0 && (
                <span className="notification-count">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}

              {/* ==================================================
                  NOTIFICATION DROPDOWN
              ================================================== */}

              {openNotification && (
                <div className="notification-header-drop">
                  {/* HEADER */}

                  <div className="notification-header">
                    <h1>Notifications</h1>
                  </div>

                  {/* FILTERS */}

                  <div className="notification-steps-btn">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={notificationFilter === "all" ? "active" : ""}
                      onClick={() => setNotificationFilter("all")}
                    >
                      <span>All</span>
                      <strong>{notifications.length}</strong>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={
                        notificationFilter === "course" ? "active" : ""
                      }
                      onClick={() => setNotificationFilter("course")}
                    >
                      <span>Courses</span>
                      <strong>{courseCount}</strong>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={
                        notificationFilter === "update" ? "active" : ""
                      }
                      onClick={() => setNotificationFilter("update")}
                    >
                      <span>Updates</span>
                      <strong>{updateCount}</strong>
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
                      Object.entries(groupedNotifications).map(
                        ([dateKey, groupedItems]) => (
                          <div key={dateKey} className="notification-group">
                            {/* DATE */}

                            {dateKey !== "other" && (
                              <div className="notification-date">
                                {formatNotificationDate(dateKey)}
                              </div>
                            )}

                            {/* NOTIFICATIONS */}

                            {groupedItems.map((notification) => (
                              <button
                                type="button"
                                key={notification.id}
                                className={`notification-item ${
                                  !notification.read ? "unread" : ""
                                }`}
                                onClick={() =>
                                  handleNotificationClick(notification)
                                }
                              >
                                <div className="notification-content">
                                  <h4>{notification.title || "LearnFlow"}</h4>

                                  <p>{notification.message}</p>

                                  <span className="notification-time">
                                    {formatNotificationTime(
                                      notification.createdAt,
                                    )}
                                  </span>
                                </div>

                                {!notification.read && (
                                  <span className="notification-unread-dot" />
                                )}
                              </button>
                            ))}
                          </div>
                        ),
                      )
                    )}
                  </div>

                  {/* FOOTER */}

                  <div className="notify_container">
                    <div className="notify-wrapper">
                      <button
                        type="button"
                        className="notify-wrapperb"
                        onClick={handleMarkAllRead}
                        disabled={unreadCount === 0}
                      >
                        Mark all as read
                      </button>
                    </div>

                    <div className="notify-wrapper">
                      <button
                        type="button"
                        className="notify-wrapperb"
                        onClick={handleSeeAllNotifications}
                      >
                        {showAllNotifications
                          ? "Show Less"
                          : "See All Notifications"}
                      </button>
                    </div>
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
