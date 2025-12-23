'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import Sidebar from '@/components/sidebar/Sidebar';
import { Activity, Clock, AlertTriangle, UserMinus, UserPlus, Filter } from 'lucide-react';
import '../admin.css';
import './notifications.css';

export default function AdminNotificationsPage() {
  const router = useRouter();
  const { isAdmin, getToken } = useContext(AuthContext);
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'warning_action' | 'dropout_action' | 'member_action'

  // Auth check
  useEffect(() => {
    if (!isAdmin) {
      router.push('/auth/login');
    }
  }, [isAdmin, router]);

  // Fetch notifications
  useEffect(() => {
    if (isAdmin) {
      fetchNotifications();
    }
  }, [isAdmin]);

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
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'warning_action':
        return <AlertTriangle className="log-icon warning" />;
      case 'dropout_action':
        return <UserMinus className="log-icon danger" />;
      case 'member_action':
        return <UserPlus className="log-icon info" />;
      default:
        return <Activity className="log-icon default" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  if (!isAdmin) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Header */}
          <div className="page-header">
            <div className="page-header-content">
              <Activity size={28} className="page-icon" />
              <div>
                <h1 className="page-title">Activity Log</h1>
                <p className="page-subtitle">History of all admin actions</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="log-filters glass-card-static">
            <Filter size={18} />
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'warning_action' ? 'active' : ''}`}
              onClick={() => setFilter('warning_action')}
            >
              Warnings ({notifications.filter(n => n.type === 'warning_action').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'dropout_action' ? 'active' : ''}`}
              onClick={() => setFilter('dropout_action')}
            >
              Dropouts ({notifications.filter(n => n.type === 'dropout_action').length})
            </button>
          </div>

          {/* Activity List */}
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading activity...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-state glass-card-static">
              <Activity size={40} strokeWidth={1} />
              <h3>No activity yet</h3>
              <p>Your admin actions will appear here</p>
            </div>
          ) : (
            <div className="activity-log">
              {filteredNotifications.map((item) => (
                <div key={item.id} className="log-item glass-card-static">
                  <div className="log-icon-wrapper">
                    {getIcon(item.type)}
                  </div>
                  <div className="log-content">
                    <h3 className="log-title">{item.title}</h3>
                    <p className="log-message">{item.message}</p>
                    <div className="log-meta">
                      <Clock size={14} />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
