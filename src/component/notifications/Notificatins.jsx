
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import {
  subscribeToUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notification/notificationService";

function Notifications() {
  const { currentUser } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  /* ======================================================
     REAL-TIME NOTIFICATIONS
  ====================================================== */

  useEffect(() => {
    if (!currentUser?.uid) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeToUserNotifications(
      currentUser.uid,
      (data) => {
        setNotifications(data);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load notifications:", error);
        setNotifications([]);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);

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
    filter === "all"
      ? notifications
      : notifications.filter(
          (notification) => notification.type === filter,
        );

  /* ======================================================
     MARK SINGLE AS READ
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
      console.error(
        "Failed to mark notification as read:",
        error,
      );
    }
  };

  /* ======================================================
     MARK ALL AS READ
  ====================================================== */

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) {
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
      console.error(
        "Failed to mark all notifications as read:",
        error,
      );
    }
  };

  /* ======================================================
     FORMAT TIME
  ====================================================== */

  const formatTime = (timestamp) => {
    if (!timestamp) {
      return "";
    }

    let date;

    try {
      date = timestamp?.toDate
        ? timestamp.toDate()
        : new Date(timestamp);

      if (Number.isNaN(date.getTime())) {
        return "";
      }
    } catch (error) {
      return "";
    }

    const now = new Date();
    const difference = now.getTime() - date.getTime();

    const minutes = Math.floor(difference / 60000);
    const hours = Math.floor(difference / 3600000);
    const days = Math.floor(difference / 86400000);

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
    }

    if (hours < 24) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    if (days === 1) {
      return "Yesterday";
    }

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    });
  };

  /* ======================================================
     RENDER
  ====================================================== */

  return (
    <section className="notifications-page">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="notifications-page-header">
        <div>
          <h1>Notifications</h1>

          <p>
            Stay updated with everything happening on LearnFlow.
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </button>
      </div>

      {/* ==================================================
          FILTER TABS
      ================================================== */}

      <div className="notifications-tabs">
        <button
          type="button"
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          <span>All</span>
          <span>{notifications.length}</span>
        </button>

        <button
          type="button"
          className={filter === "course" ? "active" : ""}
          onClick={() => setFilter("course")}
        >
          <span>Courses</span>
          <span>{courseCount}</span>
        </button>

        <button
          type="button"
          className={filter === "update" ? "active" : ""}
          onClick={() => setFilter("update")}
        >
          <span>Updates</span>
          <span>{updateCount}</span>
        </button>
      </div>

      {/* ==================================================
          NOTIFICATION LIST
      ================================================== */}

      <div className="notifications-page-list">
        {loading ? (
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
              className={`notifications-page-item ${
                !notification.read ? "unread" : ""
              }`}
              onClick={() =>
                handleNotificationClick(notification)
              }
            >
              <div className="notifications-page-content">
                <h3>
                  {notification.title || "LearnFlow"}
                </h3>

                <p>{notification.message}</p>

                <span>
                  {formatTime(notification.createdAt)}
                </span>
              </div>

              {!notification.read && (
                <span className="notification-unread-dot" />
              )}
            </button>
          ))
        )}
      </div>
    </section>
  );
}

export default Notifications;

