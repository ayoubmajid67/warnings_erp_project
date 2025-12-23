'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import Sidebar from '@/components/sidebar/Sidebar';
import { WarningCounter, StatusBadge } from '@/components/warningBadge/WarningBadge';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  Calendar, 
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  Globe,
  Clock,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';
import '../../dashboard.css';
import './member-profile.css';

export default function ViewMemberProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { isAdmin, getToken } = useContext(AuthContext);
  
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect admin to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, router]);

  // Fetch member data
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await fetch(`/api/members/${params.id}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        
        if (!response.ok) throw new Error('Failed to fetch member');
        
        const data = await response.json();
        setMember(data.member);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!isAdmin && params.id) {
      fetchMember();
    }
  }, [isAdmin, params.id, getToken]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const groupSkillsByCategory = (skills = []) => {
    return skills.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill.name);
      return acc;
    }, {});
  };

  if (isAdmin) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Back Button */}
          <button 
            className="back-btn"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading profile...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
            </div>
          ) : member ? (
            <div className="view-profile-layout">
              {/* Profile Header Card */}
              <div className="view-profile-card glass-card-static">
                <div className="view-profile-header">
                  <div className="view-profile-avatar">
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
                  <div className="view-profile-info">
                    <h1 className="view-profile-name">{member.name}</h1>
                    <p className="view-profile-role">{member.role}</p>
                    <p className="view-profile-domain">{member.domain}</p>
                  </div>
                </div>

                <div className="view-profile-contact">
                  <a href={`mailto:${member.email}`} className="view-contact-item">
                    <Mail size={16} />
                    <span>{member.email}</span>
                  </a>
                  {member.phone && (
                    <div className="view-contact-item">
                      <Phone size={16} />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="view-contact-item link">
                      <Github size={16} />
                      <span>GitHub</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="view-contact-item link">
                      <Linkedin size={16} />
                      <span>LinkedIn</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                <div className="view-profile-joined">
                  <Calendar size={14} />
                  <span>Joined {formatDate(member.joinedAt)}</span>
                </div>
              </div>

              {/* Warning Status Section */}
              <section className="view-section glass-card-static warning-section">
                <h2 className="view-section-title">
                  <AlertTriangle size={20} />
                  Warning Status
                </h2>
                <div className="warning-status-display">
                  <div className="warning-status-left">
                    <WarningCounter count={member.warningCount || 0} size="medium" />
                    <div className="warning-status-info">
                      <span className="warning-count-text">
                        {member.warningCount || 0}/3 Warnings
                      </span>
                      <StatusBadge status={member.status} />
                    </div>
                  </div>
                  {member.warnings && member.warnings.length > 0 && (
                    <div className="warning-history-brief">
                      <span className="history-label">Last warning:</span>
                      <span className="history-date">
                        {formatDate(member.warnings[member.warnings.length - 1].issuedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </section>

              {/* About Section */}
              {member.description && (
                <section className="view-section glass-card-static">
                  <h2 className="view-section-title">
                    <Briefcase size={20} />
                    About
                  </h2>
                  <p className="view-description">{member.description}</p>
                </section>
              )}

              {/* Skills Section */}
              {member.skills && member.skills.length > 0 && (
                <section className="view-section glass-card-static">
                  <h2 className="view-section-title">
                    <Code size={20} />
                    Skills
                  </h2>
                  <div className="skills-grid">
                    {Object.entries(groupSkillsByCategory(member.skills)).map(([category, skills]) => (
                      <div key={category} className="skill-category">
                        <h4 className="skill-category-name">{category}</h4>
                        <div className="skill-tags">
                          {skills.map((skill, i) => (
                            <span key={i} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Education Section */}
              {member.education && member.education.length > 0 && (
                <section className="view-section glass-card-static">
                  <h2 className="view-section-title">
                    <GraduationCap size={20} />
                    Education
                  </h2>
                  <div className="education-list">
                    {member.education.map((edu, index) => (
                      <div key={index} className="education-item">
                        <h3 className="edu-school">{edu.school}</h3>
                        <p className="edu-degree">{edu.degree}</p>
                        {edu.period && (
                          <span className="edu-period">{edu.period}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Languages Section */}
              {member.languages && member.languages.length > 0 && (
                <section className="view-section glass-card-static">
                  <h2 className="view-section-title">
                    <Globe size={20} />
                    Languages
                  </h2>
                  <div className="languages-list">
                    {member.languages.map((lang, index) => (
                      <div key={index} className="language-item">
                        <span className="language-name">{lang.name}</span>
                        <span className="language-level">{lang.level}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="error-state">
              <p>Member not found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
