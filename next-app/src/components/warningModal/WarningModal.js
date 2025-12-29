'use client';

import { useState } from 'react';
import { X, AlertTriangle, Upload, FileText, Trash2 } from 'lucide-react';
import { WarningCounter } from '@/components/warningBadge/WarningBadge';
import { useEnvironment } from '@/hooks/useEnvironment';
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
  const [proofFile, setProofFile] = useState(null);
  const [error, setError] = useState('');
  const { isProduction } = useEnvironment();

  if (!isOpen || !member) return null;

  const newWarningCount = member.warningCount + 1;
  const willBeDropped = newWarningCount >= 3;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF, PNG, and JPG files are allowed');
        return;
      }
      setProofFile(file);
      setError('');
    }
  };

  const removeFile = () => {
    setProofFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isProduction) {
      setError('Write operations are disabled in production mode');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for the warning');
      return;
    }

    if (!proofFile) {
      setError('Proof document is required');
      return;
    }

    // Pass file along with the warning data
    onConfirm(member.id, reason, proofFile);
    setReason('');
    setProofFile(null);
    setError('');
  };

  const handleClose = () => {
    setReason('');
    setProofFile(null);
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

        {/* Production Mode Banner */}
        {isProduction && (
          <div className="production-banner">
            <AlertTriangle size={16} />
            <span>Read-only mode - Write operations disabled in production</span>
          </div>
        )}

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
                className={`form-input form-textarea ${error && !reason.trim() ? 'error' : ''}`}
                placeholder="Describe the reason for issuing this warning..."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error && e.target.value.trim()) setError('');
                }}
                rows={4}
                disabled={isProduction}
              />
            </div>

            {/* Proof Document Upload */}
            <div className="form-group">
              <label className="form-label">
                Proof Document *
              </label>
              <p className="form-hint">Upload evidence supporting this warning (PDF, PNG, JPG - max 5MB)</p>
              
              {!proofFile ? (
                <label className={`file-upload-area ${isProduction ? 'disabled' : ''}`}>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="file-input-hidden"
                    disabled={isProduction}
                  />
                  <Upload size={24} />
                  <span>Click to upload or drag and drop</span>
                  <span className="file-types">PDF, PNG, or JPG</span>
                </label>
              ) : (
                <div className="file-preview">
                  <div className="file-info">
                    <FileText size={20} />
                    <div className="file-details">
                      <span className="file-name">{proofFile.name}</span>
                      <span className="file-size">{(proofFile.size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="file-remove" 
                    onClick={removeFile}
                    disabled={isProduction}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {error && <span className="form-error">{error}</span>}

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
              className={`btn ${willBeDropped ? 'btn-danger' : 'btn-warning'} ${isProduction ? 'btn-disabled' : ''}`}
              disabled={isLoading || isProduction}
              title={isProduction ? 'Read-only mode - Write operations disabled' : ''}
            >
              {isLoading ? 'Processing...' : isProduction ? 'Read-Only Mode' : willBeDropped ? 'Drop Member' : 'Issue Warning'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
