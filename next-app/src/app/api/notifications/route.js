import { NextResponse } from 'next/server';
import { 
  getNotificationsByMemberId, 
  getUnreadCount,
  getAdminActionLogs,
  markAsRead, 
  markAllAsRead
} from '@/app/db/notifications';
import { verifyToken } from '@/utils/auth';

/**
 * GET /api/notifications - Get notifications for current user
 */
export async function GET(request) {
  try {
    const user = verifyToken(request);

    if (user.role === 'admin') {
      // Admin sees action logs (history only - NO read tracking)
      const notifications = getAdminActionLogs();
      return NextResponse.json({ 
        notifications,
        unreadCount: 0  // Admin logs don't have read status
      });
    }

    // Regular user (member) sees their notifications WITH read tracking
    if (!user.memberId) {
      return NextResponse.json({ 
        notifications: [],
        unreadCount: 0 
      });
    }

    const notifications = getNotificationsByMemberId(user.memberId);
    const unreadCount = getUnreadCount(user.memberId);

    return NextResponse.json({ 
      notifications,
      unreadCount 
    });

  } catch (error) {
    if (error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/notifications - Mark notification(s) as read
 * ONLY for members - admin action logs don't have read status
 */
export async function PATCH(request) {
  try {
    const user = verifyToken(request);
    
    // Admin doesn't have read tracking - reject the request
    if (user.role === 'admin') {
      return NextResponse.json(
        { message: 'Admin action logs do not have read tracking' },
        { status: 400 }
      );
    }
    
    // Only members can mark notifications as read
    if (!user.memberId) {
      return NextResponse.json(
        { message: 'Member ID required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { notificationId, markAll } = body;

    // Mark all notifications as read for this member
    if (markAll) {
      markAllAsRead(user.memberId);
      return NextResponse.json({ message: 'All notifications marked as read' });
    }

    // Mark a single notification as read
    if (notificationId) {
      const notification = markAsRead(notificationId, user.memberId);
      
      if (!notification) {
        return NextResponse.json(
          { message: 'Notification not found or does not belong to you' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        message: 'Notification marked as read',
        notification 
      });
    }

    return NextResponse.json(
      { message: 'Invalid request - provide notificationId or markAll' },
      { status: 400 }
    );

  } catch (error) {
    if (error.message.includes('Token')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
