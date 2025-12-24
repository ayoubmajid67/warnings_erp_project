'use client';

import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AuthContext } from '@/providers/AuthProvider';
import Sidebar from '@/components/sidebar/Sidebar';
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  MessageSquare, 
  Users, 
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Scale,
  Target,
  Rocket,
  ExternalLink,
  Crown,
  Github,
  Linkedin,
  Globe
} from 'lucide-react';
import '../dashboard.css';
import './policy.css';

// Role color mapping
const roleColors = {
  'Backend': { bg: 'rgba(34, 197, 94, 0.15)', border: '#22c55e', text: '#4ade80' },
  'Frontend': { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', text: '#60a5fa' },
  'AI/ML': { bg: 'rgba(168, 85, 247, 0.15)', border: '#a855f7', text: '#c084fc' },
  'DevOps': { bg: 'rgba(249, 115, 22, 0.15)', border: '#f97316', text: '#fb923c' },
  'Data': { bg: 'rgba(236, 72, 153, 0.15)', border: '#ec4899', text: '#f472b6' },
};

// Team members data organized by role
const teamMembers = [
  { name: 'Alae Eddine', role: 'Backend', image: '/profiles/Alae_Eddine_Acheache/profile.png' },
  { name: 'Amine Charro', role: 'Backend', image: '/profiles/Amine_Charro/profile.png' },
  { name: 'Brahim Bouaz', role: 'Backend', image: '/profiles/Brahim_Bouaz/profile.png' },
  { name: 'Ayman El Hilali', role: 'DevOps', image: '/profiles/Ayman_El_Hilali/profile.png' },
  { name: 'Amal Lastak', role: 'AI/ML', image: '/profiles/Amal_Lastak/profile.png' },
  { name: 'El Fahim Sana', role: 'AI/ML', image: '/profiles/El_Fahim_Sana/profile.png' },
  { name: 'Nisrine Amroug', role: 'AI/ML', image: '/profiles/Nisrine_Amroug/profile.png' },
  { name: 'Wafae El Kari', role: 'Frontend', image: '/profiles/Wafae_El_Kari/profile.png' },
  { name: 'Ibtissam Khannij', role: 'Frontend', image: '/profiles/Ibtissam_Khannij/profile.png' },
  { name: 'Yasser Touil', role: 'Frontend', image: '/profiles/Yasser_Touil/profile.png' },
  { name: 'Khadija Anhayfou', role: 'Data', image: '/profiles/Khadija_Anhayfou/profile.png' },
];

export default function WarningPolicyPage() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-main">
        <div className="dashboard-content policy-page">
          {/* Hero Header */}
          <div className="policy-hero">
            <div className="policy-hero-content">
              <Image 
                src="/assets/logo.png" 
                alt="ERP Team Logo" 
                width={80} 
                height={80}
                className="policy-logo"
              />
              <div>
                <h1 className="page-title">Warning Policy &amp; Guidelines</h1>
                <p className="page-subtitle">INTELLCAP ERP Solutions - Team Accountability System</p>
              </div>
            </div>
          </div>

          {/* 2-Column Grid */}
          <div className="policy-grid">
            {/* Project Vision */}
            <section className="policy-section glass-card-static full-width project-vision">
              <div className="vision-header">
                <div className="section-header-icon vision">
                  <Target size={24} />
                </div>
                <h2>Project Vision</h2>
                <a 
                  href="https://majjid.com/project.html?project=#intellcap-system" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  <ExternalLink size={16} />
                  View Project
                </a>
              </div>
              
              <p className="vision-text">
                We&apos;re building a solution to <strong>automate and centralize all internal operations</strong> at 
                INTELLCAP SARL, Filiale Africa/Morocco — from recruitment to project management — using a 
                scalable, modular microservices architecture.
              </p>

              <div className="phase-cards">
                <div className="phase-card">
                  <Rocket size={20} />
                  <h3>Phase 1: CVs Service</h3>
                  <p>Smart recruitment management system handling <strong>1,200+ candidates</strong></p>
                </div>
                <div className="phase-card active">
                  <Shield size={20} />
                  <h3>Warning System</h3>
                  <p>Team accountability and warning tracking - <strong>Complete</strong></p>
                </div>
              </div>

              <p className="vision-note">
                🧩 We&apos;re currently in the <strong>System Design Phase</strong> of the recruitment module, 
                laying the groundwork for scalability and long-term performance.
              </p>
            </section>

            {/* Team Hierarchy */}
            <section className="policy-section glass-card-static full-width team-section">
              <div className="team-header">
                <div className="section-header-icon team">
                  <Users size={24} />
                </div>
                <h2>Our Team</h2>
                <div className="team-count">{teamMembers.length + 1} Members</div>
              </div>
              
              {/* Team Hierarchy */}
              <div className="team-hierarchy">
                {/* Leader Level */}
                <div className="hierarchy-level leader-level">
                  <div className="leader-card">
                    <div className="leader-glow"></div>
                    <div className="leader-badge">
                      <Crown size={16} />
                      <span>Team Lead</span>
                    </div>
                    
                    <div className="leader-avatar-wrapper">
                      <div className="leader-ring"></div>
                      <div className="leader-ring delay-1"></div>
                      <div className="leader-avatar">
                        <Image 
                          src="/profiles/Ayoub_Majjid/profile.png" 
                          alt="Ayoub Majjid"
                          width={90}
                          height={90}
                          className="avatar-img"
                        />
                      </div>
                    </div>
                    
                    <div className="leader-details">
                      <h3 className="leader-name">Ayoub Majjid</h3>
                      <span className="leader-title">Tech Lead &amp; Solution Architect</span>
                      
                      <div className="leader-links">
                        <a href="https://majjid.com" target="_blank" rel="noopener noreferrer" className="leader-social" title="Portfolio">
                          <Globe size={16} />
                        </a>
                        <a href="https://github.com/ayoubmajid67" target="_blank" rel="noopener noreferrer" className="leader-social" title="GitHub">
                          <Github size={16} />
                        </a>
                        <a href="https://www.linkedin.com/in/youbista/" target="_blank" rel="noopener noreferrer" className="leader-social" title="LinkedIn">
                          <Linkedin size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector */}
                <div className="hierarchy-connector">
                  <div className="connector-line"></div>
                  <div className="connector-branches"></div>
                </div>

                {/* Role Legend */}
                <div className="role-legend">
                  {Object.entries(roleColors).map(([role, colors]) => (
                    <div key={role} className="legend-item" style={{ '--role-color': colors.text }}>
                      <span className="legend-dot" style={{ background: colors.border }}></span>
                      <span>{role}</span>
                    </div>
                  ))}
                </div>

                {/* Team Members Grid */}
                <div className="members-level">
                  <div className="members-grid">
                    {teamMembers.map((member, index) => {
                      const colors = roleColors[member.role] || roleColors['Backend'];
                      return (
                        <div 
                          key={member.name}
                          className="member-card"
                          style={{ 
                            '--delay': `${index * 0.08}s`,
                            '--role-bg': colors.bg,
                            '--role-border': colors.border,
                            '--role-text': colors.text
                          }}
                        >
                          <div className="member-avatar-wrapper">
                            <div className="member-avatar">
                              <Image 
                                src={member.image} 
                                alt={member.name}
                                width={64}
                                height={64}
                                className="avatar-img"
                              />
                            </div>
                            <div className="member-status"></div>
                          </div>
                          
                          <div className="member-info">
                            <span className="member-name">{member.name}</span>
                            <span className="member-role">{member.role}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* Why This System */}
            <section className="policy-section glass-card-static">
              <div className="section-header-icon">
                <Shield size={24} />
              </div>
              <h2>Why This System?</h2>
              <p>
                Managing a team of <strong>17+ people</strong> across multiple domains requires 
                clear expectations and accountability.
              </p>
              <ul className="policy-list">
                <li>Establish clear expectations for everyone</li>
                <li>Fair warning system before consequences</li>
                <li>Maintain productivity and deadlines</li>
                <li>Protect team morale</li>
                <li>Scale as the team grows</li>
              </ul>
            </section>

            {/* Warning Levels */}
            <section className="policy-section glass-card-static">
              <div className="section-header-icon warning">
                <AlertTriangle size={24} />
              </div>
              <h2>The 3-Warning System</h2>
              
              <div className="warning-levels">
                <div className="warning-level level-0">
                  <div className="level-icon"><CheckCircle size={24} /></div>
                  <div className="level-content">
                    <h3>0 Warnings - Good Standing</h3>
                    <p>Meeting all expectations.</p>
                  </div>
                </div>
                
                <div className="warning-level level-1">
                  <div className="level-icon"><AlertCircle size={24} /></div>
                  <div className="level-content">
                    <h3>1 Warning - First Notice</h3>
                    <p>Formal notice issued.</p>
                  </div>
                </div>
                
                <div className="warning-level level-2">
                  <div className="level-icon"><AlertTriangle size={24} /></div>
                  <div className="level-content">
                    <h3>2 Warnings - At Risk</h3>
                    <p>One more = removal.</p>
                  </div>
                </div>
                
                <div className="warning-level level-3">
                  <div className="level-icon"><XCircle size={24} /></div>
                  <div className="level-content">
                    <h3>3 Warnings - Dropped</h3>
                    <p>Removed from team.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Warning Qualifications - Full Width */}
            <section className="policy-section glass-card-static full-width">
              <div className="section-header-icon">
                <FileText size={24} />
              </div>
              <h2>What Can Result in a Warning?</h2>
              
              <div className="qualification-grid">
                <div className="qualification-card">
                  <div className="qual-icon"><MessageSquare size={20} /></div>
                  <h3>Communication Failures</h3>
                  <ul>
                    <li>No response for 2+ weeks without notice</li>
                    <li>Ignoring direct requests from leads</li>
                    <li>Being unreachable without informing the team</li>
                  </ul>
                </div>

                <div className="qualification-card">
                  <div className="qual-icon"><Clock size={20} /></div>
                  <h3>Task &amp; Delivery Issues</h3>
                  <ul>
                    <li>Missing assigned stories without valid excuse</li>
                    <li>Not notifying 48h before deadline</li>
                    <li>Making promises you can&apos;t keep</li>
                    <li>Repeated missed deadlines</li>
                  </ul>
                </div>

                <div className="qualification-card">
                  <div className="qual-icon"><Shield size={20} /></div>
                  <h3>Professional Conduct</h3>
                  <ul>
                    <li>Unprofessional or disrespectful behavior</li>
                    <li>Refusing to take accountability</li>
                    <li>Missing meetings without notice</li>
                    <li>Consistently poor work quality</li>
                  </ul>
                </div>

                <div className="qualification-card">
                  <div className="qual-icon"><Users size={20} /></div>
                  <h3>Team Collaboration</h3>
                  <ul>
                    <li>Not sharing progress updates</li>
                    <li>Blocking other team members</li>
                    <li>Refusing to help when needed</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Key Principle - Full Width */}
            <section className="policy-section glass-card-static highlight-section full-width">
              <blockquote className="key-principle">
                <span className="quote-mark">&ldquo;</span>
                Don&apos;t promise to do something unless you&apos;re sure you can do it.
                <span className="quote-mark">&rdquo;</span>
              </blockquote>
              <p className="principle-explanation">
                Be honest about your capacity, communicate early when problems arise, and only commit to what you can deliver.
              </p>
            </section>

            {/* Important Timelines */}
            <section className="policy-section glass-card-static">
              <div className="section-header-icon">
                <Clock size={24} />
              </div>
              <h2>Important Timelines</h2>
              
              <div className="timeline-cards compact">
                <div className="timeline-card">
                  <span className="timeline-value">48h</span>
                  <span className="timeline-label">Notify before missing deadline</span>
                </div>
                <div className="timeline-card">
                  <span className="timeline-value">24h</span>
                  <span className="timeline-label">Notice before missing meeting</span>
                </div>
                <div className="timeline-card">
                  <span className="timeline-value">14 days</span>
                  <span className="timeline-label">Max response time</span>
                </div>
                <div className="timeline-card">
                  <span className="timeline-value">7 days</span>
                  <span className="timeline-label">Appeal window</span>
                </div>
              </div>
            </section>

            {/* Appeal Process */}
            <section className="policy-section glass-card-static">
              <h2>Appeal Process</h2>
              <p>If you believe a warning was issued unfairly:</p>
              <ol className="appeal-steps">
                <li>Contact your team manager within <strong>7 days</strong> of receiving the warning</li>
                <li>Provide documentation or evidence supporting your case</li>
                <li>The manager will review and make a final decision</li>
              </ol>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}
