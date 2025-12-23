# 🚨 ERP Warning Management System

A modern, full-stack warning management system built for ERP startup teams. This application provides role-based access control, comprehensive warning tracking, email notifications, and activity logging.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Warning System](#-warning-system)
- [Email Notifications](#-email-notifications)
- [Contributing](#-contributing)

---

## ✨ Features

### 👨‍💼 Admin Features
- **Dashboard** - Overview of team statistics and recent activity
- **Member Management** - Add, view, and manage team members
- **Warning System** - Issue warnings with documented reasons
- **Activity Log** - Complete audit trail of all admin actions
- **Profile & Settings** - Theme toggle (dark/light mode)

### 👤 Member Features
- **Personal Dashboard** - View status and recent notifications
- **Warning History** - Track personal warnings with timeline view
- **Team Directory** - Browse and view other team members' profiles
- **Profile Page** - Personal information and theme preferences

### 🔔 Notification System
- Real-time notification bell with unread count
- Member notifications track read/unread status
- Admin activity log for historical records
- Email notifications for warnings and account status

### 🎨 Design
- Modern dark/light theme toggle
- Responsive design for all screen sizes
- Smooth animations and transitions
- Professional gradient styling

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Frontend** | React 19, CSS Modules |
| **Backend** | Next.js API Routes |
| **Database** | JSON file-based storage |
| **Authentication** | JWT with HttpOnly cookies |
| **Email** | Nodemailer with Gmail SMTP |
| **Icons** | Lucide React |

---

## 📁 Project Structure

```
next-app/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin pages
│   │   │   ├── members/        # Member management
│   │   │   ├── notifications/  # Activity log
│   │   │   ├── profile/        # Admin settings
│   │   │   └── page.js         # Admin dashboard
│   │   ├── dashboard/          # Member pages
│   │   │   ├── members/        # Team directory
│   │   │   ├── profile/        # Member profile
│   │   │   ├── warnings/       # Warning history
│   │   │   └── page.js         # Member dashboard
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication
│   │   │   ├── members/        # Member CRUD
│   │   │   ├── warnings/       # Warning management
│   │   │   └── notifications/  # Notification system
│   │   ├── db/                 # JSON database files
│   │   │   ├── users.js        # User credentials
│   │   │   ├── members.json    # Member data
│   │   │   └── notifications.json
│   │   └── globals.css         # Global styles & themes
│   ├── components/             # Reusable components
│   │   ├── sidebar/            # Navigation sidebar
│   │   ├── notificationPanel/  # Notification system
│   │   ├── warningCounter/     # Warning display
│   │   ├── statusBadge/        # Status indicators
│   │   └── issueWarningModal/  # Warning form modal
│   ├── utils/
│   │   ├── auth.js             # JWT utilities
│   │   └── email.js            # Email service
│   └── middleware.js           # Route protection
├── public/
│   └── profiles/               # Member profile images
├── .env.local                  # Environment variables
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Gmail account with App Password (for email notifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/warnings_erp_project.git
   cd warnings_erp_project/next-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Gmail SMTP Configuration
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-char-app-password
```

### Setting up Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled
3. Go to Security → 2-Step Verification → **App passwords**
4. Select "Mail" and "Windows Computer"
5. Click "Generate" to get your 16-character password
6. Use this password as `SMTP_PASS`

---

## 📡 API Documentation

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/me` | GET | Get current user |
| `/api/auth/validate` | GET | Validate session |

### Members

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/members` | GET | All | List all members |
| `/api/members` | POST | Admin | Create new member |
| `/api/members/[id]` | GET | All | Get member details |
| `/api/members/[id]` | PUT | Admin | Update member |
| `/api/members/[id]` | DELETE | Admin | Delete member |

### Warnings

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/warnings` | POST | Admin | Issue a warning |
| `/api/warnings/[id]` | GET | All | Get warning details |

### Notifications

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/notifications` | GET | All | Get notifications |
| `/api/notifications` | PATCH | Member | Mark as read |

---

## 👥 User Roles

### Admin
- **Access**: Full system access
- **Session Duration**: 1 hour
- **Capabilities**:
  - Create, edit, and delete members
  - Issue warnings to members
  - View complete activity log
  - Access all member profiles

### Member
- **Access**: Personal dashboard and team directory
- **Session Duration**: 24 hours
- **Capabilities**:
  - View personal warning history
  - Browse team member profiles
  - Receive notifications
  - Toggle theme preferences

---

## ⚠️ Warning System

### How It Works

1. **First Warning** - Member receives notification and email
2. **Second Warning** - Final notice warning issued
3. **Third Warning** - Member status changes to "dropped"
   - Access is automatically revoked
   - Cannot log in to the system
   - Receives termination email

### Warning Flow

```
Active Member → Warning 1 → Warning 2 (Final Notice) → Warning 3 → Dropped
```

### Status Types

| Status | Description |
|--------|-------------|
| `active` | Normal member with full access |
| `dropped` | Terminated member, no access |

---

## 📧 Email Notifications

The system sends beautifully designed HTML emails for:

- **Warning Notifications** - When a warning is issued
- **Dropout Notifications** - When membership is terminated
- **Welcome Emails** - When a new member is added (optional)

### Email Templates

All emails feature:
- Modern gradient design
- Responsive layout
- Professional branding
- Clear call-to-action

---

## 🎨 Theming

The application supports both dark and light themes:

- Toggle available in profile/settings page
- Preference saved to localStorage
- Smooth transition between themes

### CSS Variables

Themes are controlled via CSS variables in `globals.css`:

```css
:root {
  /* Dark theme (default) */
  --bg-primary: #0f1419;
  --text-primary: #ffffff;
}

[data-theme="light"] {
  /* Light theme */
  --bg-primary: #f8fafc;
  --text-primary: #1a1f2e;
}
```

---

## 🔒 Security

- **JWT Authentication** with HttpOnly cookies
- **Role-based access control**
- **Password protection** (production passwords required)
- **Session expiration** (1 hour admin, 24 hours member)
- **CSRF protection** via SameSite cookies

### Production Recommendations

- [ ] Implement password hashing with bcrypt
- [ ] Use a proper database (PostgreSQL, MongoDB)
- [ ] Add rate limiting to API endpoints
- [ ] Enable HTTPS in production
- [ ] Set up proper logging and monitoring

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Contact

**Project Maintainer**: Ayoub Majjid  
**Email**: ayoub@majjid.com

---

## 📄 License

This project is proprietary software developed for ERP Team internal use.

---

<p align="center">
  <strong>Built with ❤️ by the ERP Team</strong>
</p>
