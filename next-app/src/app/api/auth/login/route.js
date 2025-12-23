import { NextResponse } from 'next/server';
import { findUserByEmail, getSessionDuration, USER_ROLES } from '@/app/db/users';
import { findMemberById } from '@/app/db/members';
import { hashPassword } from '@/utils/hash';
import jwt from 'jsonwebtoken';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return new NextResponse(
                JSON.stringify({ message: 'Email and password are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Find user
        const user = findUserByEmail(email);

        // Hash the input password and compare with stored hash
        const hashedInputPassword = hashPassword(password);
        
        if (!user || user.password !== hashedInputPassword) {
            return new NextResponse(
                JSON.stringify({ message: 'Invalid credentials' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check if user is a team member and if they are dropped
        if (user.role === USER_ROLES.USER && user.memberId) {
            const member = findMemberById(user.memberId);
            if (member && member.status === 'dropped') {
                return new NextResponse(
                    JSON.stringify({ 
                        message: 'Access denied. You have been dropped from the team due to reaching the maximum warning limit.',
                        isDropped: true
                    }),
                    { status: 403, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }

        // Get session duration based on role
        const sessionDuration = getSessionDuration(user.role);

        // Create JWT payload with role
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            memberId: user.memberId || null
        };

        // Sign the token with role-based expiration
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: `${sessionDuration}h`
        });

        // Return user data without password
        const { password: _, ...userToReturn } = user;

        return NextResponse.json({ 
            user: userToReturn, 
            token,
            expiresIn: sessionDuration * 60 * 60 * 1000 // milliseconds
        });

    } catch (error) {
        console.error('Login error:', error);
        return new NextResponse(
            JSON.stringify({ message: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}