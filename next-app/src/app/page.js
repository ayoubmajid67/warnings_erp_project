'use client';

import { useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider';

/**
 * Main page - Redirects based on authentication status
 */
export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        // Redirect based on role
        router.push(isAdmin ? '/admin' : '/dashboard');
      } else {
        // Not authenticated, go to login
        router.push('/auth/login');
      }
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  // Show loading state while determining redirect
  return (
    <div className="redirect-page">
      <div className="redirect-content">
        <div className="redirect-spinner" />
        <p>Loading...</p>
      </div>
      <style jsx>{`
        .redirect-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
        }
        .redirect-content {
          text-align: center;
          color: var(--text-muted);
        }
        .redirect-spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto 16px;
          border: 3px solid var(--border-primary, #374151);
          border-top-color: var(--accent-blue, #3b82f6);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
