// Local server available at http://172.19.181.123:3000/
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userauth = require('./modules/userauth');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World 3!');
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from Node.js server!' });
});

app.post('/api/login', (req, res) => {
  console.log('Login request received:', req.body); // For debugging
  const { username, password } = req.body;
  const authResult = userauth.authenticate(username, password);

  if (authResult.success) {
    res.json({ token: authResult.token });
  } else {
    res.status(401).json({ message: 'Authentication failed' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});