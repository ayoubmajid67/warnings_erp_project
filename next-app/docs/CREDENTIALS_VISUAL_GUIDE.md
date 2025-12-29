# Credentials Feature - Visual Guide

## 📍 Where to Find It

The credentials feature is visible in **both Grid View and List View** on the Members page, but **only in local development mode**.

---

## 🎨 Grid View (Card Layout)

Each member card now includes a **Credentials Status** section:

```
┌─────────────────────────────────────┐
│  [Profile Image]      [Status Badge]│
│                                     │
│         Member Name                 │
│         Role Title                  │
│         email@example.com           │
│                                     │
│  ┌─ Warning Status ────────────┐   │
│  │  ⚠️⚠️⚠️  2/3 Warnings      │   │
│  └──────────────────────────────┘   │
│                                     │
│  ┌─ Credentials Status ────────┐   │
│  │  ✅ Sent                     │   │
│  │  12/29/2025                  │   │
│  │  ┌──────────────────────┐   │   │
│  │  │  📧 Send             │   │   │
│  │  └──────────────────────┘   │   │
│  └──────────────────────────────┘   │
│                                     │
│  [View Profile] [Issue Warning]     │
└─────────────────────────────────────┘
```

**Status Indicators:**
- ✅ **Sent** (Green) - Credentials have been sent
  - Shows the date when sent
- ❌ **Not Sent** (Red) - Credentials haven't been sent yet

**Send Button:**
- Click to send credentials to this specific member
- Shows spinner while sending
- Changes to "Sending..." during the process

---

## 📊 List View (Table Layout)

The table includes a **Credentials** column:

```
┌──────────────┬──────────┬──────────┬────────┬─────────────────┬─────────┐
│ Member       │ Role     │ Warnings │ Status │ Credentials     │ Actions │
├──────────────┼──────────┼──────────┼────────┼─────────────────┼─────────┤
│ [👤] John    │ Backend  │ ⚠️⚠️    │ Active │ ✅ Sent         │ 👁️ ⚠️  │
│ john@ex.com  │ Dev      │          │        │ 12/29/2025  📧  │         │
├──────────────┼──────────┼──────────┼────────┼─────────────────┼─────────┤
│ [👤] Jane    │ Frontend │ ⚠️       │ Active │ ❌ Not Sent 📧  │ 👁️ ⚠️  │
│ jane@ex.com  │ Dev      │          │        │                 │         │
└──────────────┴──────────┴──────────┴────────┴─────────────────┴─────────┘
```

---

## 🎯 Page Header Actions

At the top of the Members page (only in local dev):

```
┌─────────────────────────────────────────────────────────────┐
│  Team Members                                               │
│  Manage and monitor all team members                        │
│                                                             │
│                    ┌──────────────────────┐  ┌───────────┐ │
│                    │ 📤 Send All          │  │ ➕ Add    │ │
│                    │    Credentials       │  │   Member  │ │
│                    └──────────────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Send All Credentials Button:**
- Sends credentials to ALL active members at once
- Shows loading state: "Sending..."
- Displays summary after completion

---

## 💡 Usage Examples

### Send to Single Member (Grid View):
1. Navigate to **Admin > Members**
2. Ensure you're in **Grid View** (default)
3. Find the member card
4. Scroll to **Credentials Status** section
5. Click the **📧 Send** button
6. Confirm the action
7. Status updates to ✅ Sent with timestamp

### Send to Single Member (List View):
1. Navigate to **Admin > Members**
2. Switch to **List View** (table icon)
3. Find the member row
4. Look at the **Credentials** column
5. Click the **📧** icon
6. Confirm the action
7. Status updates to ✅ Sent

### Send to All Members:
1. Navigate to **Admin > Members**
2. Click **📤 Send All Credentials** button
3. Confirm (shows count: "Send to 12 active members?")
4. Wait for completion (1 second delay between each)
5. Review summary: "Sent: 12/12"

---

## 🎨 Visual States

### Not Sent State:
```
┌─────────────────────────────┐
│ ❌ Not Sent                 │
│ ┌─────────────────────────┐ │
│ │  📧 Send                │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```
- Red background gradient
- Red border
- "Not Sent" text

### Sent State:
```
┌─────────────────────────────┐
│ ✅ Sent                     │
│ 12/29/2025                  │
│ ┌─────────────────────────┐ │
│ │  📧 Send                │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```
- Green background gradient
- Green border
- "Sent" text with date
- Can resend if needed

### Sending State:
```
┌─────────────────────────────┐
│ ❌ Not Sent                 │
│ ┌─────────────────────────┐ │
│ │  ⏳ Sending...          │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```
- Button disabled
- Spinner animation
- "Sending..." text

---

## 🔐 Security Notice

**⚠️ DEVELOPMENT ONLY**
- This feature is **ONLY visible** in local development
- Automatically hidden in production
- API endpoints return 403 in production
- Never use this in production environment

---

## 📧 Email Preview

When credentials are sent, members receive:

**Subject:** 🔐 Your ERP System Credentials

**Content:**
```
┌─────────────────────────────────────┐
│          🔐                         │
│   Your System Credentials           │
│   ERP Team Management System        │
├─────────────────────────────────────┤
│                                     │
│  Hello John Doe,                    │
│                                     │
│  Here are your login credentials    │
│  for the ERP Team Management        │
│  System.                            │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📧 Login Email              │   │
│  │ john@example.com            │   │
│  │                             │   │
│  │ 🔐 Password                 │   │
│  │ SecurePass123!              │   │
│  └─────────────────────────────┘   │
│                                     │
│  🔒 Security Notice:                │
│  This is a development environment. │
│  Please change your password after  │
│  your first login.                  │
│                                     │
│  Best regards,                      │
│  ERP Team Administration            │
└─────────────────────────────────────┘
```

---

## ✨ Features Summary

✅ **Grid View Display** - Shows in member cards
✅ **List View Display** - Shows in table column
✅ **Individual Send** - Send to one member
✅ **Bulk Send** - Send to all active members
✅ **Status Tracking** - Tracks sent/not sent
✅ **Timestamp** - Records when sent
✅ **Loading States** - Visual feedback during send
✅ **Professional Emails** - Branded email template
✅ **Dev Only** - Secure, development-only feature
