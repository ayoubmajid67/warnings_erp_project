import { NextResponse } from 'next/server';
import { findMemberById } from '@/app/db/members';
import { verifyToken } from '@/utils/auth';

/**
 * GET /api/warnings/[warningId]
 * Get details of a specific warning (auth required)
 */
export async function GET(request, { params }) {
  try {
    // Verify authentication
    const user = verifyToken(request);
    
    // Await params (Next.js 15+)
    const { warningId } = await params;

    if (!warningId) {
      return NextResponse.json(
        { error: 'Warning ID is required' },
        { status: 400 }
      );
    }

    // Search for the warning across all members
    const { getMembers } = require('@/app/db/members');
    const members = getMembers();
    
    let foundWarning = null;
    let foundMember = null;

    for (const member of members) {
      const warning = member.warnings.find(w => w.id === warningId);
      if (warning) {
        foundWarning = warning;
        foundMember = member;
        break;
      }
    }

    if (!foundWarning || !foundMember) {
      return NextResponse.json(
        { error: 'Warning not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const isAdmin = user.role === 'admin';
    const isOwnWarning = user.memberId === foundMember.id;

    if (!isAdmin && !isOwnWarning) {
      return NextResponse.json(
        { error: 'You do not have permission to view this warning' },
        { status: 403 }
      );
    }

    // Return warning details
    return NextResponse.json({
      warning: {
        id: foundWarning.id,
        reason: foundWarning.reason,
        issuedBy: foundWarning.issuedBy,
        issuedAt: foundWarning.issuedAt,
        documentPath: foundWarning.documentPath || null
      },
      member: {
        id: foundMember.id,
        name: foundMember.name,
        email: foundMember.email,
        role: foundMember.role,
        profileImage: foundMember.profileImage,
        warningCount: foundMember.warningCount,
        status: foundMember.status
      },
      canView: true,
      viewerRole: user.role
    });

  } catch (error) {
    console.error('Error fetching warning details:', error);
    if (error.message.includes('Token')) {
      return NextResponse.json(
        { error: 'Authentication required', message: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
