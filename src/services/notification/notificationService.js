import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../config/firebaseconfig";

/**
 * Create a notification
 */
export const createNotification = async ({
  userId,
  title,
  message,
  type = "update",
}) => {
  try {
    const notificationRef = await addDoc(collection(db, "notifications"), {
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: serverTimestamp(),
    });

    return notificationRef.id;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

/**
 * Get notifications for a user
 */
export const getUserNotifications = async (userId) => {
  try {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((notification) => ({
      id: notification.id,
      ...notification.data(),
    }));
  } catch (error) {
    console.error("Error getting notifications:", error);
    throw error;
  }
};

/**
 * Mark one notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    await updateDoc(doc(db, "notifications", notificationId), {
      read: true,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

/**
 * Mark all user notifications as read
 */
export const markAllNotificationsAsRead = async (notifications) => {
  try {
    const unreadNotifications = notifications.filter(
      (notification) => !notification.read,
    );

    await Promise.all(
      unreadNotifications.map((notification) =>
        updateDoc(doc(db, "notifications", notification.id), {
          read: true,
        }),
      ),
    );
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    throw error;
  }
};
