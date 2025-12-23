import { NextResponse } from 'next/server';
import { getMembers, addMember, getMemberStats } from '@/app/db/members';
import { verifyToken } from '@/utils/auth';

/**
 * GET /api/members - Get all members (authenticated users)
 * Admin gets full stats, regular members get member list only
 */
export async function GET(request) {
  try {
    // Verify authentication - all authenticated users can view members
    const user = verifyToken(request);
    
    const members = getMembers();
    
    // Admin gets full stats
    if (user.role === 'admin') {
      const stats = getMemberStats();
      return NextResponse.json({ 
        members, 
        stats,
        total: members.length 
      });
    }
    
    // Regular members get member list only (no stats)
    return NextResponse.json({ 
      members,
      total: members.length 
    });

  } catch (error) {
    if (error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/members - Create a new member (admin only)
 */
export async function POST(request) {
  try {
    const user = verifyToken(request);
    
    if (user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, role, phone, github, linkedin, profileImage, cvPath, domain, description } = body;

    if (!name || !email || !role) {
      return NextResponse.json(
        { message: 'Name, email, and role are required' },
        { status: 400 }
      );
    }

    const newMember = addMember({
      name,
      email,
      role,
      phone: phone || '',
      github: github || '',
      linkedin: linkedin || '',
      profileImage: profileImage || '',
      cvPath: cvPath || '',
      domain: domain || '',
      description: description || ''
    });

    return NextResponse.json({ 
      message: 'Member created successfully',
      member: newMember 
    }, { status: 201 });

  } catch (error) {
    if (error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
