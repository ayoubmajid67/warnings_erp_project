const fs = require('fs');
const path = require('path');

// Path to passwords file
const passwordsPath = path.join(__dirname, 'src', 'app', 'db', 'passwords_users_secret.json');

try {
  // Read the passwords file
  let passwords = {};
  
  if (fs.existsSync(passwordsPath)) {
    const data = fs.readFileSync(passwordsPath, 'utf8');
    passwords = JSON.parse(data);
  }

  // Check structure and add test user
  if (passwords.users) {
    // Object structure: { users: { "Name": { email, password } } }
    passwords.users['TEST USER - Ayoub Majid'] = {
      email: 'ayoubmajid071@gmail.com',
      password: '123456',
      role: 'user'
    };
    
    // Update generation timestamp
    passwords._generated = new Date().toISOString();
    
    console.log('✅ Added test user to passwords file (object structure)');
  } else if (Array.isArray(passwords)) {
    // Array structure: [{ email, password }, ...]
    const existingIndex = passwords.findIndex(p => p.email === 'ayoubmajid071@gmail.com');
    
    if (existingIndex >= 0) {
      passwords[existingIndex].password = '123456';
      console.log('✅ Updated test user password (array structure)');
    } else {
      passwords.push({
        email: 'ayoubmajid071@gmail.com',
        password: '123456',
        name: 'TEST USER - Ayoub Majid'
      });
      console.log('✅ Added test user to passwords file (array structure)');
    }
  } else {
    // Initialize with object structure
    passwords = {
      _generated: new Date().toISOString(),
      _warning: 'KEEP THIS FILE SECRET! Contains plain text passwords for development only.',
      users: {
        'TEST USER - Ayoub Majid': {
          email: 'ayoubmajid071@gmail.com',
          password: '123456',
          role: 'user'
        }
      }
    };
    console.log('✅ Created passwords file with test user');
  }

  // Write back to file
  fs.writeFileSync(passwordsPath, JSON.stringify(passwords, null, 2), 'utf8');
  console.log('✅ Passwords file updated successfully');
  console.log('\nTest User Credentials:');
  console.log('Email: ayoubmajid071@gmail.com');
  console.log('Password: 123456');

} catch (error) {
  console.error('❌ Error updating passwords file:', error.message);
  process.exit(1);
}
