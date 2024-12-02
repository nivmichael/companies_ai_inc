// server/modules/userauth.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const MONGODB_URL = 'mongodb://172.19.181.123:27017';
const DB_NAME = 'company_db';
const COLLECTION_NAME = 'users';
const SECRET_KEY = 'your-secret-key'; // Replace with a secure secret key in production

let db = null;
let usersCollection = null;

// Initialize MongoDB connection
async function connectDB() {
  if (db) return db;
  
  try {
    const client = await MongoClient.connect(MONGODB_URL);
    db = client.db(DB_NAME);
    usersCollection = db.collection(COLLECTION_NAME);
    console.log('Successfully connected to MongoDB');
    
    // Create indexes for username (if they don't exist)
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Helper function to create a new user
async function createUser(username, password) {
  await connectDB();
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const result = await usersCollection.insertOne({
      username,
      password: hashedPassword,
      createdAt: new Date(),
      lastLogin: null
    });
    return result;
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      throw new Error('Username already exists');
    }
    throw error;
  }
}

// Main authentication function
async function authenticate(username, password) {
  await connectDB();
  
  try {
    const user = await usersCollection.findOne({ username });
    
    if (!user) {
      console.log('User not found:', username);
      return { success: false };
    }

    const match = await bcrypt.compare(password, user.password);
    
    if (match) {
      console.log('Authentication successful for user:', username);
      
      // Update last login timestamp
      await usersCollection.updateOne(
        { username },
        { $set: { lastLogin: new Date() } }
      );

      // Generate JWT token
      const token = jwt.sign(
        { 
          username,
          id: user._id.toString()
        },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      return {
        success: true,
        token,
        username: user.username
      };
    }

    console.log('Invalid password for user:', username);
    return { success: false };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

// Helper function to get user by username
async function getUserByUsername(username) {
  await connectDB();
  return usersCollection.findOne({ username }, { projection: { password: 0 } });
}

module.exports = {
  authenticate,
  createUser,
  getUserByUsername,
  connectDB
};