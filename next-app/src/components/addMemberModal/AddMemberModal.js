'use client';

import { useState, useRef } from 'react';
import { X, Upload, FileText, Image, AlertCircle, CheckCircle } from 'lucide-react';
import './AddMemberModal.css';

// Example templates for JSON validation
const PROFILE_DATA_EXAMPLE = {
  phoneNumber: "212 XXX-XXXXXX",
  email: "email@example.com",
  github: "https://github.com/username",
  linkedin: "https://linkedin.com/in/username",
  role: "Developer Role - Service Name"
};

const CV_DATA_EXAMPLE = {
  name: "FULL NAME UPPERCASE",
  description: "Professional summary describing the member's expertise and goals.",
  domain: "Area of expertise (e.g., Fullstack Web Development)",
  skills: [
    { name: "JavaScript", category: "Front-End" },
    { name: "React", category: "Front-End" },
    { name: "Node.js", category: "Back-End" }
  ],
  experiences: [
    {
      company: "Company Name",
      role: "Job Title",
      description: "Description of responsibilities and achievements.",
      startDate: "January 2024",
      endDate: null
    }
  ],
  projects: [
    {
      name: "Project Name",
      description: "Brief project description."
    }
  ],
  education: [
    {
      school: "University Name",
      degree: "Degree Title",
      period: "2020 - 2024"
    }
  ],
  languages: [
    { name: "English", level: "C1" },
    { name: "French", level: "B2" }
  ]
};

// Required fields validation
const PROFILE_REQUIRED_FIELDS = ['phoneNumber', 'email', 'role'];
const CV_REQUIRED_FIELDS = ['name', 'description', 'domain'];

export default function AddMemberModal({ isOpen, onClose, onSubmit, isLoading }) {
  const [profileDataStr, setProfileDataStr] = useState(JSON.stringify(PROFILE_DATA_EXAMPLE, null, 2));
  const [cvDataStr, setCvDataStr] = useState(JSON.stringify(CV_DATA_EXAMPLE, null, 2));
  const [profileFile, setProfileFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [validationStatus, setValidationStatus] = useState({ profile: null, cv: null });

  const profileInputRef = useRef(null);
  const cvInputRef = useRef(null);

  // Validate JSON structure and required fields
  const validateJson = (jsonStr, requiredFields, type) => {
    try {
      const parsed = JSON.parse(jsonStr);
      const missingFields = requiredFields.filter(field => !parsed[field] || parsed[field] === '');
      
      if (missingFields.length > 0) {
        return { valid: false, error: `Missing required fields: ${missingFields.join(', ')}`, parsed: null };
      }
      
      return { valid: true, error: null, parsed };
    } catch (e) {
      return { valid: false, error: `Invalid JSON: ${e.message}`, parsed: null };
    }
  };

  // Handle profile data change with validation
  const handleProfileDataChange = (value) => {
    setProfileDataStr(value);
    const result = validateJson(value, PROFILE_REQUIRED_FIELDS, 'profile');
    setValidationStatus(prev => ({ ...prev, profile: result.valid }));
    setErrors(prev => ({ ...prev, profileData: result.error }));
  };

  // Handle CV data change with validation
  const handleCvDataChange = (value) => {
    setCvDataStr(value);
    const result = validateJson(value, CV_REQUIRED_FIELDS, 'cv');
    setValidationStatus(prev => ({ ...prev, cv: result.valid }));
    setErrors(prev => ({ ...prev, cvData: result.error }));
  };

  // Handle file selection
  const handleProfileFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profileFile: 'Please select an image file (PNG, JPG)' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profileFile: 'File size must be less than 5MB' }));
        return;
      }
      setProfileFile(file);
      setErrors(prev => ({ ...prev, profileFile: null }));
    }
  };

  const handleCvFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, cvFile: 'Please select a PDF file' }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, cvFile: 'File size must be less than 10MB' }));
        return;
      }
      setCvFile(file);
      setErrors(prev => ({ ...prev, cvFile: null }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const profileResult = validateJson(profileDataStr, PROFILE_REQUIRED_FIELDS, 'profile');
    const cvResult = validateJson(cvDataStr, CV_REQUIRED_FIELDS, 'cv');
    
    const newErrors = {};
    
    if (!profileResult.valid) newErrors.profileData = profileResult.error;
    if (!cvResult.valid) newErrors.cvData = cvResult.error;
    if (!profileFile) newErrors.profileFile = 'Profile image is required';
    if (!cvFile) newErrors.cvFile = 'CV file is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('profileData', profileDataStr);
    formData.append('cvData', cvDataStr);
    formData.append('profileImage', profileFile);
    formData.append('cvFile', cvFile);
    
    await onSubmit(formData, profileResult.parsed, cvResult.parsed);
  };

  // Reset form
  const handleClose = () => {
    setProfileDataStr(JSON.stringify(PROFILE_DATA_EXAMPLE, null, 2));
    setCvDataStr(JSON.stringify(CV_DATA_EXAMPLE, null, 2));
    setProfileFile(null);
    setCvFile(null);
    setErrors({});
    setValidationStatus({ profile: null, cv: null });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="add-member-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Team Member</h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Profile Data JSON */}
          <div className="form-section">
            <div className="section-header">
              <h3>Profile Data (JSON)</h3>
              {validationStatus.profile !== null && (
                <span className={`validation-badge ${validationStatus.profile ? 'valid' : 'invalid'}`}>
                  {validationStatus.profile ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {validationStatus.profile ? 'Valid' : 'Invalid'}
                </span>
              )}
            </div>
            <p className="section-hint">
              Required fields: <code>phoneNumber</code>, <code>email</code>, <code>role</code>
            </p>
            <textarea
              className={`json-textarea ${errors.profileData ? 'error' : ''}`}
              value={profileDataStr}
              onChange={(e) => handleProfileDataChange(e.target.value)}
              rows={10}
              placeholder="Enter profile data as JSON..."
            />
            {errors.profileData && (
              <p className="error-message"><AlertCircle size={14} /> {errors.profileData}</p>
            )}
          </div>

          {/* CV Data JSON */}
          <div className="form-section">
            <div className="section-header">
              <h3>CV Data (JSON)</h3>
              {validationStatus.cv !== null && (
                <span className={`validation-badge ${validationStatus.cv ? 'valid' : 'invalid'}`}>
                  {validationStatus.cv ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {validationStatus.cv ? 'Valid' : 'Invalid'}
                </span>
              )}
            </div>
            <p className="section-hint">
              Required fields: <code>name</code>, <code>description</code>, <code>domain</code>
            </p>
            <textarea
              className={`json-textarea ${errors.cvData ? 'error' : ''}`}
              value={cvDataStr}
              onChange={(e) => handleCvDataChange(e.target.value)}
              rows={20}
              placeholder="Enter CV data as JSON..."
            />
            {errors.cvData && (
              <p className="error-message"><AlertCircle size={14} /> {errors.cvData}</p>
            )}
          </div>

          {/* File Uploads */}
          <div className="form-section files-section">
            <h3>Files</h3>
            <div className="file-uploads">
              {/* Profile Image */}
              <div className="file-upload-box">
                <input
                  type="file"
                  ref={profileInputRef}
                  accept="image/png,image/jpeg"
                  onChange={handleProfileFileChange}
                  hidden
                />
                <div 
                  className={`upload-area ${profileFile ? 'has-file' : ''} ${errors.profileFile ? 'error' : ''}`}
                  onClick={() => profileInputRef.current?.click()}
                >
                  <Image size={24} />
                  <span>{profileFile ? profileFile.name : 'Profile Image (PNG/JPG)'}</span>
                </div>
                {errors.profileFile && (
                  <p className="error-message"><AlertCircle size={14} /> {errors.profileFile}</p>
                )}
              </div>

              {/* CV File */}
              <div className="file-upload-box">
                <input
                  type="file"
                  ref={cvInputRef}
                  accept="application/pdf"
                  onChange={handleCvFileChange}
                  hidden
                />
                <div 
                  className={`upload-area ${cvFile ? 'has-file' : ''} ${errors.cvFile ? 'error' : ''}`}
                  onClick={() => cvInputRef.current?.click()}
                >
                  <FileText size={24} />
                  <span>{cvFile ? cvFile.name : 'CV File (PDF)'}</span>
                </div>
                {errors.cvFile && (
                  <p className="error-message"><AlertCircle size={14} /> {errors.cvFile}</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Adding Member...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
