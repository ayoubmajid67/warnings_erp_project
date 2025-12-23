/**
 * Notifications Database
 * Stores notification records for team members AND admin action logs
 * Uses JSON file for persistent storage in db directory
 */

import fs from 'fs';
import path from 'path';

// Path to persistent data file (in the same directory as this file)
const DB_DIR = path.join(process.cwd(), 'src', 'app', 'db');
const NOTIFICATIONS_FILE = path.join(DB_DIR, 'notifications.json');

// ============== File Persistence ==============

/**
 * Load notifications from file
 */
const loadNotifications = () => {
  if (fs.existsSync(NOTIFICATIONS_FILE)) {
    try {
      const data = fs.readFileSync(NOTIFICATIONS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading notifications file:', error);
      return [];
    }
  }
  
  // Initialize empty array if file doesn't exist
  saveNotifications([]);
  return [];
};

/**
 * Save notifications to file
 */
const saveNotifications = (notificationsData) => {
  try {
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notificationsData, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving notifications file:', error);
    return false;
  }
};

// In-memory cache (synced with file)
let notifications = loadNotifications();

// ============== CRUD Operations ==============

/**
 * Get all notifications
 */
export const getNotifications = () => {
  notifications = loadNotifications();
  return notifications;
};

/**
 * Get admin action logs (notifications with target='admin' or all action logs)
 */
export const getAdminActionLogs = () => {
  notifications = loadNotifications();
  return notifications
    .filter(n => n.target === 'admin')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * Get unread count for admin
 */
export const getAdminUnreadCount = () => {
  notifications = loadNotifications();
  return notifications.filter(n => n.target === 'admin' && !n.isRead).length;
};

/**
 * Get notifications for a specific member (excluding admin logs)
 */
export const getNotificationsByMemberId = (memberId) => {
  notifications = loadNotifications();
  return notifications
    .filter(n => n.memberId === memberId && n.target === 'member')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * Get unread count for a member
 */
export const getUnreadCount = (memberId) => {
  notifications = loadNotifications();
  return notifications.filter(n => n.memberId === memberId && n.target === 'member' && !n.isRead).length;
};

/**
 * Create a new notification
 * Note: isRead only applies to member notifications, not admin logs
 */
export const createNotification = (notificationData) => {
  notifications = loadNotifications();
  
  const isMemberNotification = notificationData.target === 'member';
  
  const newNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    target: 'member', // 'member' or 'admin'
    ...notificationData,
    // Only add isRead for member notifications
    ...(isMemberNotification ? { isRead: false } : {})
  };
  
  notifications.push(newNotification);
  saveNotifications(notifications);
  
  return newNotification;
};

/**
 * Mark a notification as read (MEMBER ONLY)
 * Validates that the notification belongs to the member
 */
export const markAsRead = (notificationId, memberId) => {
  notifications = loadNotifications();
  
  const notification = notifications.find(n => 
    n.id === notificationId && 
    n.memberId === memberId && 
    n.target === 'member'
  );
  
  if (notification && notification.isRead !== undefined) {
    notification.isRead = true;
    saveNotifications(notifications);
    return notification;
  }
  return null;
};

/**
 * Mark all notifications as read for a member (MEMBER ONLY)
 */
export const markAllAsRead = (memberId) => {
  notifications = loadNotifications();
  
  notifications.forEach(n => {
    if (n.memberId === memberId && n.target === 'member' && n.isRead !== undefined) {
      n.isRead = true;
    }
  });
  
  saveNotifications(notifications);
  return true;
};

/**
 * Delete a notification
 */
export const deleteNotification = (notificationId) => {
  notifications = loadNotifications();
  
  const index = notifications.findIndex(n => n.id === notificationId);
  if (index === -1) return false;
  
  notifications.splice(index, 1);
  saveNotifications(notifications);
  
  return true;
};

/**
 * Clear all notifications for a member
 */
export const clearNotifications = (memberId) => {
  notifications = loadNotifications();
  notifications = notifications.filter(n => n.memberId !== memberId);
  saveNotifications(notifications);
  return true;
};

// ============== Member Notification Helpers ==============

/**
 * Create warning notification for member
 */
export const createWarningNotification = (memberId, warningCount, reason) => {
  const titles = {
    1: 'First Warning Received',
    2: 'Second Warning - Final Notice',
    3: 'Third Warning - Dropped Out'
  };
  
  const messages = {
    1: `You have received your first warning. Reason: ${reason}. Please improve your conduct.`,
    2: `You have received your second warning. Reason: ${reason}. This is your final notice before being dropped.`,
    3: `You have received your third warning. Reason: ${reason}. You are now dropped from the team.`
  };
  
  return createNotification({
    memberId,
    target: 'member',
    type: 'warning',
    title: titles[warningCount] || 'Warning Received',
    message: messages[warningCount] || `Warning received. Reason: ${reason}`
  });
};

/**
 * Create dropout notification for member
 */
export const createDropoutNotification = (memberId) => {
  return createNotification({
    memberId,
    target: 'member',
    type: 'dropout',
    title: 'Team Membership Terminated',
    message: 'You have been removed from the team due to reaching the maximum number of warnings (3). Your access to the platform has been revoked. This decision is final.'
  });
};

/**
 * Create welcome notification for member
 */
export const createWelcomeNotification = (memberId, memberName) => {
  return createNotification({
    memberId,
    target: 'member',
    type: 'info',
    title: 'Welcome to the Team!',
    message: `Welcome ${memberName}! You are now part of the ERP team. Please review the guidelines and maintain professionalism.`
  });
};

// ============== Admin Action Log Helpers ==============

/**
 * Log warning action for admin
 */
export const logWarningAction = (memberId, memberName, warningCount, reason) => {
  const messages = {
    1: `You issued the first warning to ${memberName}. Reason: ${reason}`,
    2: `You issued the second warning to ${memberName}. Reason: ${reason}. This is their final notice.`,
    3: `You issued the third warning to ${memberName}. Reason: ${reason}. They have been dropped from the team.`
  };
  
  return createNotification({
    memberId,
    target: 'admin',
    type: warningCount >= 3 ? 'dropout_action' : 'warning_action',
    title: warningCount >= 3 ? `Member Dropped: ${memberName}` : `Warning Issued to ${memberName}`,
    message: messages[warningCount] || `Warning issued to ${memberName}. Reason: ${reason}`
  });
};

/**
 * Log member creation for admin
 */
export const logMemberCreated = (memberName) => {
  return createNotification({
    target: 'admin',
    type: 'member_action',
    title: 'New Member Added',
    message: `You added ${memberName} to the team.`
  });
};

/**
 * Log member deletion for admin
 */
export const logMemberDeleted = (memberName) => {
  return createNotification({
    target: 'admin',
    type: 'member_action',
    title: 'Member Removed',
    message: `You removed ${memberName} from the team.`
  });
};

/**
 * Reset notifications (for testing)
 */
export const resetNotifications = () => {
  notifications = [];
  saveNotifications(notifications);
  return true;
};
