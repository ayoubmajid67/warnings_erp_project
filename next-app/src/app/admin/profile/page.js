'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import Sidebar from '@/components/sidebar/Sidebar';
import { User, Mail, Shield, Clock, Moon, Sun, LogOut, Settings } from 'lucide-react';
import '@/app/admin/admin.css';
import './profile.css';

export default function AdminProfilePage() {
  const router = useRouter();
  const { user, isAdmin, logout } = useContext(AuthContext);
  
  const [theme, setTheme] = useState('dark');

  // Auth check
  useEffect(() => {
    if (!isAdmin) {
      router.push('/auth/login');
    }
  }, [isAdmin, router]);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (!isAdmin) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">Profile Settings</h1>
            <p className="page-subtitle">Manage your account and preferences</p>
          </div>

          {/* Profile Card */}
          <div className="profile-settings-card glass-card-static">
            <div className="profile-header-section">
              <div className="admin-avatar">
                <Shield size={32} />
              </div>
              <div className="admin-info">
                <h2 className="admin-name">{user?.username || 'Admin'}</h2>
                <span className="admin-role-badge">
                  <Shield size={14} />
                  Administrator
                </span>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <Mail size={18} />
                <div>
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{user?.email || 'admin@erp.com'}</span>
                </div>
              </div>
              <div className="detail-item">
                <Clock size={18} />
                <div>
                  <span className="detail-label">Session Duration</span>
                  <span className="detail-value">1 Hour</span>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance Settings */}
          <div className="settings-section glass-card-static">
            <h3 className="settings-title">
              <Settings size={20} />
              Appearance
            </h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-name">Theme</span>
                <span className="setting-description">
                  Switch between dark and light mode
                </span>
              </div>
              <button 
                className={`theme-toggle-btn ${theme}`}
                onClick={toggleTheme}
              >
                <span className="toggle-track">
                  <Moon size={14} className="toggle-icon moon" />
                  <Sun size={14} className="toggle-icon sun" />
                  <span className="toggle-thumb" />
                </span>
                <span className="toggle-label">
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </span>
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="settings-section glass-card-static">
            <h3 className="settings-title">
              <User size={20} />
              Account
            </h3>
            
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-name">Log Out</span>
                <span className="setting-description">
                  End your current session
                </span>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
