import crypto from 'crypto';

/**
 * Hash a password using SHA-256
 * @param {string} password - Plain text password
 * @returns {string} - SHA-256 hashed password (hex encoded)
 */
export const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password to verify
 * @param {string} hash - SHA-256 hash to compare against
 * @returns {boolean} - True if password matches hash
 */
export const verifyPassword = (password, hash) => {
  const passwordHash = hashPassword(password);
  return passwordHash === hash;
};
