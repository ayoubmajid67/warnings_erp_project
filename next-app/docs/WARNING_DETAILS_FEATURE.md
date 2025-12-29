# Warning Details & Sharing Feature

## Overview
A dedicated warning details page with shareable links that only authenticated users can access. Perfect for transparency and accountability in team management.

---

## 🎯 Features

### 1. **Warning Details Page**
- Comprehensive warning information display
- Member profile integration
- Warning timeline and history
- Status indicators

### 2. **Authentication Required**
- Only logged-in users can view
- Permission-based access:
  - **Admins**: Can view all warnings
  - **Members**: Can only view their own warnings
- Automatic redirect to login if not authenticated

### 3. **Share Functionality**
- **Share Button**: Uses native Web Share API (mobile-friendly)
- **Copy Link**: One-click copy to clipboard
- **Visual Feedback**: "Copied!" confirmation

### 4. **Responsive Design**
- Mobile-optimized layout
- Tablet and desktop views
- Touch-friendly buttons

---

## 📍 URL Structure

```
/warnings/[warningId]
```

**Example:**
```
https://your-domain.com/warnings/warning-1735472345678-abc123
```

---

## 🔐 Access Control

### Who Can View?

| User Role | Can View Own Warnings | Can View Others' Warnings |
|-----------|----------------------|---------------------------|
| Admin     | ✅ Yes               | ✅ Yes                    |
| Member    | ✅ Yes               | ❌ No                     |
| Guest     | ❌ No (redirected)   | ❌ No (redirected)        |

### Permission Logic:
```javascript
const canView = isAdmin || (isMember && isOwnWarning);
```

---

## 🎨 Page Layout

```
┌─────────────────────────────────────────────────────┐
│  [← Back]                    [Share] [Copy Link]    │
├─────────────────────────────────────────────────────┤
│                                                     │
│           ⚠️  Warning 2 of 3                        │
│              Official Warning Notice                │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │  [👤]  John Doe                             │  │
│  │        Backend Developer                     │  │
│  │        john@example.com                      │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Warning Details                                    │
│  ┌──────────┬──────────┬──────────┬──────────┐   │
│  │ 📅 Date  │ 👤 By    │ ⚠️ Count │ 🛡️ Status│   │
│  │ Dec 29   │ Admin    │ 2/3      │ Active   │   │
│  └──────────┴──────────┴──────────┴──────────┘   │
│                                                     │
│  Reason for Warning                                 │
│  ┌─────────────────────────────────────────────┐  │
│  │ Missed 3 consecutive team meetings without  │  │
│  │ prior notice or valid justification.        │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ⚠️ Final Notice: One more warning will result     │
│     in membership termination.                      │
│                                                     │
│  Warning ID: warning-1735472345678-abc123          │
└─────────────────────────────────────────────────────┘
```

---

## 💻 API Endpoint

### GET `/api/warnings/[warningId]`

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "warning": {
    "id": "warning-1735472345678-abc123",
    "reason": "Missed 3 consecutive team meetings",
    "issuedBy": "Admin",
    "issuedAt": "2025-12-29T12:30:00.000Z"
  },
  "member": {
    "id": "member-john",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Backend Developer",
    "profileImage": "/profiles/John_Doe/profile.png",
    "warningCount": 2,
    "status": "active"
  },
  "canView": true,
  "viewerRole": "admin"
}
```

**Error Responses:**

**401 Unauthorized:**
```json
{
  "error": "Authentication required",
  "message": "Token expired or invalid"
}
```

**403 Forbidden:**
```json
{
  "error": "You do not have permission to view this warning"
}
```

**404 Not Found:**
```json
{
  "error": "Warning not found"
}
```

---

## 🔗 How to Get Warning Links

### Method 1: From Member Profile
```javascript
// Each warning in the member's warning list has an ID
const warningId = member.warnings[0].id;
const warningUrl = `/warnings/${warningId}`;
```

### Method 2: From Notifications
```javascript
// Notifications include warning IDs
const warningId = notification.warningId;
const shareableLink = `${window.location.origin}/warnings/${warningId}`;
```

### Method 3: From Admin Dashboard
```javascript
// When issuing a warning, the API returns the warning object
const response = await issueWarning(memberId, reason);
const warningId = response.warning.id;
```

---

## 📱 Share Functionality

### Native Share (Mobile)
```javascript
if (navigator.share) {
  await navigator.share({
    title: 'Warning Details',
    text: `Warning issued to ${member.name}`,
    url: shareUrl
  });
}
```

### Copy to Clipboard (Desktop)
```javascript
navigator.clipboard.writeText(shareUrl);
// Shows "Copied!" confirmation for 2 seconds
```

---

## 🎨 Visual Elements

### Warning Badges
- **Warning 1**: Yellow/Amber gradient
- **Warning 2**: Orange gradient
- **Warning 3**: Red gradient

### Status Indicators
- **Active**: Green color
- **Dropped**: Red color

### Alert Boxes
- **Warning Alert**: Yellow background (for 2nd warning)
- **Danger Alert**: Red background (for dropped members)

---

## 🚀 Usage Examples

### Example 1: Share Warning from Admin Dashboard

```javascript
// After issuing a warning
const handleIssueWarning = async (memberId, reason) => {
  const response = await fetch('/api/warnings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ memberId, reason })
  });

  const data = await response.json();
  const warningId = data.warning.id;
  
  // Share the warning
  const shareUrl = `${window.location.origin}/warnings/${warningId}`;
  await navigator.share({ url: shareUrl });
};
```

### Example 2: View Warning from Notification

```javascript
// When user clicks on a notification
const handleNotificationClick = (notification) => {
  if (notification.type === 'warning') {
    router.push(`/warnings/${notification.warningId}`);
  }
};
```

### Example 3: Copy Link for Email

```javascript
// Admin wants to send warning link via email
const warningLink = `${window.location.origin}/warnings/${warningId}`;
const emailBody = `
  You have received a warning. 
  View details: ${warningLink}
`;
```

---

## 🔒 Security Features

### 1. **JWT Authentication**
- All requests require valid JWT token
- Token verified on server-side
- Automatic expiration handling

### 2. **Permission Checks**
```javascript
// Server-side permission validation
const isAdmin = user.role === 'admin';
const isOwnWarning = user.memberId === foundMember.id;

if (!isAdmin && !isOwnWarning) {
  return 403 Forbidden;
}
```

### 3. **No Public Access**
- Warning details are NEVER publicly accessible
- Must be logged in to view
- Links are shareable but require authentication

---

## 📊 Information Displayed

### Member Information
- Profile picture
- Full name
- Role/position
- Email address

### Warning Details
- Issue date and time
- Issued by (admin name)
- Warning number (1, 2, or 3)
- Current warning count
- Account status

### Warning Content
- Detailed reason for warning
- Contextual alerts based on warning count
- Warning ID for reference

---

## 🎯 Benefits

### For Admins:
✅ Easy to share warning details with HR or management  
✅ Permanent record with unique ID  
✅ Professional presentation  
✅ Audit trail

### For Members:
✅ Clear understanding of warnings  
✅ Access to their warning history  
✅ Transparent process  
✅ Can save/bookmark for reference

### For Organization:
✅ Accountability and transparency  
✅ Documented warning process  
✅ Secure and controlled access  
✅ Professional communication

---

## 🔄 Integration Points

### 1. Member Profile Page
Add "View Details" button to each warning:
```jsx
<button onClick={() => router.push(`/warnings/${warning.id}`)}>
  View Details
</button>
```

### 2. Notifications
Link notifications to warning details:
```jsx
<Link href={`/warnings/${notification.warningId}`}>
  View Warning
</Link>
```

### 3. Email Notifications
Include warning link in emails:
```html
<a href="https://your-domain.com/warnings/{{warningId}}">
  View Warning Details
</a>
```

---

## 📝 Files Created

### API:
- `/src/app/api/warnings/[warningId]/route.js` - Warning details endpoint

### Pages:
- `/src/app/warnings/[warningId]/page.js` - Warning details page
- `/src/app/warnings/[warningId]/warning-details.css` - Styling

---

## ✅ Testing Checklist

- [ ] Admin can view any warning
- [ ] Member can view own warnings
- [ ] Member cannot view others' warnings
- [ ] Unauthenticated users redirected to login
- [ ] Share button works on mobile
- [ ] Copy link button works
- [ ] "Copied!" confirmation appears
- [ ] Responsive design on all devices
- [ ] Warning badges show correct colors
- [ ] Status indicators display correctly
- [ ] Alert boxes appear for warnings 2 and 3

---

## 🎉 Summary

The Warning Details & Sharing feature provides:
- **Secure** access with authentication
- **Shareable** links for easy communication
- **Professional** presentation of warning information
- **Transparent** process for team accountability
- **Mobile-friendly** design with native share support

Perfect for maintaining professional standards and clear communication in your team management system! 🚀
