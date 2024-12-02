// tests/auth.test.js
const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authModule = require('../modules/userauth');

// Mock the users object
jest.mock('../modules/userauth', () => ({
  users: {
    'admin': '',
    'user': ''
  },
  SECRET_KEY: 'test-secret-key',
  authenticate: jest.fn()
}));

const app = express();
app.use(express.json());

// Simple route to test authentication
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await authModule.authenticate(username, password);
  if (result.success) {
    res.json({ token: result.token });
  } else {
    res.status(401).json({ message: 'Authentication failed' });
  }
});

beforeAll(async () => {
  // Generate hashed passwords for test users
  authModule.users.admin = await bcrypt.hash('password123', 10);
  authModule.users.user = await bcrypt.hash('password456', 10);
});

describe('Authentication Module', () => {
  it('should authenticate valid credentials', async () => {
    authModule.authenticate.mockImplementation(async (username, password) => {
      const hashedPassword = authModule.users[username];
      if (hashedPassword && await bcrypt.compare(password, hashedPassword)) {
        return {
          success: true,
          token: jwt.sign({ username }, authModule.SECRET_KEY, { expiresIn: '1h' })
        };
      }
      return { success: false };
    });

    const response = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'password123' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'wrongpassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: 'Authentication failed' });
  });

  it('should reject non-existent users', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ username: 'nonexistent', password: 'password123' });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({ message: 'Authentication failed' });
  });
});