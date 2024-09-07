const express = require('express');
const router = express.Router();
const userAuth = require('../modules/userauth');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received login request:', { username, password });
  
  const result = await userAuth.authenticate(username, password);
  console.log('Authentication result:', result);
  
  if (result.success) {
    res.json({ token: result.token });
  } else {
    res.status(401).json({ message: 'Invalid username or password. Please try again.' });
  }
});

module.exports = router;