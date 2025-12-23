import { NextResponse } from 'next/server';
import { issueWarning, findMemberById } from '@/app/db/members';
import { 
  createWarningNotification, 
  createDropoutNotification,
  logWarningAction 
} from '@/app/db/notifications';
import { sendWarningEmail, sendDropoutEmail } from '@/utils/email';
import { verifyToken } from '@/utils/auth';

/**
 * POST /api/warnings - Issue a warning to a member (admin only)
 */
export async function POST(request) {
  try {
    const user = verifyToken(request);

    // Only admin can issue warnings
    if (user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { memberId, reason } = body;

    if (!memberId || !reason) {
      return NextResponse.json(
        { message: 'Member ID and reason are required' },
        { status: 400 }
      );
    }

    // Issue the warning
    const result = issueWarning(memberId, reason, user.username || user.email);

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      );
    }

    // Create notification for the member
    const member = result.member;
    
    if (result.isDropped) {
      // Member was dropped (reached 3 warnings)
      createDropoutNotification(memberId);
      // Send dropout email
      await sendDropoutEmail(member.email, member.name);
    } else {
      // Regular warning notification for member
      createWarningNotification(memberId, member.warningCount, reason);
      // Send warning email to member
      await sendWarningEmail(member.email, member.name, member.warningCount, reason);
    }

    // Create action log for admin
    logWarningAction(memberId, member.name, member.warningCount, reason);

    return NextResponse.json({
      message: result.message,
      member: result.member,
      warning: result.warning,
      isDropped: result.isDropped,
      emailSent: true
    });

  } catch (error) {
    console.error('Error issuing warning:', error);
    if (error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

/**
 * GET /api/warnings - Get warning history (for current user or all for admin)
 */
export async function GET(request) {
  try {
    const user = verifyToken(request);

    if (user.role === 'admin') {
      // Admin can see all members with their warnings
      const { getMembers } = require('@/app/db/members');
      const members = getMembers();
      const warningData = members.map(m => ({
        memberId: m.id,
        memberName: m.name,
        warningCount: m.warningCount,
        warnings: m.warnings,
        status: m.status
      }));
      
      return NextResponse.json({ warnings: warningData });
    }

    // Regular user can only see their own warnings
    if (!user.memberId) {
      return NextResponse.json({ warnings: [] });
    }

    const member = findMemberById(user.memberId);
    
    if (!member) {
      return NextResponse.json({ warnings: [] });
    }

    return NextResponse.json({
      warningCount: member.warningCount,
      warnings: member.warnings,
      status: member.status
    });

  } catch (error) {
    if (error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
