/**
 * Users Database
 * Stores user accounts with role-based access control
 */

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

// PRODUCTION PASSWORDS - Change these in production!
let users = [
  {
    id: 'admin-1',
    username: 'Admin',
    email: 'admin@erp.com',
    password: 'ERP@dmin2025!', // Production password
    role: USER_ROLES.ADMIN,
    memberId: null, // Admin is not a team member
    createdAt: '2024-10-01T00:00:00.000Z'
  },
  {
    id: 'user-alae',
    username: 'Alae Eddine Acheache',
    email: 'alaedineacheache@gmail.com',
    password: 'Alae@ERP2025!',
    role: USER_ROLES.USER,
    memberId: 'member-alae',
    createdAt: '2024-10-01T00:00:00.000Z'
  },
  {
    id: 'user-amal',
    username: 'Amal Lastak',
    email: 'amallastak891@gmail.com',
    password: 'Amal@ERP2025!',
    role: USER_ROLES.USER,
    memberId: 'member-amal',
    createdAt: '2024-10-01T00:00:00.000Z'
  },
  {
    id: 'user-amine',
    username: 'Amine Charro',
    email: 'amine_charro@yahoo.com',
    password: 'Amine@ERP2025!',
    role: USER_ROLES.USER,
    memberId: 'member-amine',
    createdAt: '2024-10-01T00:00:00.000Z'
  },
  {
    id: 'user-ayman',
    username: 'Ayman El Hilali',
    email: 'aymanelhilali658@gmail.com',
    password: 'Ayman@ERP2025!',
    role: USER_ROLES.USER,
    memberId: 'member-ayman',
    createdAt: '2024-10-01T00:00:00.000Z'
  },
  {
    id: 'user-brahim',
    username: 'Brahim Bouaz',
    email: 'brahim.bouaz@uit.ac.ma',
    password: 'Brahim@ERP2025!',
    role: USER_ROLES.USER,
    memberId: 'member-brahim',
    createdAt: '2024-10-01T00:00:00.000Z'
  },
  {
    id: 'user-sana',
    username: 'El Fahim Sana',
    email: 'elfahimel@gmail.com',
    password: 'Sana@ERP2025!',
    role: USER_ROLES.USER,
    memberId: 'member-sana',
    createdAt: '2024-10-01T00:00:00.000Z'
  },
  {
    id: 'user-ibtissam',
    username: 'Ibtissam Khannij',
    email: 'ibtissamkhannij@gmail.com',
    password: 'Ibtissam@ERP2025!',
    role: USER_ROLES.USER,
    memberId: 'member-ibtissam',
    createdAt: '2024-10-01T00:00:00.000Z'
  },
  {
    id: 'user-khadija',
    username: 'Khadija Anhayfou',
    email: 'khadijaanhayfou2@gmail.com',
    password: 'Khadija@ERP2025!',
    role: USER_ROLES.USER,
    memberId: 'member-khadija',
    createdAt: '2024-10-01T00:00:00.000Z'
  },
  {
    id: 'user-nisrine',
    username: 'Nisrine Amroug',
    email: 'nisrineamroug2005prof@gmail.com',
    password: 'Nisrine@ERP2025!',
    role: USER_ROLES.USER,
    memberId: 'member-nisrine',
    createdAt: '2024-10-01T00:00:00.000Z'
  },
  {
    id: 'user-wafae',
    username: 'Wafae Elkari',
    email: 'wafae2004elkari@gmail.com',
    password: 'Wafae@ERP2025!',
    role: USER_ROLES.USER,
    memberId: 'member-wafae',
    createdAt: '2024-10-01T00:00:00.000Z'
  },
  {
    id: 'user-yasser',
    username: 'Yasser Touil',
    email: 'touilyasser123@gmail.com',
    password: 'Yasser@ERP2025!',
    role: USER_ROLES.USER,
    memberId: 'member-yasser',
    createdAt: '2024-10-01T00:00:00.000Z'
  }
];

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
