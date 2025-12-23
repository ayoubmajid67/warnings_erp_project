'use client';

import { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { decodeToken } from '@/utils/auth';

export const AuthContext = createContext(null);

const AUTH_TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

export default function AuthProvider({ children }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        try {
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            const storedUser = localStorage.getItem(USER_KEY);
            
            if (token && storedUser) {
                const decoded = decodeToken(token);
                
                // Check if token is expired
                if (decoded && decoded.exp && Date.now() < decoded.exp * 1000) {
                    setUser(JSON.parse(storedUser));
                } else {
                    // Token expired, clear storage
                    localStorage.removeItem(AUTH_TOKEN_KEY);
                    localStorage.removeItem(USER_KEY);
                }
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }
        setLoading(false);
    }, []);

    // Login function
    const login = useCallback(async (credentials) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store token and user in localStorage
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        
        setUser(data.user);
        
        return data;
    }, []);

    // Logout function
    const logout = useCallback(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
        router.push('/auth/login');
    }, [router]);

    // Check if session is still valid
    const checkSession = useCallback(() => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (!token) return false;

        const decoded = decodeToken(token);
        if (!decoded || !decoded.exp) return false;

        const isValid = Date.now() < decoded.exp * 1000;
        
        if (!isValid) {
            logout();
        }
        
        return isValid;
    }, [logout]);

    // Get stored token
    const getToken = useCallback(() => {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    }, []);

    // Computed properties
    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';
    const isUser = user?.role === 'user';

    const value = {
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isUser,
        login,
        logout,
        checkSession,
        getToken
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
