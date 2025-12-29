'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import Image from 'next/image';
import { 
  AlertTriangle, 
  Calendar, 
  User, 
  Mail, 
  Briefcase, 
  Share2, 
  Copy, 
  Check,
  ArrowLeft,
  Shield,
  ExternalLink
} from 'lucide-react';
import './warning-details.css';

export default function WarningDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { getToken, user: currentUser } = useContext(AuthContext);
  const warningId = params.warningId;

  const [warning, setWarning] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    fetchWarningDetails();
  }, [warningId, currentUser]);

  const fetchWarningDetails = async () => {
    try {
      const response = await fetch(`/api/warnings/${warningId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch warning details');
      }

      const data = await response.json();
      setWarning(data.warning);
      setMember(data.member);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    // Use production URL for sharing
    const productionUrl = 'https://warnings-erp-project-g9st.vercel.app';
    const shareUrl = `${productionUrl}/warnings/${warningId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Warning Details',
          text: `Warning issued to ${member.name}`,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    // Use production URL for copying
    const productionUrl = 'https://warnings-erp-project-g9st.vercel.app';
    const shareUrl = `${productionUrl}/warnings/${warningId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="warning-details-page">
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading warning details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="warning-details-page">
        <div className="error-container">
          <AlertTriangle size={48} />
          <h2>Error Loading Warning</h2>
          <p>{error}</p>
          <button onClick={() => router.back()} className="btn btn-primary">
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!warning || !member) {
    return (
      <div className="warning-details-page">
        <div className="error-container">
          <AlertTriangle size={48} />
          <h2>Warning Not Found</h2>
          <p>The warning you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => router.back()} className="btn btn-primary">
            <ArrowLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const warningNumber = member.warnings?.findIndex(w => w.id === warningId) + 1 || 1;

  return (
    <div className="warning-details-page">
      <div className="warning-details-container">
        {/* Header */}
        <div className="warning-header">
          <button onClick={() => router.back()} className="back-btn">
            <ArrowLeft size={20} />
            Back
          </button>
          
          <div className="header-actions">
            <button onClick={handleShare} className="share-btn" title="Share warning">
              <Share2 size={18} />
              Share
            </button>
            <button 
              onClick={handleCopyLink} 
              className="copy-btn" 
              title="Copy link"
            >
              {copied ? (
                <>
                  <Check size={18} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Warning Card */}
        <div className="warning-card glass-card">
          {/* Warning Badge */}
          <div className="warning-badge-section">
            <div className={`warning-badge warning-${warningNumber}`}>
              <AlertTriangle size={32} />
              <div className="badge-text">
                <span className="badge-title">Warning {warningNumber} of 3</span>
                <span className="badge-subtitle">Official Warning Notice</span>
              </div>
            </div>
          </div>

          {/* Member Info */}
          <div className="member-info-section">
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
            
            <div className="member-details">
              <h1 className="member-name">{member.name}</h1>
              <div className="member-meta">
                <div className="meta-item">
                  <Briefcase size={16} />
                  <span>{member.role}</span>
                </div>
                <div className="meta-item">
                  <Mail size={16} />
                  <span>{member.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Details */}
          <div className="warning-details-section">
            <h2 className="section-title">Warning Details</h2>
            
            <div className="details-grid">
              <div className="detail-card">
                <div className="detail-icon">
                  <Calendar />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Issued Date</span>
                  <span className="detail-value">
                    {new Date(warning.issuedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="detail-time">
                    {new Date(warning.issuedAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-icon">
                  <User />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Issued By</span>
                  <span className="detail-value">{warning.issuedBy}</span>
                  <span className="detail-time">Administrator</span>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-icon">
                  <AlertTriangle />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Warning Count</span>
                  <span className="detail-value">{member.warningCount} / 3</span>
                  <span className="detail-time">
                    {member.warningCount >= 3 ? 'Maximum Reached' : `${3 - member.warningCount} remaining`}
                  </span>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-icon">
                  <Shield />
                </div>
                <div className="detail-content">
                  <span className="detail-label">Account Status</span>
                  <span className={`detail-value status-${member.status}`}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                  <span className="detail-time">
                    {member.status === 'dropped' ? 'Membership Terminated' : 'Active Member'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reason Section */}
          <div className="reason-section">
            <h2 className="section-title">Reason for Warning</h2>
            <div className="reason-card">
              <p className="reason-text">{warning.reason}</p>
            </div>
          </div>

          {/* Proof Document Section */}
          {warning.documentPath && (
            <div className="reason-section">
              <h2 className="section-title">Proof Document</h2>
              <div className="document-card">
                <div className="document-info">
                  <div className="document-icon">
                    📄
                  </div>
                  <div className="document-details">
                    <span className="document-name">
                      {warning.documentPath.split('/').pop()}
                    </span>
                    <span className="document-type">
                      {warning.documentPath.endsWith('.pdf') ? 'PDF Document' : 
                       warning.documentPath.endsWith('.png') ? 'PNG Image' : 
                       warning.documentPath.endsWith('.jpg') || warning.documentPath.endsWith('.jpeg') ? 'JPG Image' : 
                       'Document'}
                    </span>
                  </div>
                </div>
                <div className="document-actions">
                  <a 
                    href={warning.documentPath} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    <ExternalLink size={16} />
                    View Document
                  </a>
                  <a 
                    href={warning.documentPath} 
                    download
                    className="btn btn-secondary btn-sm"
                  >
                    📥 Download
                  </a>
                </div>
              </div>
              
              {/* PDF Preview */}
              {warning.documentPath.endsWith('.pdf') && (
                <div className="document-preview">
                  <iframe 
                    src={warning.documentPath}
                    className="pdf-iframe"
                    title="Proof Document"
                  />
                </div>
              )}
              
              {/* Image Preview */}
              {(warning.documentPath.endsWith('.png') || 
                warning.documentPath.endsWith('.jpg') || 
                warning.documentPath.endsWith('.jpeg')) && (
                <div className="document-preview">
                  <Image 
                    src={warning.documentPath}
                    alt="Proof Document"
                    width={800}
                    height={600}
                    className="proof-image"
                  />
                </div>
              )}
            </div>
          )}

          {/* Warning Notice */}
          {member.warningCount >= 2 && member.status !== 'dropped' && (
            <div className="alert-box alert-warning">
              <AlertTriangle size={20} />
              <div className="alert-content">
                <strong>Final Notice:</strong> This member has received {member.warningCount} warnings. 
                {member.warningCount === 2 ? ' One more warning will result in membership termination.' : ''}
              </div>
            </div>
          )}

          {member.status === 'dropped' && (
            <div className="alert-box alert-danger">
              <AlertTriangle size={20} />
              <div className="alert-content">
                <strong>Membership Terminated:</strong> This member has been removed from the team 
                due to reaching the maximum number of warnings (3).
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="warning-footer">
          <p className="footer-text">
            This is an official warning record from the ERP Team Management System.
            Only authenticated team members can view this information.
          </p>
          <p className="footer-id">Warning ID: {warning.id}</p>
        </div>
      </div>
    </div>
  );
}
