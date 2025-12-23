'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import Sidebar from '@/components/sidebar/Sidebar';
import { User, Mail, Phone, Github, Linkedin, Clock, Moon, Sun, LogOut, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import '../dashboard.css';
import './profile.css';

export default function MemberProfilePage() {
  const router = useRouter();
  const { user, isAdmin, logout, getToken } = useContext(AuthContext);
  
  const [member, setMember] = useState(null);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');

  // Redirect admin to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, router]);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Fetch member data
  useEffect(() => {
    if (!isAdmin && user?.memberId) {
      fetchMemberData();
      fetchAllMembers();
    }
  }, [isAdmin, user]);

  const fetchMemberData = async () => {
    try {
      const response = await fetch(`/api/members/${user.memberId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMember(data.member);
      }
    } catch (err) {
      console.error('Failed to fetch member:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMembers = async () => {
    try {
      const response = await fetch('/api/members', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Filter out current member
        setAllMembers(data.members.filter(m => m.id !== user.memberId));
      }
    } catch (err) {
      console.error('Failed to fetch members:', err);
    }
  };

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

  if (isAdmin) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">View your profile and settings</p>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading profile...</p>
            </div>
          ) : member ? (
            <>
              {/* Profile Card */}
              <div className="member-profile-card glass-card-static">
                <div className="profile-header-section">
                  <div className="member-avatar-large">
                    {member.profileImage ? (
                      <Image 
                        src={member.profileImage} 
                        alt={member.name}
                        width={100}
                        height={100}
                        className="avatar-img"
                      />
                    ) : (
                      <span className="avatar-initials">
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <div className="member-info">
                    <h2 className="member-name">{member.name}</h2>
                    <p className="member-role">{member.role}</p>
                    <p className="member-domain">{member.domain}</p>
                  </div>
                </div>

                <div className="profile-contact">
                  <div className="contact-item">
                    <Mail size={16} />
                    <span>{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="contact-item">
                      <Phone size={16} />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="contact-item link">
                      <Github size={16} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="contact-item link">
                      <Linkedin size={16} />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Settings Section */}
              <div className="settings-section glass-card-static">
                <h3 className="settings-title">
                  <Settings size={20} />
                  Settings
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

              {/* Team Members Section */}
              <div className="team-section glass-card-static">
                <h3 className="settings-title">
                  <Users size={20} />
                  Team Members
                </h3>
                
                <div className="team-grid">
                  {allMembers.map((m) => (
                    <Link 
                      key={m.id} 
                      href={`/dashboard/members/${m.id}`}
                      className="team-member-card"
                    >
                      <div className="team-member-avatar">
                        {m.profileImage ? (
                          <Image 
                            src={m.profileImage} 
                            alt={m.name}
                            width={48}
                            height={48}
                            className="avatar-img"
                          />
                        ) : (
                          <span className="avatar-initials-sm">
                            {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <div className="team-member-info">
                        <span className="team-member-name">{m.name}</span>
                        <span className="team-member-role">{m.role}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="error-state">
              <p>Unable to load profile.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
