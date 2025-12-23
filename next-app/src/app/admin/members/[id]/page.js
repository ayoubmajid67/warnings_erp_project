'use client';

import { useState, useEffect, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';
import Sidebar from '@/components/sidebar/Sidebar';
import { StatusBadge, WarningCounter } from '@/components/warningBadge/WarningBadge';
import WarningModal from '@/components/warningModal/WarningModal';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  Calendar, 
  AlertTriangle,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  Globe,
  Clock,
  Download,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';
import '../../admin.css';
import './profile.css';

export default function MemberProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { isAdmin, getToken } = useContext(AuthContext);
  
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [isWarningLoading, setIsWarningLoading] = useState(false);

  // Auth check
  useEffect(() => {
    if (!isAdmin) {
      router.push('/auth/login');
    }
  }, [isAdmin, router]);

  // Fetch member data
  useEffect(() => {
    if (isAdmin && params.id) {
      fetchMember();
    }
  }, [isAdmin, params.id]);

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

      await fetchMember();
      setIsWarningModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsWarningLoading(false);
    }
  };

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

  if (!isAdmin) return null;

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
            Back to Members
          </button>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading member profile...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
            </div>
          ) : member ? (
            <div className="profile-layout">
              {/* Left Column - Profile Card */}
              <aside className="profile-sidebar">
                <div className="profile-card glass-card-static">
                  {/* Avatar & Status */}
                  <div className="profile-avatar-section">
                    <div className="profile-avatar">
                      {member.profileImage ? (
                        <Image 
                          src={member.profileImage} 
                          alt={member.name}
                          width={120}
                          height={120}
                          className="profile-avatar-img"
                        />
                      ) : (
                        <span className="profile-avatar-initials">
                          {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      )}
                    </div>
                    <StatusBadge status={member.status} />
                  </div>

                  {/* Name & Role */}
                  <h1 className="profile-name">{member.name}</h1>
                  <p className="profile-role">{member.role}</p>
                  <p className="profile-domain">{member.domain}</p>

                  {/* Contact Info */}
                  <div className="profile-contact">
                    <a href={`mailto:${member.email}`} className="contact-item">
                      <Mail size={16} />
                      <span>{member.email}</span>
                    </a>
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="contact-item">
                        <Phone size={16} />
                        <span>{member.phone}</span>
                      </a>
                    )}
                    {member.github && (
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className="contact-item">
                        <Github size={16} />
                        <span>GitHub</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="contact-item">
                        <Linkedin size={16} />
                        <span>LinkedIn</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {/* Joined Date */}
                  <div className="profile-joined">
                    <Calendar size={14} />
                    <span>Joined {formatDate(member.joinedAt)}</span>
                  </div>

                  {/* CV Download */}
                  {member.cvPath && (
                    <a 
                      href={member.cvPath} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-secondary w-full mt-4"
                    >
                      <Download size={16} />
                      Download CV
                    </a>
                  )}
                </div>

                {/* Warning Status Card */}
                <div className="warning-card glass-card-static">
                  <h3 className="card-title">
                    <AlertTriangle size={18} />
                    Warning Status
                  </h3>
                  
                  <div className="warning-status-content">
                    <WarningCounter count={member.warningCount} />
                    <span className="warning-count-text">
                      {member.warningCount}/3 Warnings
                    </span>
                  </div>

                  {member.status === 'active' && member.warningCount < 3 && (
                    <button 
                      className="btn btn-warning w-full mt-4"
                      onClick={() => setIsWarningModalOpen(true)}
                    >
                      <AlertTriangle size={16} />
                      Issue Warning
                    </button>
                  )}

                  {/* Warning History */}
                  {member.warnings && member.warnings.length > 0 && (
                    <div className="warning-history-mini">
                      <h4>History</h4>
                      {member.warnings.map((warning, index) => (
                        <div key={warning.id} className="warning-history-item-mini">
                          <span className="warning-num">#{index + 1}</span>
                          <div>
                            <p>{warning.reason}</p>
                            <span className="warning-date-mini">
                              {formatDate(warning.issuedAt)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </aside>

              {/* Right Column - Details */}
              <div className="profile-main">
                {/* About Section */}
                <section className="profile-section glass-card-static">
                  <h2 className="section-title">
                    <Briefcase size={20} />
                    About
                  </h2>
                  <p className="profile-description">{member.description}</p>
                </section>

                {/* Skills Section */}
                {member.skills && member.skills.length > 0 && (
                  <section className="profile-section glass-card-static">
                    <h2 className="section-title">
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

                {/* Experience Section */}
                {member.experiences && member.experiences.length > 0 && (
                  <section className="profile-section glass-card-static">
                    <h2 className="section-title">
                      <Briefcase size={20} />
                      Experience
                    </h2>
                    <div className="experience-list">
                      {member.experiences.map((exp, index) => (
                        <div key={index} className="experience-item">
                          <div className="exp-header">
                            <h3 className="exp-role">{exp.role}</h3>
                            <span className="exp-company">{exp.company}</span>
                          </div>
                          <div className="exp-date">
                            <Clock size={14} />
                            {exp.startDate} - {exp.endDate || 'Present'}
                          </div>
                          <p className="exp-description">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Projects Section */}
                {member.projects && member.projects.length > 0 && (
                  <section className="profile-section glass-card-static">
                    <h2 className="section-title">
                      <FolderOpen size={20} />
                      Projects
                    </h2>
                    <div className="projects-grid">
                      {member.projects.map((project, index) => (
                        <div key={index} className="project-card">
                          <h3 className="project-name">{project.name}</h3>
                          <p className="project-description">{project.description}</p>
                          {project.date && (
                            <span className="project-date">{project.date}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Education Section */}
                {member.education && member.education.length > 0 && (
                  <section className="profile-section glass-card-static">
                    <h2 className="section-title">
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
                  <section className="profile-section glass-card-static">
                    <h2 className="section-title">
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
            </div>
          ) : (
            <div className="error-state">
              <p>Member not found</p>
            </div>
          )}
        </div>
      </main>

      {/* Warning Modal */}
      <WarningModal
        isOpen={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
        member={member}
        onConfirm={handleConfirmWarning}
        isLoading={isWarningLoading}
      />
    </div>
  );
}
