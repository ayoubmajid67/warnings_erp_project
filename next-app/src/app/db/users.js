/**
 * Users Database
 * Stores user accounts with role-based access control
 * Loads user data from users.json file
 */

import usersData from './users.json';

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Session durations (in hours)
export const SESSION_DURATIONS = {
  admin: 1,   // Admin session expires after 1 hour
  user: 24    // User session expires after 24 hours
};

// Load users from JSON file
let users = [...usersData];

// ============== CRUD Operations ==============

/**
 * Find user by email
 */
export const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

/**
 * Find user by ID
 */
export const findUserById = (id) => {
  return users.find(user => user.id === id);
};

/**
 * Find user by member ID
 */
export const findUserByMemberId = (memberId) => {
  return users.find(user => user.memberId === memberId);
};

/**
 * Add a new user
 */
export const addUser = (userData) => {
  const newUser = {
    id: `user-${crypto.randomUUID()}`,
    role: USER_ROLES.USER,
    createdAt: new Date().toISOString(),
    ...userData
  };
  users.push(newUser);
  return newUser;
};

/**
 * Get all users
 */
export const getUsers = () => {
  return users;
};

/**
 * Get all users (excluding passwords)
 */
export const getUsersSafe = () => {
  return users.map(({ password, ...user }) => user);
};

/**
 * Delete a user by ID
 */
export const deleteUser = (id) => {
  const initialLength = users.length;
  users = users.filter(user => user.id !== id);
  return users.length < initialLength;
};

/**
 * Update a user
 */
export const updateUser = (id, updatedData) => {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex === -1) return null;

  users[userIndex] = {
    ...users[userIndex],
    ...updatedData,
    id: users[userIndex].id // Preserve ID
  };
  return users[userIndex];
};

// ============== Auth Helpers ==============

/**
 * Get session duration for a user role
 */
export const getSessionDuration = (role) => {
  return SESSION_DURATIONS[role] || SESSION_DURATIONS.user;
};

/**
 * Check if user is admin
 */
export const isAdmin = (user) => {
  return user?.role === USER_ROLES.ADMIN;
};

/**
 * Validate user credentials
 */
export const validateCredentials = (email, password) => {
  const user = findUserByEmail(email);
  if (!user) return { valid: false, error: 'User not found' };
  if (user.password !== password) return { valid: false, error: 'Invalid password' };
  return { valid: true, user };
};

/**
 * Create user for a new member (admin action)
 */
export const createUserForMember = (memberId, email, username, password = 'user123') => {
  const existingUser = findUserByEmail(email);
  if (existingUser) return null;
  
  return addUser({
    username,
    email,
    password,
    role: USER_ROLES.USER,
    memberId
  });
};
