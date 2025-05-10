const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();
const users = [];

router.post('/register', async (req, res) => {
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

router.post('/login', async (req, res) => {
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

router.get('/dashboard', authenticateToken, (req, res) => {
  res
    .status(200)
    .json({ message: 'Welcome to the dashboard! ', user: req.user });
});

module.exports = router;
