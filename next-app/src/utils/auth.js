import jwt from 'jsonwebtoken';

/**
 * Session duration constants (in hours)
 */
export const SESSION_DURATIONS = {
  admin: 1,   // 1 hour for admin
  user: 24    // 24 hours for regular users
};

/**
 * Get JWT expiration time based on role
 */
export const getJwtExpirationTime = (role) => {
  return SESSION_DURATIONS[role] || SESSION_DURATIONS.user;
};

/**
 * Verify JWT token from request
 */
export const verifyToken = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Token missing or invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error('Token invalid or expired');
  }
};

/**
 * Get auth headers for client-side API calls
 */
export const getAuthHeaders = () => {
  if (typeof window === 'undefined') return {};
  
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

/**
 * Check if user has admin role
 */
export const isAdminRole = (user) => {
  return user?.role === 'admin';
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};

/**
 * Decode token without verification (client-side)
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};
