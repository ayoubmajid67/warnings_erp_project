/**
 * Members Database
 * Stores team member information with warning system fields
 * Uses JSON file for persistent storage in db directory
 */

import fs from 'fs';
import path from 'path';

// Path to persistent data file (in the same directory as this file)
const DB_DIR = path.join(process.cwd(), 'src', 'app', 'db');
const MEMBERS_FILE = path.join(DB_DIR, 'members.json');

// Default members data
const defaultMembers = [
  {
    id: 'member-alae',
    name: 'ACHEACHE ALAA EDDINE',
    email: 'alaedineacheache@gmail.com',
    phone: '212 623-909851',
    role: 'Back-end Developer - CVS Service',
    domain: 'Fullstack Web Development',
    status: 'active', // 'active' | 'dropped'
    warningCount: 0,
    warnings: [],
    profileImage: '/profiles/Alae_Eddine_Acheache/profile.png',
    cvPath: '/profiles/Alae_Eddine_Acheache/cv.pdf',
    github: 'https://github.com/ALAAEddineACHEACHE',
    linkedin: 'https://www.linkedin.com/in/alaaeddine-acheache/',
    joinedAt: '2024-10-01',
    description: 'Fullstack Web Development Engineering student, passionate about web development with Spring Boot and microservices.'
  },
  {
    id: 'member-amal',
    name: 'AMAL LASTAK',
    email: 'amallastak891@gmail.com',
    phone: '212 612-124695',
    role: 'AI Developer - Email Classification & CVS Service',
    domain: 'Intelligence Artificielle et Robotique',
    status: 'active',
    warningCount: 0,
    warnings: [],
    profileImage: '/profiles/Amal_Lastak/profile.png',
    cvPath: '/profiles/Amal_Lastak/cv.pdf',
    github: 'https://github.com/amallastak',
    linkedin: 'https://www.linkedin.com/in/amal-lastak/',
    joinedAt: '2024-10-01',
    description: 'Ingénieure en IA passionnée par le ML/DL, spécialisée en NLP et Computer Vision.'
  }
];

// ============== File Persistence ==============

/**
 * Load members from file
 */
const loadMembers = () => {
  if (fs.existsSync(MEMBERS_FILE)) {
    try {
      const data = fs.readFileSync(MEMBERS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading members file:', error);
      return defaultMembers;
    }
  }
  
  // Initialize with default data if file doesn't exist
  saveMembers(defaultMembers);
  return defaultMembers;
};

/**
 * Save members to file
 */
const saveMembers = (membersData) => {
  try {
    fs.writeFileSync(MEMBERS_FILE, JSON.stringify(membersData, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving members file:', error);
    return false;
  }
};

// In-memory cache (synced with file)
let members = loadMembers();

// ============== CRUD Operations ==============

/**
 * Get all members
 */
export const getMembers = () => {
  members = loadMembers(); // Refresh from file
  return members;
};

/**
 * Get active members only
 */
export const getActiveMembers = () => {
  members = loadMembers();
  return members.filter(m => m.status === 'active');
};

/**
 * Get dropped members only
 */
export const getDroppedMembers = () => {
  members = loadMembers();
  return members.filter(m => m.status === 'dropped');
};

/**
 * Find member by ID
 */
export const findMemberById = (id) => {
  members = loadMembers();
  return members.find(member => member.id === id);
};

/**
 * Find member by email
 */
export const findMemberByEmail = (email) => {
  members = loadMembers();
  return members.find(member => member.email === email);
};

/**
 * Add a new member
 */
export const addMember = (memberData) => {
  members = loadMembers();
  
  const newMember = {
    id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    status: 'active',
    warningCount: 0,
    warnings: [],
    joinedAt: new Date().toISOString().split('T')[0],
    ...memberData
  };
  
  members.push(newMember);
  saveMembers(members);
  
  return newMember;
};

/**
 * Update member data
 */
export const updateMember = (id, updatedFields) => {
  members = loadMembers();
  
  const index = members.findIndex(member => member.id === id);
  if (index !== -1) {
    members[index] = { ...members[index], ...updatedFields };
    saveMembers(members);
    return members[index];
  }
  return null;
};

/**
 * Delete a member
 */
export const deleteMember = (id) => {
  members = loadMembers();
  
  const index = members.findIndex(member => member.id === id);
  if (index === -1) return false;
  
  members.splice(index, 1);
  saveMembers(members);
  
  return true;
};

/**
 * Disable a member (soft delete - sets status to 'disabled')
 */
export const disableMember = (id) => {
  members = loadMembers();
  
  const index = members.findIndex(member => member.id === id);
  if (index === -1) return false;
  
  members[index].status = 'disabled';
  members[index].disabledAt = new Date().toISOString();
  saveMembers(members);
  
  return members[index];
};

// ============== Warning System ==============

/**
 * Issue a warning to a member
 * @returns {Object} { success: boolean, member: Member, isDropped: boolean, message: string }
 */
export const issueWarning = (memberId, reason, issuedBy) => {
  members = loadMembers();
  
  const member = members.find(m => m.id === memberId);
  
  if (!member) {
    return { success: false, member: null, isDropped: false, message: 'Member not found' };
  }
  
  if (member.status === 'dropped') {
    return { success: false, member, isDropped: true, message: 'Member already dropped out' };
  }
  
  if (member.warningCount >= 3) {
    return { success: false, member, isDropped: true, message: 'Member already has maximum warnings' };
  }
  
  // Create warning record
  const warning = {
    id: `warning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    reason,
    issuedBy,
    issuedAt: new Date().toISOString()
  };
  
  // Update member
  member.warnings.push(warning);
  member.warningCount = member.warnings.length;
  
  // Check if member should be dropped
  if (member.warningCount >= 3) {
    member.status = 'dropped';
    saveMembers(members);
    return { 
      success: true, 
      member, 
      isDropped: true, 
      warning,
      message: 'Warning issued. Member has reached 3 warnings and is now dropped out.' 
    };
  }
  
  saveMembers(members);
  
  return { 
    success: true, 
    member, 
    isDropped: false, 
    warning,
    message: `Warning issued. Member now has ${member.warningCount}/3 warnings.` 
  };
};

/**
 * Get warning history for a member
 */
export const getWarningHistory = (memberId) => {
  const member = findMemberById(memberId);
  return member ? member.warnings : [];
};

/**
 * Get member statistics
 */
export const getMemberStats = () => {
  members = loadMembers();
  
  const total = members.length;
  const active = members.filter(m => m.status === 'active').length;
  const dropped = members.filter(m => m.status === 'dropped').length;
  const atRisk = members.filter(m => m.status === 'active' && m.warningCount >= 2).length;
  
  return { total, active, dropped, atRisk };
};

/**
 * Reset database to default (for testing)
 */
export const resetDatabase = () => {
  members = [...defaultMembers];
  saveMembers(members);
  return true;
};
