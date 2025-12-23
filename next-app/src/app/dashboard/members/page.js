'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AuthContext } from '@/providers/AuthProvider';
import Sidebar from '@/components/sidebar/Sidebar';
import { Users, Search, Mail, ArrowRight } from 'lucide-react';
import '../dashboard.css';
import './members.css';

export default function DashboardMembersPage() {
  const router = useRouter();
  const { user, isAdmin, getToken } = useContext(AuthContext);
  
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect admin to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, router]);

  // Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/members', {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Filter to show only active members (not dropped)
          setMembers(data.members.filter(m => m.status === 'active'));
        }
      } catch (err) {
        console.error('Failed to fetch members:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!isAdmin) {
      fetchMembers();
    }
  }, [isAdmin, getToken]);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isAdmin) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Header */}
          <div className="page-header">
            <div className="page-header-content">
              <Users size={28} className="page-icon team-icon" />
              <div>
                <h1 className="page-title">Team Members</h1>
                <p className="page-subtitle">Connect with your teammates</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-container glass-card-static">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, role, or domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Members Grid */}
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading team members...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="empty-state glass-card-static">
              <Users size={40} strokeWidth={1} />
              <h3>No members found</h3>
              <p>{searchTerm ? 'Try a different search term' : 'No team members available'}</p>
            </div>
          ) : (
            <div className="members-grid-dashboard">
              {filteredMembers.map((member) => (
                <Link 
                  key={member.id} 
                  href={`/dashboard/members/${member.id}`}
                  className="member-card-dashboard glass-card-static"
                >
                  <div className="member-card-header">
                    <div className="member-card-avatar">
                      {member.profileImage ? (
                        <Image 
                          src={member.profileImage} 
                          alt={member.name}
                          width={64}
                          height={64}
                          className="avatar-img"
                        />
                      ) : (
                        <span className="avatar-initials">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      )}
                    </div>
                    <div className="member-card-info">
                      <h3 className="member-card-name">{member.name}</h3>
                      <p className="member-card-role">{member.role}</p>
                      <p className="member-card-domain">{member.domain}</p>
                    </div>
                  </div>
                  
                  <div className="member-card-footer">
                    <span className="member-card-email">
                      <Mail size={14} />
                      {member.email}
                    </span>
                    <span className="view-profile-link">
                      View Profile
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
