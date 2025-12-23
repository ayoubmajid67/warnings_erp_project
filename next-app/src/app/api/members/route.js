import { NextResponse } from 'next/server';
import { getMembers, addMember, getMemberStats, disableMember, findMemberByEmail } from '@/app/db/members';
import { verifyToken } from '@/utils/auth';
import { hashPassword } from '@/utils/hash';
import fs from 'fs';
import path from 'path';

// Server-side check for write operations (local env only)
const isWriteAllowed = () => {
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV || 'local';
  return appEnv === 'local';
};

/**
 * GET /api/members - Get all members (authenticated users)
 * Admin gets full stats, regular members get member list only
 */
export async function GET(request) {
  try {
    // Verify authentication - all authenticated users can view members
    const user = verifyToken(request);
    
    const members = getMembers();
    
    // Filter out disabled members for display (unless admin requests all)
    const url = new URL(request.url);
    const includeDisabled = url.searchParams.get('includeDisabled') === 'true';
    const visibleMembers = includeDisabled 
      ? members 
      : members.filter(m => m.status !== 'disabled');
    
    // Admin gets full stats
    if (user.role === 'admin') {
      const stats = getMemberStats();
      return NextResponse.json({ 
        members: visibleMembers, 
        stats,
        total: visibleMembers.length 
      });
    }
    
    // Regular members get member list only (no stats)
    return NextResponse.json({ 
      members: visibleMembers,
      total: visibleMembers.length 
    });

  } catch (error) {
    if (error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/members - Create a new member (admin only, local env only)
 */
export async function POST(request) {
  try {
    // Check if writes are allowed (local env only)
    if (!isWriteAllowed()) {
      return NextResponse.json(
        { message: 'Write operations not allowed in production' },
        { status: 403 }
      );
    }

    const user = verifyToken(request);
    
    if (user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const profileDataStr = formData.get('profileData');
    const cvDataStr = formData.get('cvData');
    const profileImage = formData.get('profileImage');
    const cvFile = formData.get('cvFile');

    if (!profileDataStr || !cvDataStr) {
      return NextResponse.json(
        { message: 'Profile data and CV data are required' },
        { status: 400 }
      );
    }

    // Parse JSON data
    let profileData, cvData;
    try {
      profileData = JSON.parse(profileDataStr);
      cvData = JSON.parse(cvDataStr);
    } catch (e) {
      return NextResponse.json(
        { message: 'Invalid JSON data' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!profileData.email || !profileData.role || !cvData.name) {
      return NextResponse.json(
        { message: 'Email, role, and name are required' },
        { status: 400 }
      );
    }

    // Check if member already exists
    const existingMember = findMemberByEmail(profileData.email);
    if (existingMember) {
      return NextResponse.json(
        { message: 'A member with this email already exists' },
        { status: 400 }
      );
    }

    // Create profile directory name (Firstname_Lastname format)
    const nameParts = cvData.name.split(' ');
    const dirName = nameParts
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join('_');
    
    const profileDir = path.join(process.cwd(), 'public', 'profiles', dirName);

    // Create profile directory
    if (!fs.existsSync(profileDir)) {
      fs.mkdirSync(profileDir, { recursive: true });
    }

    // Save profile image
    let profileImagePath = '';
    if (profileImage && profileImage.size > 0) {
      const imageBuffer = Buffer.from(await profileImage.arrayBuffer());
      const imagePath = path.join(profileDir, 'profile.png');
      fs.writeFileSync(imagePath, imageBuffer);
      profileImagePath = `/profiles/${dirName}/profile.png`;
    }

    // Save CV file
    let cvPath = '';
    if (cvFile && cvFile.size > 0) {
      const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
      const cvFilePath = path.join(profileDir, 'cv.pdf');
      fs.writeFileSync(cvFilePath, cvBuffer);
      cvPath = `/profiles/${dirName}/cv.pdf`;
    }

    // Create data.js file
    const dataJsContent = `/**
 * Profile Data for ${cvData.name}
 */

export const profileData = ${JSON.stringify(profileData, null, 2)};

export const cvData = ${JSON.stringify(cvData, null, 2)};
`;
    fs.writeFileSync(path.join(profileDir, 'data.js'), dataJsContent);

    // Generate password for user
    const password = generateSecurePassword();
    const hashedPassword = hashPassword(password);

    // Create member ID
    const memberId = `member-${cvData.name.toLowerCase().split(' ')[0]}-${Date.now()}`;

    // Add member to members.json
    const newMember = addMember({
      id: memberId,
      name: cvData.name,
      email: profileData.email,
      phone: profileData.phoneNumber || '',
      role: profileData.role,
      domain: cvData.domain || '',
      description: cvData.description || '',
      profileImage: profileImagePath,
      cvPath: cvPath,
      github: profileData.github || '',
      linkedin: profileData.linkedin || '',
      skills: cvData.skills || [],
      experiences: cvData.experiences || [],
      projects: cvData.projects || [],
      education: cvData.education || [],
      languages: cvData.languages || []
    });

    // Add user to users.json
    const usersPath = path.join(process.cwd(), 'src', 'app', 'db', 'users.json');
    let users = [];
    try {
      users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    } catch (e) {
      users = [];
    }

    const newUser = {
      id: `user-${cvData.name.toLowerCase().split(' ')[0]}-${Date.now()}`,
      username: cvData.name,
      email: profileData.email,
      password: hashedPassword,
      role: 'user',
      memberId: newMember.id,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));

    // Add to passwords secret file
    const secretPath = path.join(process.cwd(), 'src', 'app', 'db', 'passwords_users_secret.json');
    let secrets = { _generated: new Date().toISOString(), _warning: 'KEEP THIS FILE SECRET!', users: {} };
    try {
      secrets = JSON.parse(fs.readFileSync(secretPath, 'utf8'));
    } catch (e) {
      // File doesn't exist, use default
    }

    secrets.users[cvData.name] = {
      email: profileData.email,
      password: password,
      role: 'user'
    };
    secrets._generated = new Date().toISOString();

    fs.writeFileSync(secretPath, JSON.stringify(secrets, null, 2));

    return NextResponse.json({ 
      message: 'Member created successfully',
      member: newMember,
      password: password // Return password for admin to see once
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating member:', error);
    if (error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/members - Disable a member (admin only, local env only)
 */
export async function DELETE(request) {
  try {
    // Check if writes are allowed (local env only)
    if (!isWriteAllowed()) {
      return NextResponse.json(
        { message: 'Write operations not allowed in production' },
        { status: 403 }
      );
    }

    const user = verifyToken(request);
    
    if (user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    const { memberId } = await request.json();

    if (!memberId) {
      return NextResponse.json(
        { message: 'Member ID is required' },
        { status: 400 }
      );
    }

    const disabledMember = disableMember(memberId);

    if (!disabledMember) {
      return NextResponse.json(
        { message: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Member disabled successfully',
      member: disabledMember
    });

  } catch (error) {
    if (error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

/**
 * Generate a secure random password
 */
function generateSecurePassword() {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*';
  const all = uppercase + lowercase + numbers + special;
  
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  for (let i = 4; i < 16; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }
  
  // Shuffle password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
