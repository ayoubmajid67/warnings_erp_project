'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import Sidebar from '@/components/sidebar/Sidebar';
import MemberCard, { MemberRow } from '@/components/memberCard/MemberCard';
import WarningModal from '@/components/warningModal/WarningModal';
import AddMemberModal from '@/components/addMemberModal/AddMemberModal';
import { useEnvironment } from '@/hooks/useEnvironment';
import { Search, Grid, List, UserPlus, Trash2 } from 'lucide-react';
import '../admin.css';
import './members.css';

export default function MembersPage() {
  const router = useRouter();
  const { isAdmin, getToken } = useContext(AuthContext);
  const { isProduction, isLocal } = useEnvironment();
  
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'dropped' | 'disabled'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  
  const [selectedMember, setSelectedMember] = useState(null);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isWarningLoading, setIsWarningLoading] = useState(false);

  // Add Member Modal state
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddMemberLoading, setIsAddMemberLoading] = useState(false);
  const [newMemberPassword, setNewMemberPassword] = useState(null);

  // Auth check
  useEffect(() => {
    if (!isAdmin) {
      router.push('/auth/login');
    }
  }, [isAdmin, router]);

  // Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Include disabled in local env for admin view
        const url = isLocal ? '/api/members?includeDisabled=true' : '/api/members';
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        
        if (!response.ok) throw new Error('Failed to fetch members');
        
        const data = await response.json();
        setMembers(data.members);
        setFilteredMembers(data.members);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchMembers();
    }
  }, [isAdmin, getToken, isLocal]);

  // Filter members
  useEffect(() => {
    let filtered = [...members];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query) ||
        m.role.toLowerCase().includes(query)
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(m => m.status === statusFilter);
    }
    
    setFilteredMembers(filtered);
  }, [members, searchQuery, statusFilter]);

  // Refresh function for handlers
  const fetchMembersRefresh = async () => {
    try {
      const url = isLocal ? '/api/members?includeDisabled=true' : '/api/members';
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      if (!response.ok) throw new Error('Failed to fetch members');
      
      const data = await response.json();
      setMembers(data.members);
      setFilteredMembers(data.members);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueWarning = (member) => {
    setSelectedMember(member);
    setIsWarningModalOpen(true);
  };

  const handleViewProfile = (member) => {
    router.push(`/admin/members/${member.id}`);
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

      await fetchMembersRefresh();
      setIsWarningModalOpen(false);
      setSelectedMember(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsWarningLoading(false);
    }
  };

  // Add member handler
  const handleAddMember = async (formData, profileData, cvData) => {
    setIsAddMemberLoading(true);
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // Show password to admin
      setNewMemberPassword(data.password);
      
      await fetchMembersRefresh();
      setIsAddMemberModalOpen(false);
      
      // Show success alert with password
      alert(`Member created successfully!\n\nGenerated password: ${data.password}\n\nPlease save this password and share it securely with the member.`);
      setNewMemberPassword(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsAddMemberLoading(false);
    }
  };

  // Disable member handler
  const handleDisableMember = async (member) => {
    if (!confirm(`Are you sure you want to disable ${member.name}? They will no longer appear in the team list.`)) {
      return;
    }

    try {
      const response = await fetch('/api/members', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ memberId: member.id })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await fetchMembersRefresh();
      alert('Member disabled successfully');
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Header */}
          <div className="page-header">
            <div className="page-header-left">
              <h1 className="page-title">Team Members</h1>
              <p className="page-subtitle">Manage and monitor all team members</p>
            </div>
            
            {/* Add Member Button - Local env only */}
            {isLocal && (
              <button 
                className="add-member-btn"
                onClick={() => setIsAddMemberModalOpen(true)}
              >
                <UserPlus size={18} />
                Add Member
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="filters-bar glass-card-static">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-chips">
              <button 
                className={`filter-chip ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All ({members.length})
              </button>
              <button 
                className={`filter-chip ${statusFilter === 'active' ? 'active' : ''}`}
                onClick={() => setStatusFilter('active')}
              >
                Active ({members.filter(m => m.status === 'active').length})
              </button>
              <button 
                className={`filter-chip ${statusFilter === 'dropped' ? 'active' : ''}`}
                onClick={() => setStatusFilter('dropped')}
              >
                Dropped ({members.filter(m => m.status === 'dropped').length})
              </button>
              {isLocal && (
                <button 
                  className={`filter-chip ${statusFilter === 'disabled' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('disabled')}
                >
                  Disabled ({members.filter(m => m.status === 'disabled').length})
                </button>
              )}
            </div>

            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid size={18} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Members */}
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading members...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Search size={32} />
              </div>
              <h3 className="empty-state-title">No members found</h3>
              <p className="empty-state-description">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No team members have been added yet'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="members-grid">
              {filteredMembers.map((member) => (
                <div key={member.id} className={`member-card-wrapper ${member.status === 'disabled' ? 'disabled' : ''}`}>
                  <MemberCard
                    member={member}
                    onIssueWarning={handleIssueWarning}
                    isReadOnly={isProduction}
                  />
                  {/* Disable button - Local env only */}
                  {isLocal && member.status !== 'disabled' && (
                    <button 
                      className="disable-member-btn"
                      onClick={() => handleDisableMember(member)}
                      title="Disable Member"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  {member.status === 'disabled' && (
                    <div className="disabled-overlay">
                      <span>Disabled</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Role</th>
                    <th>Warnings</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <MemberRow
                      key={member.id}
                      member={member}
                      onIssueWarning={handleIssueWarning}
                      onViewProfile={handleViewProfile}
                      isReadOnly={isProduction}
                      showDisableAction={isLocal && member.status !== 'disabled'}
                      onDisable={() => handleDisableMember(member)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onSubmit={handleAddMember}
        isLoading={isAddMemberLoading}
      />
    </div>
  );
}
