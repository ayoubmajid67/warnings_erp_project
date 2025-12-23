'use client';

import Image from 'next/image';
import Link from 'next/link';
import { WarningCounter, StatusBadge } from '@/components/warningBadge/WarningBadge';
import { AlertTriangle, Eye, Mail, Phone, ExternalLink } from 'lucide-react';
import './MemberCard.css';

/**
 * MemberCard - Glassmorphic card displaying member info
 */
export default function MemberCard({ 
  member, 
  onIssueWarning,
  showActions = true,
  variant = 'default', // 'default' | 'compact' | 'detailed'
  isReadOnly = false // When true, disables write actions
}) {
  const { 
    id, 
    name, 
    email, 
    role, 
    status, 
    warningCount, 
    profileImage 
  } = member;

  const isDropped = status === 'dropped';
  const canIssueWarning = !isDropped && warningCount < 3;

  if (variant === 'compact') {
    return (
      <div className={`member-card compact ${isDropped ? 'dropped' : ''}`}>
        <div className="member-avatar">
          {profileImage ? (
            <Image 
              src={profileImage} 
              alt={name} 
              width={40} 
              height={40}
              className="member-avatar-img"
            />
          ) : (
            <span className="member-avatar-initials">
              {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          )}
        </div>
        <div className="member-info">
          <span className="member-name">{name}</span>
          <span className="member-role">{role}</span>
        </div>
        <WarningCounter count={warningCount} />
      </div>
    );
  }

  return (
    <div className={`member-card glass-card ${isDropped ? 'dropped' : ''}`}>
      {/* Header */}
      <div className="member-card-header">
        <div className="member-avatar-lg">
          {profileImage ? (
            <Image 
              src={profileImage} 
              alt={name} 
              width={64} 
              height={64}
              className="member-avatar-img"
            />
          ) : (
            <span className="member-avatar-initials">
              {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Body */}
      <div className="member-card-body">
        <h3 className="member-name">{name}</h3>
        <p className="member-role">{role}</p>
        
        <div className="member-contact">
          <a href={`mailto:${email}`} className="member-contact-item">
            <Mail size={14} />
            <span>{email}</span>
          </a>
        </div>
      </div>

      {/* Warning Section */}
      <div className="member-card-warning">
        <span className="warning-section-label">Warning Status</span>
        <div className="warning-display">
          <WarningCounter count={warningCount} />
          <span className="warning-text">
            {warningCount}/3 Warnings
          </span>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="member-card-actions">
          <Link href={`/admin/members/${id}`} className="btn btn-secondary btn-sm">
            <Eye size={14} />
            View Profile
          </Link>
          {canIssueWarning && (
            <button 
              className={`btn btn-warning btn-sm ${isReadOnly ? 'btn-disabled' : ''}`}
              onClick={() => !isReadOnly && onIssueWarning?.(member)}
              disabled={isReadOnly}
              title={isReadOnly ? 'Read-only mode - Write operations disabled' : 'Issue Warning'}
            >
              <AlertTriangle size={14} />
              {isReadOnly ? 'Read-Only' : 'Issue Warning'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * MemberRow - Table row variant for member listing
 */
export function MemberRow({ member, onIssueWarning, onViewProfile, isReadOnly = false }) {
  const isDropped = member.status === 'dropped';
  const canIssueWarning = !isDropped && member.warningCount < 3;

  return (
    <tr className={isDropped ? 'row-dropped' : ''}>
      <td>
        <div className="member-cell">
          <div className="member-avatar-sm">
            {member.profileImage ? (
              <Image 
                src={member.profileImage} 
                alt={member.name} 
                width={32} 
                height={32}
                className="member-avatar-img"
              />
            ) : (
              <span className="member-avatar-initials">
                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            )}
          </div>
          <div>
            <span className="member-name">{member.name}</span>
            <span className="member-email">{member.email}</span>
          </div>
        </div>
      </td>
      <td>
        <span className="member-role-cell">{member.role}</span>
      </td>
      <td>
        <WarningCounter count={member.warningCount} />
      </td>
      <td>
        <StatusBadge status={member.status} />
      </td>
      <td>
        <div className="table-actions">
          <button 
            className="btn btn-ghost btn-icon"
            onClick={() => onViewProfile?.(member)}
            title="View Profile"
          >
            <Eye size={16} />
          </button>
          {canIssueWarning && (
            <button 
              className={`btn btn-ghost btn-icon ${isReadOnly ? 'btn-disabled' : ''}`}
              onClick={() => !isReadOnly && onIssueWarning?.(member)}
              disabled={isReadOnly}
              title={isReadOnly ? 'Read-only mode' : 'Issue Warning'}
            >
              <AlertTriangle size={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
