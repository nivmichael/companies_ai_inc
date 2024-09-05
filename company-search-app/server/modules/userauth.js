// server/modules/userauth.js
const crypto = require('crypto');

const users = {
  'admin': 'password123',
  'user': 'password456'
};

function generateToken() {
  return crypto.randomBytes(64).toString('hex');
}

module.exports = {
  authenticate(username, password) {
    console.log('Attempting to authenticate:', username); // For debugging
    if (users[username] && users[username] === password) {
      console.log('Authentication successful'); // For debugging
      return {
        success: true,
        token: generateToken()
      };
    }
    console.log('Authentication failed'); // For debugging
    return {
      success: false
    };
  }
};