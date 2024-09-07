// Local server available at http://172.19.181.123:3000/
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userauth = require('./modules/userauth');
const authRoutes = require('./routes/auth');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello World 3!');
});
const uname = hashPassword('password123');
const password = hashPassword('password456');

let creds = {'uname':uname, 'password':password};
app.get('/api/data', (req, res) => {
  res.json({ message: `Hello from Node.js server - ${creds}` });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});


async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log(`Hashed password for '${password}':`, hash);
}

