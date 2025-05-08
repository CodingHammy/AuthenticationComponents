require('dotenv').config();

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

const users = [];

const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // if no email or password is provided, return 400 error
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    return res.status(400).send('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { email, password: hashedPassword };
  users.push(newUser);

  res.status(201).send('User registered successfully');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(users => users.email === email);
  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).send('Invalid email or password');
  }

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
});

app.listen(port, () => {
  console.log(`listening on https://localhost:${port}`);
});
