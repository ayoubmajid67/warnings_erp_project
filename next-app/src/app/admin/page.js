'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import Sidebar from '@/components/sidebar/Sidebar';
import MemberCard from '@/components/memberCard/MemberCard';
import WarningModal from '@/components/warningModal/WarningModal';
import { NotificationBell } from '@/components/notificationPanel/NotificationPanel';
import NotificationPanel from '@/components/notificationPanel/NotificationPanel';
import { Users, AlertTriangle, UserCheck, UserX, TrendingUp } from 'lucide-react';
import './admin.css';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, getToken } = useContext(AuthContext);
  
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, dropped: 0, atRisk: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedMember, setSelectedMember] = useState(null);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isWarningLoading, setIsWarningLoading] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

  // Auth check
  useEffect(() => {
    if (!isAdmin) {
      router.push('/auth/login');
    }
  }, [isAdmin, router]);

  // Fetch members
  useEffect(() => {
    if (isAdmin) {
      fetchMembers();
      fetchNotifications();
    }
  }, [isAdmin]);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch members');
      
      const data = await response.json();
      setMembers(data.members);
      setStats(data.stats);
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
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleIssueWarning = (member) => {
    setSelectedMember(member);
    setIsWarningModalOpen(true);
  };

  const handleConfirmWarning = async (memberId, reason) => {
    setIsWarningLoading(true);
    try {
      const response = await fetch('/api/warnings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ memberId, reason })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      // Refresh data
      await fetchMembers();
      await fetchNotifications();
      setIsWarningModalOpen(false);
      setSelectedMember(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsWarningLoading(false);
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
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ markAll: true })
      });
      await fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Header */}
          <div className="dashboard-header">
            <div className="page-header">
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">Manage your team and track warnings</p>
            </div>
            <div className="header-actions">
              <NotificationBell 
                unreadCount={unreadCount}
                onClick={() => setIsNotificationPanelOpen(true)}
                isAdmin={true}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="glass-card stat-card">
              <div className="stat-card-icon blue">
                <Users size={24} />
              </div>
              <div className="stat-card-value">{stats.total}</div>
              <div className="stat-card-label">Total Members</div>
            </div>
            
            <div className="glass-card stat-card">
              <div className="stat-card-icon green">
                <UserCheck size={24} />
              </div>
              <div className="stat-card-value">{stats.active}</div>
              <div className="stat-card-label">Active Members</div>
            </div>
            
            <div className="glass-card stat-card">
              <div className="stat-card-icon yellow">
                <AlertTriangle size={24} />
              </div>
              <div className="stat-card-value">{stats.atRisk}</div>
              <div className="stat-card-label">At Risk (2 Warnings)</div>
            </div>
            
            <div className="glass-card stat-card">
              <div className="stat-card-icon red">
                <UserX size={24} />
              </div>
              <div className="stat-card-value">{stats.dropped}</div>
              <div className="stat-card-label">Dropped Out</div>
            </div>
          </div>

          {/* Members Section */}
          <section className="section">
            <div className="section-header">
              <h2 className="section-title">Team Members</h2>
              <a href="/admin/members" className="btn btn-secondary btn-sm">
                View All
              </a>
            </div>

            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner" />
                <p>Loading members...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
              </div>
            ) : (
              <div className="members-grid">
                {members.slice(0, 4).map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onIssueWarning={handleIssueWarning}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Warning Modal */}
      <WarningModal
        isOpen={isWarningModalOpen}
        onClose={() => {
          setIsWarningModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onConfirm={handleConfirmWarning}
        isLoading={isWarningLoading}
      />

      {/* Notification Panel */}
      {isNotificationPanelOpen && (
        <NotificationPanel
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onClose={() => setIsNotificationPanelOpen(false)}
          isAdmin={true}
        />
      )}
    </div>
  );
}
