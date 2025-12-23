'use client';

import { useState } from 'react';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  Info, 
  LogOut as DropoutIcon, 
  Check,
  UserPlus,
  UserMinus,
  Activity 
} from 'lucide-react';
import './NotificationPanel.css';

/**
 * Get icon based on notification type
 */
const getNotificationIcon = (type) => {
  switch (type) {
    case 'warning':
      return <AlertTriangle className="notif-icon warning" />;
    case 'dropout':
      return <DropoutIcon className="notif-icon dropout" />;
    case 'warning_action':
      return <AlertTriangle className="notif-icon action" />;
    case 'dropout_action':
      return <DropoutIcon className="notif-icon action-danger" />;
    case 'member_action':
      return <UserPlus className="notif-icon action" />;
    default:
      return <Info className="notif-icon info" />;
  }
};

/**
 * Format relative time
 */
const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

/**
 * NotificationPanel - Slide-out notification panel
 */
export default function NotificationPanel({ 
  notifications = [], 
  unreadCount = 0,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
  isAdmin = false
}) {
  return (
    <div className="notification-panel">
      <div className="notification-panel-header">
        <div className="notification-panel-title">
          {isAdmin ? <Activity size={20} /> : <Bell size={20} />}
          <span>{isAdmin ? 'Activity Log' : 'Notifications'}</span>
          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount}</span>
          )}
        </div>
        <div className="notification-panel-actions">
          {unreadCount > 0 && (
            <button 
              className="btn btn-ghost btn-sm"
              onClick={onMarkAllAsRead}
            >
              Mark all read
            </button>
          )}
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="notification-panel-body">
        {notifications.length === 0 ? (
          <div className="notification-empty">
            {isAdmin ? <Activity size={40} strokeWidth={1} /> : <Bell size={40} strokeWidth={1} />}
            <p>{isAdmin ? 'No activity yet' : 'No notifications yet'}</p>
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => onMarkAsRead?.(notification.id)}
              >
                <div className="notification-icon-wrapper">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <span className="notification-title">{notification.title}</span>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-time">{formatTime(notification.createdAt)}</span>
                </div>
                {!notification.isRead && (
                  <button 
                    className="notification-read-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsRead?.(notification.id);
                    }}
                    title="Mark as read"
                  >
                    <Check size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * NotificationBell - Button to toggle notification panel
 */
export function NotificationBell({ unreadCount = 0, onClick, isAdmin = false }) {
  return (
    <button className="notification-bell" onClick={onClick} title={isAdmin ? "Activity Log" : "Notifications"}>
      {isAdmin ? <Activity size={20} /> : <Bell size={20} />}
      {unreadCount > 0 && (
        <span className="notification-bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
      )}
    </button>
  );
}

/**
 * NotificationItem - Standalone notification item
 */
export function NotificationItem({ notification, onMarkAsRead }) {
  const formatFullTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`notification-item standalone ${!notification.isRead ? 'unread' : ''}`}>
      <div className="notification-icon-wrapper">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="notification-content">
        <span className="notification-title">{notification.title}</span>
        <p className="notification-message">{notification.message}</p>
        <span className="notification-time">{formatFullTime(notification.createdAt)}</span>
      </div>
      {!notification.isRead && onMarkAsRead && (
        <button 
          className="notification-read-btn"
          onClick={() => onMarkAsRead(notification.id)}
          title="Mark as read"
        >
          <Check size={14} />
        </button>
      )}
    </div>
  );
}
