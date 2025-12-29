# Test User Account - Documentation

## Overview
A special test user account that only admins can see, with the ability to reset warnings for testing purposes.

---

## 🧪 Test User Details

### Account Information
- **Name:** TEST USER - Ayoub Majid
- **Email:** ayoubmajid071@gmail.com
- **Password:** `123456`
- **Member ID:** `member-test`
- **User ID:** `user-test`
- **Role:** Test Account - All Functions
- **Domain:** Testing & Quality Assurance

### Special Properties
- **`isTestUser: true`** - Marks this as a test account
- **Only visible to admins** - Regular users cannot see this account
- **Warnings can be reset** - Unlike regular users, warnings can be cleared

---

## 🔐 Access Control

### Visibility Rules

| User Role | Can See Test User | Can Reset Warnings |
|-----------|------------------|-------------------|
| Admin     | ✅ Yes           | ✅ Yes            |
| Member    | ❌ No            | ❌ No             |
| Guest     | ❌ No            | ❌ No             |

### Implementation
```javascript
// In members API
if (user.role !== 'admin') {
  visibleMembers = visibleMembers.filter(m => !m.isTestUser);
}
```

---

## 🔄 Reset Warnings Feature

### API Endpoint

**POST** `/api/test-user/reset-warnings`

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Test user warnings reset successfully",
  "testUser": {
    "id": "member-test",
    "name": "TEST USER - Ayoub Majid",
    "email": "ayoubmajid071@gmail.com",
    "previousWarningCount": 3,
    "currentWarningCount": 0,
    "warningsCleared": 3,
    "status": "active"
  }
}
```

**Error Responses:**

**401 Unauthorized:**
```json
{
  "error": "Authentication required"
}
```

**403 Forbidden (Non-Admin):**
```json
{
  "error": "Admin access required"
}
```

**403 Forbidden (Not Test User):**
```json
{
  "error": "This operation is only allowed for test users"
}
```

**404 Not Found:**
```json
{
  "error": "Test user not found"
}
```

---

## 🎯 Use Cases

### 1. Testing Warning System
```javascript
// Issue warnings to test user
await issueWarning('member-test', 'Test warning 1');
await issueWarning('member-test', 'Test warning 2');
await issueWarning('member-test', 'Test warning 3');

// Verify dropout behavior
// member-test should now have status: 'dropped'

// Reset for next test
await resetTestUserWarnings();
```

### 2. Testing Email Notifications
```javascript
// Test warning emails
await issueWarning('member-test', 'Testing email notification');

// Test dropout email
await issueWarning('member-test', 'Warning 1');
await issueWarning('member-test', 'Warning 2');
await issueWarning('member-test', 'Warning 3'); // Triggers dropout email

// Reset
await resetTestUserWarnings();
```

### 3. Testing Credentials System
```javascript
// Test sending credentials
await sendCredentials('member-test');

// Verify receivedCred status
// Check email delivery

// Reset if needed
await resetTestUserWarnings();
```

### 4. Testing Warning Details Page
```javascript
// Issue a warning
const response = await issueWarning('member-test', 'Test reason');
const warningId = response.warning.id;

// Navigate to warning details
router.push(`/warnings/${warningId}`);

// Test share functionality
// Test copy link
// Test permissions

// Reset
await resetTestUserWarnings();
```

---

## 💻 How to Use

### Login as Test User

**Email:** `ayoubmajid071@gmail.com`  
**Password:** `123456`

### As Admin - View Test User

1. Login as admin
2. Go to **Admin > Members**
3. Test user appears at the **top of the list**
4. Has special badge: "TEST USER"

### As Admin - Issue Warnings

1. Find test user in members list
2. Click **"Issue Warning"**
3. Enter reason
4. Submit
5. Warning is added to test user

### As Admin - Reset Warnings

**Method 1: API Call**
```javascript
const resetWarnings = async () => {
  const response = await fetch('/api/test-user/reset-warnings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  const data = await response.json();
  console.log(data.message);
};
```

**Method 2: UI Button (if implemented)**
```jsx
<button onClick={handleResetWarnings}>
  Reset Test User Warnings
</button>
```

---

## 🎨 Visual Indicators

### Test User Badge
```
┌─────────────────────────────────────┐
│  🧪 TEST USER - Ayoub Majid         │
│  Test Account - All Functions       │
│  ⚠️ Only visible to admins          │
└─────────────────────────────────────┘
```

### Member Card (Admin View)
```
┌─────────────────────────────────────┐
│  [👤]  TEST USER - Ayoub Majid      │
│        Test Account                  │
│        ayoubmajid071@gmail.com      │
│                                     │
│  🧪 TEST ACCOUNT                    │
│  This user is for testing only      │
│                                     │
│  Warnings: 2/3                      │
│  [Reset Warnings] [Issue Warning]   │
└─────────────────────────────────────┘
```

---

## 🔒 Security Features

### 1. **Admin-Only Visibility**
```javascript
// Test user is filtered out for non-admins
const visibleMembers = members.filter(m => {
  if (!isAdmin && m.isTestUser) return false;
  return true;
});
```

### 2. **Reset Protection**
```javascript
// Only works on users with isTestUser: true
if (!member.isTestUser) {
  throw new Error('Operation only allowed for test users');
}
```

### 3. **Admin-Only Reset**
```javascript
// Verify admin role
if (user.role !== 'admin') {
  return 403 Forbidden;
}
```

---

## 📊 Test Scenarios

### Scenario 1: Warning Progression
```
1. Start: 0 warnings, status: active
2. Issue Warning 1 → 1 warning, status: active
3. Issue Warning 2 → 2 warnings, status: active
4. Issue Warning 3 → 3 warnings, status: dropped
5. Reset → 0 warnings, status: active
```

### Scenario 2: Email Notifications
```
1. Issue Warning → Check warning email received
2. Issue 3rd Warning → Check dropout email received
3. Reset → Ready for next test
```

### Scenario 3: Credentials
```
1. Send Credentials → Check email received
2. Verify receivedCred: true
3. Verify credSentAt timestamp
4. Test resend functionality
```

### Scenario 4: Warning Details
```
1. Issue Warning → Get warning ID
2. Navigate to /warnings/[warningId]
3. Test share button
4. Test copy link
5. Test permissions (admin vs member)
6. Reset → Clean state
```

---

## 🚀 Integration Example

### Add Reset Button to Member Profile

```jsx
// In member profile page
{member.isTestUser && isAdmin && (
  <div className="test-user-controls">
    <div className="test-badge">
      🧪 TEST ACCOUNT
    </div>
    <button 
      onClick={handleResetWarnings}
      className="btn btn-warning"
      disabled={member.warningCount === 0}
    >
      🔄 Reset Warnings ({member.warningCount})
    </button>
  </div>
)}
```

### Reset Handler
```javascript
const handleResetWarnings = async () => {
  if (!confirm('Reset all warnings for test user?')) return;
  
  try {
    const response = await fetch('/api/test-user/reset-warnings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    const data = await response.json();
    
    if (data.success) {
      alert(`✅ ${data.message}\nCleared ${data.testUser.warningsCleared} warnings`);
      // Refresh member data
      await fetchMemberData();
    }
  } catch (error) {
    alert(`❌ Error: ${error.message}`);
  }
};
```

---

## 📝 Database Structure

### members.json
```json
{
  "id": "member-test",
  "name": "TEST USER - Ayoub Majid",
  "email": "ayoubmajid071@gmail.com",
  "phone": "212 600-000000",
  "role": "Test Account - All Functions",
  "domain": "Testing & Quality Assurance",
  "status": "active",
  "warningCount": 0,
  "warnings": [],
  "isTestUser": true,
  "receivedCred": false,
  "profileImage": "/profiles/default-avatar.png",
  "cvPath": null,
  "github": "https://github.com/ayoubmajid67",
  "linkedin": "https://www.linkedin.com/in/youbista/",
  "joinedAt": "2025-12-29",
  "description": "Test user account for testing all system functions..."
}
```

### users.json
```json
{
  "id": "user-test",
  "username": "Test User - Ayoub Majid",
  "email": "ayoubmajid071@gmail.com",
  "password": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
  "role": "user",
  "memberId": "member-test",
  "createdAt": "2025-12-29T00:00:00.000Z"
}
```

---

## ✅ Testing Checklist

### Account Access
- [ ] Admin can see test user
- [ ] Regular members cannot see test user
- [ ] Can login with test credentials
- [ ] Test user appears first in admin list

### Warning System
- [ ] Can issue warnings to test user
- [ ] Warning count increments correctly
- [ ] Status changes to 'dropped' at 3 warnings
- [ ] Warning emails are sent
- [ ] Dropout email sent at 3rd warning

### Reset Functionality
- [ ] Admin can reset warnings
- [ ] Non-admin cannot reset warnings
- [ ] Reset only works on test user
- [ ] Warning count returns to 0
- [ ] Status returns to 'active'
- [ ] Warnings array is cleared

### Credentials
- [ ] Can send credentials to test user
- [ ] receivedCred status updates
- [ ] credSentAt timestamp recorded
- [ ] Email received with credentials

### Warning Details
- [ ] Can view warning details
- [ ] Share button works
- [ ] Copy link works
- [ ] Permissions enforced

---

## 🎉 Benefits

### For Development:
✅ Safe testing environment  
✅ No impact on real users  
✅ Quick reset capability  
✅ Repeatable test scenarios

### For QA:
✅ Dedicated test account  
✅ All features testable  
✅ Email notifications verifiable  
✅ Edge cases reproducible

### For Admins:
✅ Demo account for training  
✅ Feature demonstration  
✅ System validation  
✅ No cleanup needed

---

## 📌 Important Notes

1. **Production Safety**: Test user is only visible to admins
2. **Reset Limitation**: Only test users can have warnings reset
3. **Email Testing**: Use real email for notification testing
4. **Data Persistence**: Test user data persists across restarts
5. **Security**: Same authentication as regular users

---

## 🔄 Quick Reference

**Login:**
- Email: `ayoubmajid071@gmail.com`
- Password: `123456`

**Reset API:**
```bash
POST /api/test-user/reset-warnings
Authorization: Bearer <admin_token>
```

**Check if Test User:**
```javascript
if (member.isTestUser) {
  // Special handling
}
```

**Filter for Admins:**
```javascript
const testUsers = members.filter(m => m.isTestUser);
const regularUsers = members.filter(m => !m.isTestUser);
```

---

Perfect for comprehensive system testing! 🧪✨
