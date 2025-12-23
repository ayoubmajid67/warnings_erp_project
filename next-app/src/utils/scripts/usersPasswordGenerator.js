/**
 * Password Generator Script for ERP Users
 * 
 * This script:
 * 1. Generates strong random passwords for all users in users.json
 * 2. Hashes passwords using SHA-256 and updates users.json
 * 3. Saves plain-text passwords to passwords_users_secret.json for reference
 * 
 * Usage: node src/utils/scripts/usersPasswordGenerator.js
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Configuration
const USERS_JSON_PATH = path.join(__dirname, '../../app/db/users.json');
const PASSWORDS_SECRET_PATH = path.join(__dirname, '../../app/db/passwords_users_secret.json');

// Password generation settings
const PASSWORD_LENGTH = 16;
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SPECIAL = '!@#$%^&*';
const ALL_CHARS = UPPERCASE + LOWERCASE + NUMBERS + SPECIAL;

/**
 * Generate a strong random password
 * Ensures at least one character from each category
 */
function generatePassword() {
  const passwordArray = [];
  
  // Ensure at least one character from each category
  passwordArray.push(UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)]);
  passwordArray.push(LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)]);
  passwordArray.push(NUMBERS[Math.floor(Math.random() * NUMBERS.length)]);
  passwordArray.push(SPECIAL[Math.floor(Math.random() * SPECIAL.length)]);
  
  // Fill the rest with random characters
  for (let i = passwordArray.length; i < PASSWORD_LENGTH; i++) {
    passwordArray.push(ALL_CHARS[Math.floor(Math.random() * ALL_CHARS.length)]);
  }
  
  // Shuffle the password array
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }
  
  return passwordArray.join('');
}

/**
 * Hash a password using SHA-256
 */
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Main function to generate passwords for all users
 */
function generateAllPasswords() {
  console.log('🔐 Password Generator for ERP Users');
  console.log('====================================\n');
  
  // Read users.json
  let users;
  try {
    const usersData = fs.readFileSync(USERS_JSON_PATH, 'utf8');
    users = JSON.parse(usersData);
    console.log(`✅ Loaded ${users.length} users from users.json\n`);
  } catch (error) {
    console.error('❌ Error reading users.json:', error.message);
    process.exit(1);
  }
  
  // Generate passwords and create secrets object
  const passwordSecrets = {};
  
  users.forEach(user => {
    const plainPassword = generatePassword();
    const hashedPassword = hashPassword(plainPassword);
    
    // Update user's password with hash
    user.password = hashedPassword;
    
    // Store plain password in secrets (keyed by username for easy reference)
    passwordSecrets[user.username] = {
      email: user.email,
      password: plainPassword,
      role: user.role
    };
    
    console.log(`🔑 Generated password for: ${user.username}`);
  });
  
  // Write updated users.json with hashed passwords
  try {
    fs.writeFileSync(USERS_JSON_PATH, JSON.stringify(users, null, 2));
    console.log('\n✅ Updated users.json with hashed passwords');
  } catch (error) {
    console.error('❌ Error writing users.json:', error.message);
    process.exit(1);
  }
  
  // Write passwords_users_secret.json with plain passwords
  try {
    const secretContent = {
      _generated: new Date().toISOString(),
      _warning: 'KEEP THIS FILE SECRET! Contains plain-text passwords for reference.',
      users: passwordSecrets
    };
    fs.writeFileSync(PASSWORDS_SECRET_PATH, JSON.stringify(secretContent, null, 2));
    console.log('✅ Created passwords_users_secret.json with plain-text passwords');
  } catch (error) {
    console.error('❌ Error writing passwords_users_secret.json:', error.message);
    process.exit(1);
  }
  
  console.log('\n====================================');
  console.log('🎉 Password generation complete!');
  console.log('\n⚠️  IMPORTANT:');
  console.log('   - passwords_users_secret.json contains plain-text passwords');
  console.log('   - Make sure this file is in .gitignore');
  console.log('   - Share passwords securely with users');
}

// Run the script
generateAllPasswords();
