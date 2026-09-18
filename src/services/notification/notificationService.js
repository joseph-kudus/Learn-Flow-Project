import {
  addDoc,
  collection,
  doc,
  getDocs,
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
 * @param {string} notification.userId
 * @param {string} notification.title
 * @param {string} notification.message
 * @param {string} [notification.type="update"]
 * @returns {Promise<string>}
 */
export const createNotification = async ({
  userId,
  title,
  message,
  type = "update",
  link = "",
  courseId = null,
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
    const notificationData = {
      userId,
      title: title.trim(),
      message: message.trim(),
      type,
      read: false,
      createdAt: serverTimestamp(),
    };

    // Add destination only when provided
    if (link) {
      notificationData.link = link;
    }

    // Add course ID only for course-related notifications
    if (courseId !== null && courseId !== undefined) {
      notificationData.courseId = courseId;
    }

    const notificationDoc = await addDoc(notificationsRef, notificationData);

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
 * Subscribe to notifications belonging to a user.
 *
 * @param {string} userId
 * @param {Function} onUpdate
 * @param {Function} [onError]
 * @returns {Function}
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
        .map((notificationDoc) => ({
          id: notificationDoc.id,
          ...notificationDoc.data(),
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
 * Get a user's notifications once.
 *
 * @param {string} userId
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
 * Mark one notification as read.
 *
 * @param {string} notificationId
 */
export const markNotificationAsRead = async (notificationId) => {
  if (!notificationId) {
    throw new Error("Notification ID is required.");
  }

  try {
    const notificationRef = doc(db, "notifications", notificationId);

    await updateDoc(notificationRef, {
      read: true,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);

    throw error;
  }
};

/* ======================================================
   MARK ALL USER NOTIFICATIONS AS READ
====================================================== */

/**
 * Mark all unread notifications belonging to a user as read.
 *
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export const markAllNotificationsAsRead = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  try {
    /* ==================================================
       FIND USER'S UNREAD NOTIFICATIONS
    ================================================== */

    const q = query(
      notificationsRef,
      where("userId", "==", userId),
      where("read", "==", false),
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return {
        success: true,
        updatedCount: 0,
      };
    }

    /* ==================================================
       UPDATE IN BATCHES
    ================================================== */

    let batch = writeBatch(db);
    let batchCount = 0;
    let updatedCount = 0;

    for (const notificationDoc of snapshot.docs) {
      const notificationRef = doc(db, "notifications", notificationDoc.id);

      batch.update(notificationRef, {
        read: true,
      });

      batchCount++;
      updatedCount++;

      // Firestore batch limit
      if (batchCount === 500) {
        await batch.commit();

        batch = writeBatch(db);
        batchCount = 0;
      }
    }

    /* ==================================================
       COMMIT REMAINING UPDATES
    ================================================== */

    if (batchCount > 0) {
      await batch.commit();
    }

    return {
      success: true,
      updatedCount,
    };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);

    throw error;
  }
};
