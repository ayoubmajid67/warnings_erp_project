import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { sendCredentialsEmail } from '@/utils/email';

const MEMBERS_FILE = path.join(process.cwd(), 'src', 'app', 'db', 'members.json');
const PASSWORDS_FILE = path.join(process.cwd(), 'src', 'app', 'db', 'passwords_users_secret.json');

// Helper to read JSON files
async function readJSONFile(filePath) {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

// Helper to write JSON files
async function writeJSONFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

/**
 * POST /api/credentials/send
 * Send credentials to a single member
 * Body: { memberId: string }
 */
export async function POST(request) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  try {
    const { memberId } = await request.json();

    if (!memberId) {
      return NextResponse.json(
        { error: 'Member ID is required' },
        { status: 400 }
      );
    }

    // Read members and passwords
    const members = await readJSONFile(MEMBERS_FILE);
    const passwords = await readJSONFile(PASSWORDS_FILE);

    // Find the member
    const memberIndex = members.findIndex(m => m.id === memberId);
    if (memberIndex === -1) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    const member = members[memberIndex];

    // Find the password - handle both array and object structures
    let passwordEntry = null;
    
    if (Array.isArray(passwords)) {
      // Array structure: [{ email, password }, ...]
      passwordEntry = passwords.find(p => p.email === member.email);
    } else if (passwords.users) {
      // Object structure: { users: { "Name": { email, password } } }
      const userEntry = Object.values(passwords.users).find(u => u.email === member.email);
      if (userEntry) {
        passwordEntry = { email: userEntry.email, password: userEntry.password };
      }
    }
    
    if (!passwordEntry) {
      return NextResponse.json(
        { error: 'Password not found for this member' },
        { status: 404 }
      );
    }

    // Send email
    const emailResult = await sendCredentialsEmail(
      member.email,
      member.name,
      passwordEntry.password
    );

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send email', details: emailResult.message },
        { status: 500 }
      );
    }

    // Update member's receivedCred status
    members[memberIndex].receivedCred = true;
    members[memberIndex].credSentAt = new Date().toISOString();
    await writeJSONFile(MEMBERS_FILE, members);

    return NextResponse.json({
      success: true,
      message: `Credentials sent to ${member.name}`,
      member: {
        id: member.id,
        name: member.name,
        email: member.email,
        receivedCred: true
      }
    });

  } catch (error) {
    console.error('Error sending credentials:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
