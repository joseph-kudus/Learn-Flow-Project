import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../config/firebaseconfig";

/* ======================================================
   COLLECTION
====================================================== */

const notificationsRef = collection(db, "notifications");

/* ======================================================
   CREATE NOTIFICATION
====================================================== */

/**
 * Create a notification for a user.
 *
 * @param {Object} notification
 * @param {string} notification.userId - Firebase UID
 * @param {string} notification.title - Notification title
 * @param {string} notification.message - Notification message
 * @param {string} [notification.type="update"] - Notification type
 *
 * @returns {Promise<string>} Created notification ID
 */
export const createNotification = async ({
  userId,
  title,
  message,
  type = "update",
}) => {
  if (!userId) {
    throw new Error("Notification userId is required.");
  }

  if (!title?.trim()) {
    throw new Error("Notification title is required.");
  }

  if (!message?.trim()) {
    throw new Error("Notification message is required.");
  }

  try {
    const notification = {
      userId,
      title: title.trim(),
      message: message.trim(),
      type,
      read: false,
      createdAt: serverTimestamp(),
    };

    const notificationDoc = await addDoc(notificationsRef, notification);

    return notificationDoc.id;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

/* ======================================================
   REAL-TIME USER NOTIFICATIONS
====================================================== */

/**
 * Listen for real-time notifications for a user.
 *
 * @param {string} userId - Firebase UID
 * @param {Function} onUpdate - Called whenever notifications change
 * @param {Function} [onError] - Called when listener fails
 *
 * @returns {Function} Unsubscribe function
 */
export const subscribeToUserNotifications = (userId, onUpdate, onError) => {
  if (!userId) {
    console.error("Cannot subscribe to notifications without userId.");
    return () => {};
  }

  const q = query(notificationsRef, where("userId", "==", userId));

  return onSnapshot(
    q,
    (snapshot) => {
      const notifications = snapshot.docs
        .map((notification) => ({
          id: notification.id,
          ...notification.data(),
        }))
        .sort((a, b) => {
          const dateA = a.createdAt?.toMillis?.() || 0;
          const dateB = b.createdAt?.toMillis?.() || 0;

          return dateB - dateA;
        });

      onUpdate(notifications);
    },
    (error) => {
      console.error("Error listening to notifications:", error);

      if (onError) {
        onError(error);
      }
    },
  );
};

/* ======================================================
   GET USER NOTIFICATIONS
====================================================== */

/**
 * Get notifications for a user once.
 *
 * This is useful when a real-time listener is not required.
 *
 * @param {string} userId - Firebase UID
 * @returns {Promise<Array>}
 */
export const getUserNotifications = async (userId) => {
  if (!userId) {
    throw new Error("Notification userId is required.");
  }

  return new Promise((resolve, reject) => {
    const unsubscribe = subscribeToUserNotifications(
      userId,
      (notifications) => {
        unsubscribe();
        resolve(notifications);
      },
      (error) => {
        unsubscribe();
        reject(error);
      },
    );
  });
};

/* ======================================================
   MARK ONE NOTIFICATION AS READ
====================================================== */

/**
 * Mark a single notification as read.
 *
 * @param {string} notificationId
 */
export const markNotificationAsRead = async (notificationId) => {
  if (!notificationId) {
    throw new Error("Notification ID is required.");
  }

  try {
    await updateDoc(doc(db, "notifications", notificationId), {
      read: true,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);

    throw error;
  }
};

/* ======================================================
   MARK ALL NOTIFICATIONS AS READ
====================================================== */

/**
 * Mark all unread notifications as read.
 *
 * @param {Array} notifications
 */
export const markAllNotificationsAsRead = async (notifications = []) => {
  const unreadNotifications = notifications.filter(
    (notification) => !notification.read && notification.id,
  );

  if (unreadNotifications.length === 0) {
    return;
  }

  try {
    const batch = writeBatch(db);

    unreadNotifications.forEach((notification) => {
      const notificationRef = doc(db, "notifications", notification.id);

      batch.update(notificationRef, {
        read: true,
      });
    });

    await batch.commit();
  } catch (error) {
    console.error("Error marking all notifications as read:", error);

    throw error;
  }
};
