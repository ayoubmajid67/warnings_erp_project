import { NextResponse } from 'next/server';
import { findMemberById, updateMember, deleteMember } from '@/app/db/members';
import { verifyToken } from '@/utils/auth';

/**
 * GET /api/members/[id] - Get member by ID
 * All authenticated users can view any member's profile
 */
export async function GET(request, { params }) {
  try {
    // All authenticated users can view member profiles
    const user = verifyToken(request);
    const { id } = await params;

    const member = findMemberById(id);

    if (!member) {
      return NextResponse.json(
        { message: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ member });

  } catch (error) {
    if (error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/members/[id] - Update member (admin only)
 */
export async function PATCH(request, { params }) {
  try {
    const user = verifyToken(request);
    const { id } = await params;

    if (user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Prevent updating critical fields directly
    const { warningCount, warnings, status, ...allowedUpdates } = body;

    const updatedMember = updateMember(id, allowedUpdates);

    if (!updatedMember) {
      return NextResponse.json(
        { message: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Member updated successfully',
      member: updatedMember 
    });

  } catch (error) {
    if (error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/members/[id] - Delete member (admin only)
 */
export async function DELETE(request, { params }) {
  try {
    const user = verifyToken(request);
    const { id } = await params;

    if (user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      );
    }

    const deleted = deleteMember(id);

    if (!deleted) {
      return NextResponse.json(
        { message: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Member deleted successfully'
    });

  } catch (error) {
    if (error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
