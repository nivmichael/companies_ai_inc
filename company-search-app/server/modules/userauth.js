// server/modules/userauth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const users = {
  'admin': '$2b$10$KxnOIL5PqY3MiLy6JMZNQeh2O4bBaExk0wjGTmnOt.UKYBERYgy6e', // hashed 'password123'
  'user': '$2b$10$JXP4gDyAeuizWZa8CAhEtO6uKACIC8a2cdalesXj9Hz/hhe9A18BG' // hashed 'password456'
};

const SECRET_KEY = 'your-secret-key'; // Replace with a secure secret key

module.exports = {
  async authenticate(username, password) {
    console.log('Attempting to authenticate:', username); // For debugging
    if (users[username]) {
      const match = await bcrypt.compare(password, users[username]);
      if (match) {
        console.log('Authentication successful');
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return {
          success: true,
          token
        };
      }
    }
    console.log('Authentication failed'); // For debugging
    return {
      success: false
    };
  }
};