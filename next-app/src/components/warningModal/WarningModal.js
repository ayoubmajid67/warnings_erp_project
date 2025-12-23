'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { WarningCounter } from '@/components/warningBadge/WarningBadge';
import './WarningModal.css';

/**
 * WarningModal - Modal for issuing warnings to members
 */
export default function WarningModal({ 
  isOpen, 
  onClose, 
  member, 
  onConfirm,
  isLoading = false 
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !member) return null;

  const newWarningCount = member.warningCount + 1;
  const willBeDropped = newWarningCount >= 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Please provide a reason for the warning');
      return;
    }

    onConfirm(member.id, reason);
    setReason('');
    setError('');
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal warning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-content">
            <AlertTriangle className="modal-warning-icon" />
            <h2 className="modal-title">Issue Warning</h2>
          </div>
          <button className="modal-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Member Info */}
            <div className="warning-modal-member">
              <div className="member-preview">
                <div className="member-avatar">
                  <span className="member-avatar-initials">
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="member-info">
                  <span className="member-name">{member.name}</span>
                  <span className="member-role">{member.role}</span>
                </div>
              </div>
              <div className="current-warnings">
                <span className="current-label">Current Warnings</span>
                <WarningCounter count={member.warningCount} />
              </div>
            </div>

            {/* Warning Preview */}
            {willBeDropped && (
              <div className="warning-alert danger">
                <AlertTriangle size={20} />
                <div>
                  <strong>Critical Warning</strong>
                  <p>This will be the member&apos;s 3rd warning. They will be immediately dropped from the team and lose access to the platform.</p>
                </div>
              </div>
            )}

            {!willBeDropped && member.warningCount === 1 && (
              <div className="warning-alert caution">
                <AlertTriangle size={20} />
                <div>
                  <strong>Final Warning Notice</strong>
                  <p>This will be the member&apos;s 2nd warning. One more warning will result in removal from the team.</p>
                </div>
              </div>
            )}

            {/* Reason Input */}
            <div className="form-group">
              <label className="form-label" htmlFor="warning-reason">
                Reason for Warning *
              </label>
              <textarea
                id="warning-reason"
                className={`form-input form-textarea ${error ? 'error' : ''}`}
                placeholder="Describe the reason for issuing this warning..."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError('');
                }}
                rows={4}
              />
              {error && <span className="form-error">{error}</span>}
            </div>

            {/* New Status Preview */}
            <div className="warning-preview">
              <span className="preview-label">After this warning:</span>
              <div className="preview-status">
                <WarningCounter count={newWarningCount} />
                <span className={`preview-text ${willBeDropped ? 'dropped' : ''}`}>
                  {willBeDropped ? 'Member will be DROPPED' : `${newWarningCount}/3 Warnings`}
                </span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`btn ${willBeDropped ? 'btn-danger' : 'btn-warning'}`}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : willBeDropped ? 'Drop Member' : 'Issue Warning'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
