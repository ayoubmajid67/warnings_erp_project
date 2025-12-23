'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  LogOut, 
  AlertTriangle,
  Shield,
  User,
  Activity,
  Settings
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useContext(AuthContext);

  const adminLinks = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/members', icon: Users, label: 'Team Members' },
    { href: '/admin/notifications', icon: Activity, label: 'Activity Log' },
    { href: '/admin/profile', icon: Settings, label: 'Settings' }
  ];

  const userLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'My Dashboard' },
    { href: '/dashboard/warnings', icon: AlertTriangle, label: 'My Warnings' },
    { href: '/dashboard/members', icon: Users, label: 'Team Members' },
    { href: '/dashboard/profile', icon: Settings, label: 'Profile' }
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Shield className="sidebar-logo-icon" />
          <span className="sidebar-logo-text">ERP Team</span>
        </div>
        <span className="sidebar-subtitle">Warning System</span>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || 
              (link.href !== '/admin' && link.href !== '/dashboard' && pathname.startsWith(link.href));
            
            return (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon className="sidebar-nav-icon" />
                  <span className="sidebar-nav-label">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            <User />
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.username || 'User'}</span>
            <span className="sidebar-user-role">
              {isAdmin ? 'Administrator' : 'Team Member'}
            </span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={logout}>
          <LogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
