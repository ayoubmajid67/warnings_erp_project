const fs = require('fs');
const path = require('path');

// Path to members.json
const membersPath = path.join(__dirname, 'src', 'app', 'db', 'members.json');

// Read the members file
const membersData = fs.readFileSync(membersPath, 'utf8');
const members = JSON.parse(membersData);

// Add receivedCred field to each member if it doesn't exist
members.forEach(member => {
  if (!member.hasOwnProperty('receivedCred')) {
    member.receivedCred = false;
  }
});

// Write back to file
fs.writeFileSync(membersPath, JSON.stringify(members, null, 2), 'utf8');

console.log(`✅ Added 'receivedCred' field to ${members.length} members`);
