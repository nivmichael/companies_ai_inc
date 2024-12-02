// scripts/init-db.js
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

async function initializeDB() {
  const client = await MongoClient.connect('mongodb://172.19.181.123:27017');
  const db = client.db('company_db');
  const usersCollection = db.collection('users');

  // Clear existing users
  await usersCollection.deleteMany({});

  // Create test users
  const users = [
    { username: 'admin', password: 'password123' },
    { username: 'user', password: 'password456' }
  ];
  console.log('ok')
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await usersCollection.insertOne({
      username: user.username,
      password: hashedPassword,
      createdAt: new Date(),
      lastLogin: null
    });
  }

  console.log('Database initialized with test users');
  await client.close();
}

initializeDB().catch(console.error);