# Credentials Sending Feature

## Overview
This feature allows administrators to send login credentials to team members via email. It is **only available in development mode** for security reasons.

## Features

### 1. Send Credentials to Single Member
- Click the send icon (✉️) next to any member in the members list
- Sends an email with their login credentials (email and password)
- Updates the member's `receivedCred` status to `true`
- Records the timestamp in `credSentAt`

### 2. Send Credentials to All Members
- Click the "Send All Credentials" button in the page header
- Sends credentials to all active members
- Shows a summary of successful/failed sends
- Includes a 1-second delay between sends to avoid overwhelming the email server

### 3. Credential Status Display
- Shows ✅ "Sent" with date if credentials have been sent
- Shows ❌ "Not Sent" if credentials haven't been sent yet
- Only visible in local development environment

## API Endpoints

### POST `/api/credentials/send`
Send credentials to a single member.

**Request Body:**
```json
{
  "memberId": "member-alae"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Credentials sent to ACHEACHE ALAA EDDINE",
  "member": {
    "id": "member-alae",
    "name": "ACHEACHE ALAA EDDINE",
    "email": "alaedineacheache@gmail.com",
    "receivedCred": true
  }
}
```

### POST `/api/credentials/send-all`
Send credentials to all active members.

**Response:**
```json
{
  "success": true,
  "message": "Sent credentials to 12 out of 12 members",
  "results": {
    "total": 12,
    "sent": 12,
    "failed": 0,
    "successList": [...],
    "failedList": []
  }
}
```

## Email Template
The credentials email includes:
- Professional header with ERP branding
- Member's name
- Login email
- Password (plain text - development only)
- Security notice to change password after first login
- Modern glassmorphic design matching other email templates

## Data Schema Updates

### Members Collection
Added two new fields:
- `receivedCred` (boolean): Whether credentials have been sent
- `credSentAt` (string): ISO timestamp of when credentials were sent

Example:
```json
{
  "id": "member-alae",
  "name": "ACHEACHE ALAA EDDINE",
  "email": "alaedineacheache@gmail.com",
  "receivedCred": true,
  "credSentAt": "2025-12-29T12:30:45.123Z",
  ...
}
```

## Security Considerations

### Development Only
- Both endpoints check `process.env.NODE_ENV !== 'development'`
- Returns 403 Forbidden in production
- UI elements only visible when `isLocal` is true

### Password Storage
- Passwords are read from `passwords_users_secret.json` (gitignored)
- Sent via email only in development for testing purposes
- **Never use this feature in production**

## Usage Instructions

### Prerequisites
1. Ensure SMTP credentials are configured in `.env`:
   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

2. Run the application in development mode:
   ```bash
   npm run dev
   ```

### Sending Credentials

#### To a Single Member:
1. Navigate to Admin > Members
2. Switch to List View for better visibility
3. Find the member in the table
4. Click the send icon (✉️) in the Credentials column
5. Confirm the action
6. Wait for success message

#### To All Members:
1. Navigate to Admin > Members
2. Click "Send All Credentials" button in the header
3. Confirm the action (shows count of active members)
4. Wait for completion (may take 1-2 minutes for many members)
5. Review the summary showing sent/failed counts

## Troubleshooting

### Email Not Sending
- Check SMTP credentials in `.env`
- Verify Gmail App Password is correct
- Check console for error messages
- Ensure email service is enabled in `email.js`

### Member Not Receiving Email
- Verify member's email address is correct
- Check spam folder
- Verify password exists in `passwords_users_secret.json`
- Check API response for errors

### Status Not Updating
- Refresh the members page
- Check browser console for errors
- Verify API response shows `receivedCred: true`

## Files Modified

### New Files:
- `/src/app/api/credentials/send/route.js` - Single member endpoint
- `/src/app/api/credentials/send-all/route.js` - Bulk send endpoint
- `/add-receivedCred-field.js` - Migration script

### Modified Files:
- `/src/utils/email.js` - Added `sendCredentialsEmail()` function
- `/src/app/admin/members/page.js` - Added UI and handlers
- `/src/components/memberCard/MemberCard.js` - Added credentials column
- `/src/app/admin/members/members.css` - Added styling
- `/src/app/db/members.json` - Added `receivedCred` and `credSentAt` fields

## Future Enhancements
- [ ] Add credential expiry/rotation
- [ ] Support for custom password generation
- [ ] Batch send with progress indicator
- [ ] Email delivery status tracking
- [ ] Resend functionality with different password
