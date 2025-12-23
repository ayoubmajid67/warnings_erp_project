import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

/**
 * Middleware to check if request is authenticated
 * Use in API routes: import { withAuth } from '@/utils/middleware';
 */
export const withAuth = (handler) => {
    return async (request, context) => {
        try {
            const user = verifyToken(request);
            // Attach user to request for use in handler
            request.user = user;
            return handler(request, context);
        } catch (error) {
            return new NextResponse(
                JSON.stringify({ message: 'Authentication required', error: error.message }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
    };
};

/**
 * Middleware to check if request is from admin
 */
export const withAdminAuth = (handler) => {
    return async (request, context) => {
        try {
            const user = verifyToken(request);
            
            if (user.role !== 'admin') {
                return new NextResponse(
                    JSON.stringify({ message: 'Admin access required' }),
                    { status: 403, headers: { 'Content-Type': 'application/json' } }
                );
            }
            
            request.user = user;
            return handler(request, context);
        } catch (error) {
            return new NextResponse(
                JSON.stringify({ message: 'Authentication required', error: error.message }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
    };
};

/**
 * Middleware to check ownership or admin access
 * Useful for member-specific routes where member can access their own data
 */
export const withOwnerOrAdminAuth = (getMemberId) => {
    return (handler) => {
        return async (request, context) => {
            try {
                const user = verifyToken(request);
                const targetMemberId = getMemberId(request, context);
                
                // Admin can access anything
                if (user.role === 'admin') {
                    request.user = user;
                    return handler(request, context);
                }
                
                // User can only access their own data
                if (user.memberId === targetMemberId) {
                    request.user = user;
                    return handler(request, context);
                }
                
                return new NextResponse(
                    JSON.stringify({ message: 'Access denied' }),
                    { status: 403, headers: { 'Content-Type': 'application/json' } }
                );
            } catch (error) {
                return new NextResponse(
                    JSON.stringify({ message: 'Authentication required', error: error.message }),
                    { status: 401, headers: { 'Content-Type': 'application/json' } }
                );
            }
        };
    };
};
