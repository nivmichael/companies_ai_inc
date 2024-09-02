// Local server available at http://172.19.181.123:3000/
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World 3!');
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from Node.js server!' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});