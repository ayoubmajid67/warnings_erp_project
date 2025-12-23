'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import Sidebar from '@/components/sidebar/Sidebar';
import { WarningCounter, StatusBadge } from '@/components/warningBadge/WarningBadge';
import { AlertTriangle, Clock, FileText, ShieldAlert } from 'lucide-react';
import '../dashboard.css';
import './warnings.css';

export default function MemberWarningsPage() {
  const router = useRouter();
  const { user, isAdmin, getToken } = useContext(AuthContext);
  
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect admin to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, router]);

  // Fetch member's warning data
  useEffect(() => {
    const fetchWarnings = async () => {
      try {
        const response = await fetch(`/api/members/${user.memberId}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setMember(data.member);
        }
      } catch (err) {
        console.error('Failed to fetch warnings:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!isAdmin && user?.memberId) {
      fetchWarnings();
    }
  }, [isAdmin, user, getToken]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isAdmin) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Header */}
          <div className="page-header">
            <div className="page-header-content">
              <AlertTriangle size={28} className="page-icon warning-icon" />
              <div>
                <h1 className="page-title">My Warnings</h1>
                <p className="page-subtitle">View your warning history and status</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading your warnings...</p>
            </div>
          ) : member ? (
            <>
              {/* Warning Status Card */}
              <div className="warning-status-card glass-card-static">
                <div className="status-header">
                  <h2>Current Status</h2>
                  <StatusBadge status={member.status} />
                </div>
                
                <div className="status-content">
                  <div className="warning-counter-large">
                    <WarningCounter count={member.warningCount} size="large" />
                    <div className="counter-info">
                      <span className="counter-value">{member.warningCount}/3</span>
                      <span className="counter-label">Warnings Received</span>
                    </div>
                  </div>
                  
                  <div className="status-message">
                    {member.status === 'dropped' ? (
                      <div className="message-dropped">
                        <ShieldAlert size={20} />
                        <p>You have been removed from the team due to reaching 3 warnings.</p>
                      </div>
                    ) : member.warningCount === 2 ? (
                      <div className="message-critical">
                        <ShieldAlert size={20} />
                        <p>Final notice! One more warning will result in removal from the team.</p>
                      </div>
                    ) : member.warningCount === 1 ? (
                      <div className="message-warning">
                        <AlertTriangle size={20} />
                        <p>You have received a warning. Please improve your conduct.</p>
                      </div>
                    ) : (
                      <div className="message-good">
                        <p>You have no warnings. Keep up the good work!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Warning History */}
              <div className="warning-history-section glass-card-static">
                <h2 className="section-title">
                  <FileText size={20} />
                  Warning History
                </h2>
                
                {member.warnings && member.warnings.length > 0 ? (
                  <div className="warnings-timeline">
                    {member.warnings.map((warning, index) => (
                      <div key={warning.id} className="warning-timeline-item">
                        <div className="timeline-marker">
                          <span className="warning-number">#{index + 1}</span>
                        </div>
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <span className="timeline-title">Warning #{index + 1}</span>
                            <span className="timeline-date">
                              <Clock size={14} />
                              {formatDate(warning.issuedAt)}
                            </span>
                          </div>
                          <p className="timeline-reason">{warning.reason}</p>
                          <span className="timeline-issuer">Issued by: {warning.issuedBy}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-warnings">
                    <AlertTriangle size={40} strokeWidth={1} />
                    <h3>No Warnings</h3>
                    <p>You haven&apos;t received any warnings yet. Keep it up!</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="error-state">
              <p>Unable to load your warning data.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
