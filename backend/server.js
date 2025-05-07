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

app.listen(port, () => {
  console.log(`listening on https://localhost:${port}`);
});
