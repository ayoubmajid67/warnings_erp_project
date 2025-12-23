'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import Sidebar from '@/components/sidebar/Sidebar';
import { WarningCounter, StatusBadge } from '@/components/warningBadge/WarningBadge';
import { NotificationItem } from '@/components/notificationPanel/NotificationPanel';
import { AlertTriangle, Clock, User, Shield } from 'lucide-react';
import './dashboard.css';

export default function UserDashboard() {
  const router = useRouter();
  const { user, isUser, isAdmin, getToken } = useContext(AuthContext);
  
  const [memberData, setMemberData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect admin to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      router.push('/admin');
      return;
    }
    if (!isUser && !user) {
      router.push('/auth/login');
    }
  }, [isAdmin, isUser, user, router]);

  // Fetch member data and notifications
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await fetch(`/api/members/${user.memberId}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        
        if (!response.ok) throw new Error('Failed to fetch member data');
        
        const data = await response.json();
        setMemberData(data.member);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications', {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    if (isUser && user?.memberId) {
      fetchMemberData();
      fetchNotifications();
    }
  }, [isUser, user, getToken]);

  // Refresh function for notifications (used in handlers)
  const fetchNotificationsRefresh = async () => {
    try {
      const response = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ notificationId })
      });
      await fetchNotificationsRefresh();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isUser || isAdmin) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">My Dashboard</h1>
            <p className="page-subtitle">View your status and warning history</p>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading your data...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
            </div>
          ) : memberData ? (
            <>
              {/* Status Card */}
              <div className="status-card glass-card-static">
                <div className="status-card-header">
                  <div className="status-avatar">
                    <User size={32} />
                  </div>
                  <div className="status-info">
                    <h2 className="status-name">{memberData.name}</h2>
                    <p className="status-role">{memberData.role}</p>
                  </div>
                  <StatusBadge status={memberData.status} />
                </div>

                <div className="status-card-body">
                  <div className="warning-status-display">
                    <div className="warning-visual">
                      <WarningCounter count={memberData.warningCount} />
                      <span className="warning-fraction">
                        {memberData.warningCount}/3 Warnings
                      </span>
                    </div>
                    
                    {memberData.warningCount > 0 && memberData.warningCount < 3 && (
                      <p className="warning-notice">
                        <AlertTriangle size={16} />
                        {memberData.warningCount === 2 
                          ? "This is your final warning. One more will result in removal from the team."
                          : "You have received a warning. Please maintain professionalism."}
                      </p>
                    )}
                    
                    {memberData.status === 'dropped' && (
                      <div className="dropped-notice">
                        <Shield size={20} />
                        <div>
                          <strong>Access Revoked</strong>
                          <p>You have been dropped from the team due to reaching the maximum warning limit.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Warning History */}
              <section className="section">
                <h2 className="section-title">Warning History</h2>
                
                {memberData.warnings.length === 0 ? (
                  <div className="glass-card-static empty-history">
                    <div className="empty-icon">
                      <AlertTriangle size={32} strokeWidth={1} />
                    </div>
                    <p>No warnings on record</p>
                    <span>Keep up the great work!</span>
                  </div>
                ) : (
                  <div className="warning-history">
                    {memberData.warnings.map((warning, index) => (
                      <div key={warning.id} className="warning-history-item glass-card-static">
                        <div className="warning-number">
                          #{index + 1}
                        </div>
                        <div className="warning-content">
                          <div className="warning-header">
                            <span className="warning-reason">{warning.reason}</span>
                            <span className="warning-date">
                              <Clock size={14} />
                              {formatDate(warning.issuedAt)}
                            </span>
                          </div>
                          <p className="warning-issued-by">
                            Issued by: {warning.issuedBy}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Notifications */}
              <section className="section">
                <h2 className="section-title">Notifications</h2>
                
                {notifications.length === 0 ? (
                  <div className="glass-card-static empty-history">
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="notifications-list">
                    {notifications.slice(0, 5).map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            <div className="error-state">
              <p>Unable to load your profile data</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
