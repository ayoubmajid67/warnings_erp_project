import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';
import fs from 'fs';
import path from 'path';

const MEMBERS_FILE = path.join(process.cwd(), 'src', 'app', 'db', 'members.json');

/**
 * POST /api/test-user/reset-warnings
 * Reset warnings for the test user (admin only)
 */
export async function POST(request) {
  try {
    // Verify admin access
    const user = verifyToken(request);
    
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Read members file
    const membersData = fs.readFileSync(MEMBERS_FILE, 'utf8');
    const members = JSON.parse(membersData);

    // Find test user
    const testUserIndex = members.findIndex(m => m.id === 'member-test');

    if (testUserIndex === -1) {
      return NextResponse.json(
        { error: 'Test user not found' },
        { status: 404 }
      );
    }

    // Verify it's actually a test user
    if (!members[testUserIndex].isTestUser) {
      return NextResponse.json(
        { error: 'This operation is only allowed for test users' },
        { status: 403 }
      );
    }

    // Reset warnings
    const previousWarningCount = members[testUserIndex].warningCount;
    const previousWarnings = [...members[testUserIndex].warnings];
    
    members[testUserIndex].warningCount = 0;
    members[testUserIndex].warnings = [];
    members[testUserIndex].status = 'active';

    // Save updated members
    fs.writeFileSync(MEMBERS_FILE, JSON.stringify(members, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'Test user warnings reset successfully',
      testUser: {
        id: members[testUserIndex].id,
        name: members[testUserIndex].name,
        email: members[testUserIndex].email,
        previousWarningCount,
        currentWarningCount: 0,
        warningsCleared: previousWarnings.length,
        status: 'active'
      }
    });

  } catch (error) {
    console.error('Error resetting test user warnings:', error);
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
