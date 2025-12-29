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
 * POST /api/credentials/send-all
 * Send credentials to all active members
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
    // Read members and passwords
    const members = await readJSONFile(MEMBERS_FILE);
    const passwords = await readJSONFile(PASSWORDS_FILE);

    const results = {
      success: [],
      failed: [],
      total: 0
    };

    // Send credentials to all active members
    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      
      // Skip inactive members
      if (member.status !== 'active') {
        continue;
      }

      results.total++;

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
        results.failed.push({
          id: member.id,
          name: member.name,
          email: member.email,
          reason: 'Password not found'
        });
        continue;
      }

      // Send email
      const emailResult = await sendCredentialsEmail(
        member.email,
        member.name,
        passwordEntry.password
      );

      if (emailResult.success) {
        // Update member's receivedCred status
        members[i].receivedCred = true;
        members[i].credSentAt = new Date().toISOString();
        
        results.success.push({
          id: member.id,
          name: member.name,
          email: member.email
        });
      } else {
        results.failed.push({
          id: member.id,
          name: member.name,
          email: member.email,
          reason: emailResult.message
        });
      }

      // Small delay to avoid overwhelming the email server
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Save updated members
    await writeJSONFile(MEMBERS_FILE, members);

    return NextResponse.json({
      success: true,
      message: `Sent credentials to ${results.success.length} out of ${results.total} members`,
      results: {
        total: results.total,
        sent: results.success.length,
        failed: results.failed.length,
        successList: results.success,
        failedList: results.failed
      }
    });

  } catch (error) {
    console.error('Error sending credentials to all:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
